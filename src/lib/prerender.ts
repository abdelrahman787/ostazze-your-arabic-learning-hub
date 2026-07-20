/**
 * Prerender detection + readiness signaling.
 *
 * A private query parameter `?__prerender=1` (set by the renderer via
 * `page.goto(url + '?__prerender=1')`) marks the current run as a
 * prerender pass. We also honor a global `window.__PRERENDER__ = true`
 * that a renderer may inject before app scripts execute.
 *
 * Nothing here throws when `window`/`navigator` is unavailable (SSR-safe).
 */

const PRERENDER_QUERY_KEY = "__prerender";

function detect(): boolean {
  try {
    if (typeof window === "undefined") return false;
    if ((window as any).__PRERENDER__ === true) return true;
    const usp = new URLSearchParams(window.location.search);
    return usp.get(PRERENDER_QUERY_KEY) === "1";
  } catch {
    return false;
  }
}

/** True only during a prerender build pass. Safe on server + browser. */
export const IS_PRERENDER: boolean = detect();

/**
 * Signal readiness for a snapshot. Called by public route components after
 * their content, metadata and Suspense boundaries have resolved.
 * No-op when not prerendering.
 */
export function signalPrerenderReady(): void {
  if (!IS_PRERENDER || typeof window === "undefined") return;
  (window as any).__PRERENDER_READY__ = true;
}

/** Strip the private prerender marker from a URL (for canonical output). */
export function stripPrerenderMarker(url: string): string {
  return url.replace(/([?&])__prerender=1(&|$)/, (_m, p1, p2) =>
    p2 === "&" ? p1 : p1 === "?" ? "" : ""
  ).replace(/\?$/, "");
}
