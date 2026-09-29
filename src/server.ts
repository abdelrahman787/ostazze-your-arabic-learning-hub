import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (
    request: Request,
    env: unknown,
    ctx: unknown,
  ) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(
  response: Response,
): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(
    consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`),
  );
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as {
      unhandled?: unknown;
      message?: unknown;
    };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

// Private areas: never indexed. Sent as a header so crawlers see it before any HTML.
const PRIVATE_PREFIXES = [
  "/admin",
  "/dashboard",
  "/checkout",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/auth/callback",
  "/teacher/onboarding",
  "/my-bookings",
  "/lectures",
  "/zoom-test",
];
const isPrivatePath = (path: string) =>
  PRIVATE_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));

// Trailing-slash variants -> permanent redirect to the canonical no-slash URL (query kept).
function trailingSlashRedirect(request: Request): Response | null {
  if (request.method !== "GET" && request.method !== "HEAD") return null;
  const url = new URL(request.url);
  if (url.pathname === "/" || !url.pathname.endsWith("/")) return null;
  if (url.pathname.startsWith("/_serverFn") || url.pathname.startsWith("/api/"))
    return null;
  const clean = url.pathname.replace(/\/+$/, "") || "/";
  return new Response(null, {
    status: 301,
    headers: { location: `${clean}${url.search}` },
  });
}

// www.ostaze.com -> https://ostaze.com (path + query preserved; host is fixed,
// so the request cannot steer the redirect to another domain).
function canonicalHostRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  if (url.hostname !== "www.ostaze.com") return null;
  return new Response(null, {
    status: 301,
    headers: {
      location: `https://ostaze.com/${url.pathname.replace(/^\/+/, "")}${url.search}`,
    },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const hostRedirect = canonicalHostRedirect(request);
      if (hostRedirect) return hostRedirect;
      const slashRedirect = trailingSlashRedirect(request);
      if (slashRedirect) return slashRedirect;
      const handler = await getServerEntry();
      let response = await handler.fetch(request, env, ctx);
      if (isPrivatePath(new URL(request.url).pathname)) {
        response = new Response(response.body, response);
        response.headers.set("X-Robots-Tag", "noindex, nofollow");
        // Private pages must never be stored by shared caches/CDNs.
        response.headers.set("Cache-Control", "private, no-store");
      }
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
