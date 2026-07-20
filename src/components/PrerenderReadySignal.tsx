import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { signalPrerenderReady, IS_PRERENDER } from "@/lib/prerender";

/**
 * Signals `window.__PRERENDER_READY__ = true` once (a) the route's Suspense
 * chunk has mounted, evidenced by an <h1> appearing under #root, and (b)
 * two RAFs have elapsed so react-helmet-async has flushed <title>/<meta>.
 * Falls back to a 6s hard timeout, but does NOT fire on partial content;
 * the outer prerender script will fail the route in that case.
 * No-op outside prerender.
 */
export default function PrerenderReadySignal() {
  const location = useLocation();
  useEffect(() => {
    if (!IS_PRERENDER) return;
    let cancelled = false;
    const start = Date.now();
    const HARD_TIMEOUT_MS = 6000;

    const check = () => {
      if (cancelled) return;
      const root = document.getElementById("root");
      const h1 = root?.querySelector("h1");
      const titleOk = document.title && document.title !== "Lovable App";
      if (h1 && titleOk) {
        // Give Helmet + late Suspense a final tick, then signal.
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            if (!cancelled) signalPrerenderReady();
          })
        );
        return;
      }
      if (Date.now() - start > HARD_TIMEOUT_MS) {
        // Do NOT signal — let the renderer time out and fail this route.
        return;
      }
      setTimeout(check, 50);
    };
    check();
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);
  return null;
}
