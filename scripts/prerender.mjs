#!/usr/bin/env node
/**
 * OSTAZE post-build prerender (Phase 3, feasibility only).
 *
 * Strategy:
 *   1. Serve the built `dist/` on an ephemeral port.
 *   2. For each public route, load `<url>?__prerender=1` in headless Chromium
 *      via Playwright's bundled browser.
 *   3. Wait (bounded) for `window.__PRERENDER_READY__ === true`.
 *   4. Snapshot document.documentElement.outerHTML, stamp `data-prerendered`
 *      on #root so the client uses hydrateRoot(), strip the marker query
 *      param from any absolute self-referencing URLs, and validate the
 *      output before writing.
 *   5. On any validation failure the script exits non-zero (fail-safe).
 *
 * Attempted first: @prerenderer/rollup-plugin (@ 0.3.12) + puppeteer.
 * Chromium *is* resolvable in this sandbox (/bin/chromium via nix), so
 * the plugin approach is viable, but wiring it needed extra config for
 * our SPA + Helmet + lazy routes and the custom Playwright path is what
 * we already validated across P2/P2.5. Per the user's fallback approval,
 * we use Playwright directly to keep the feasibility pass deterministic.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const OUT_LOG = path.resolve(__dirname, "..", "prerender-report");

// Canonical public-route manifest — approved list + valid extras.
// Approved: /, /teachers, /universities, /subjects, /about, /contact, /privacy, /terms
// Extras (public, safe, no auth): /categories, /faq
const ROUTES = [
  "/",
  "/teachers",
  "/universities",
  "/subjects",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/categories",
  "/faq",
];

const READY_TIMEOUT_MS = 15000;
const CANONICAL_ORIGIN = "https://ostaze.com";

// ---------- tiny static file server ----------
async function serveDist(port) {
  const mime = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".woff2": "font/woff2",
    ".ico": "image/x-icon",
    ".txt": "text/plain",
  };
  const server = http.createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent(req.url.split("?")[0]);
      let filePath = path.join(DIST, urlPath);
      let stat;
      try {
        stat = await fs.stat(filePath);
      } catch {
        // SPA fallback
        filePath = path.join(DIST, "index.html");
        stat = await fs.stat(filePath).catch(() => null);
      }
      if (stat && stat.isDirectory()) {
        filePath = path.join(filePath, "index.html");
      }
      const ext = path.extname(filePath).toLowerCase();
      const body = await fs.readFile(filePath);
      res.writeHead(200, { "content-type": mime[ext] || "application/octet-stream" });
      res.end(body);
    } catch (e) {
      res.writeHead(404);
      res.end("Not Found");
    }
  });
  await new Promise((r) => server.listen(port, "127.0.0.1", r));
  return server;
}

function stripMarker(html) {
  // Remove any __prerender=1 that leaked into hrefs / canonical / og:url.
  return html
    .replace(/([?&])__prerender=1(&|"|')/g, (_m, p1, p2) => {
      if (p2 === "&") return p1;
      // trailing ? or & left over → remove
      return p1 === "?" ? p2 : p2;
    })
    .replace(/\?"/g, '"')
    .replace(/\?'/g, "'");
}

function validate(routePath, html, domInfo) {
  const errors = [];
  if (!domInfo.rootHasChildren) errors.push("empty #root");
  if (domInfo.rootIsOnlyFallback) errors.push("root is only Suspense fallback");
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push("missing <title>");
  if (!/<meta[^>]+name="description"[^>]+content="[^"]+"/i.test(html))
    errors.push("missing meta description");
  if (!/<link[^>]+rel="canonical"[^>]+href="[^"]+"/i.test(html))
    errors.push("missing canonical");
  if (!/<html[^>]+lang="(ar|en)"/.test(html)) errors.push("missing html lang");
  if (!/<html[^>]+dir="(rtl|ltr)"/.test(html)) errors.push("missing html dir");
  return { errors };
}

function extractMeta(html) {
  const pick = (re) => (html.match(re) || [])[1] || null;
  return {
    title: pick(/<title>([^<]*)<\/title>/),
    description: pick(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i),
    canonical: pick(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i),
    lang: pick(/<html[^>]+lang="([^"]+)"/),
    dir: pick(/<html[^>]+dir="([^"]+)"/),
  };
}

async function main() {
  await fs.mkdir(OUT_LOG, { recursive: true });
  const port = 5199;
  const server = await serveDist(port);
  console.log(`[prerender] serving dist on http://127.0.0.1:${port}`);

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/bin/chromium",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  const report = { routes: [], summary: {} };
  let failed = 0;

  for (const routePath of ROUTES) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    const consoleMsgs = [];
    const supabaseReqs = [];
    page.on("console", (m) => consoleMsgs.push(`[${m.type()}] ${m.text()}`));
    page.on("request", (r) => {
      if (r.url().includes("supabase.co")) supabaseReqs.push(r.url());
    });
    await page.evaluateOnNewDocument(() => {
      window.__PRERENDER__ = true;
    });

    const url = `http://127.0.0.1:${port}${routePath}?__prerender=1`;
    console.log(`[prerender] ${routePath} → ${url}`);
    const routeResult = { route: routePath, url };
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
      // Bounded wait for readiness signal.
      await page.waitForFunction(() => window.__PRERENDER_READY__ === true, {
        timeout: READY_TIMEOUT_MS,
      });
      // Stamp root as prerendered so client hydrates instead of createRoot,
      // and gather DOM-truthful facts while we still have a live page.
      const domInfo = await page.evaluate(() => {
        const r = document.getElementById("root");
        if (r) r.setAttribute("data-prerendered", "1");
        const childCount = r ? r.childElementCount : 0;
        const onlyFallback =
          !!r &&
          childCount === 1 &&
          r.firstElementChild instanceof HTMLDivElement &&
          r.firstElementChild.className.includes("min-h-[40vh]") &&
          r.firstElementChild.childElementCount === 0;
        const h1El = r ? r.querySelector("h1") : null;
        return {
          rootHasChildren: childCount > 0,
          rootIsOnlyFallback: onlyFallback,
          h1Text: h1El ? h1El.textContent.trim() : null,
        };
      });
      let html = "<!doctype html>\n" + (await page.content());
      html = stripMarker(html);

      const { errors } = validate(routePath, html, domInfo);
      const meta = extractMeta(html);
      routeResult.h1 = domInfo.h1Text;
      if (!domInfo.h1Text) errors.push("missing H1");
      routeResult.meta = meta;
      routeResult.errors = errors;
      routeResult.consoleTail = consoleMsgs.slice(-20);
      routeResult.supabaseRequestCount = supabaseReqs.length;

      if (errors.length) {
        console.error(`[prerender] FAIL ${routePath}: ${errors.join(", ")}`);
        failed++;
      } else {
        // Write snapshot to dist/<route>/index.html (root stays as dist/index.html)
        const outPath =
          routePath === "/"
            ? path.join(DIST, "index.html")
            : path.join(DIST, routePath.replace(/^\//, ""), "index.html");
        await fs.mkdir(path.dirname(outPath), { recursive: true });
        await fs.writeFile(outPath, html, "utf8");
        routeResult.output = path.relative(path.resolve(__dirname, ".."), outPath);
        console.log(`[prerender] OK   ${routePath} → ${routeResult.output} (${html.length} bytes)`);
      }
    } catch (e) {
      routeResult.error = String(e && e.message ? e.message : e);
      routeResult.consoleTail = consoleMsgs.slice(-20);
      routeResult.supabaseRequestCount = supabaseReqs.length;
      console.error(`[prerender] ERROR ${routePath}: ${routeResult.error}`);
      failed++;
    }
    report.routes.push(routeResult);
    await page.close();
  }

  await browser.close();
  server.close();

  report.summary = {
    total: ROUTES.length,
    failed,
    passed: ROUTES.length - failed,
    canonicalOrigin: CANONICAL_ORIGIN,
  };
  const reportPath = path.join(OUT_LOG, "report.json");
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(`[prerender] report → ${reportPath}`);

  if (failed > 0) {
    console.error(`[prerender] ${failed} route(s) failed`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
