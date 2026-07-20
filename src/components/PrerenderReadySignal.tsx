import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { signalPrerenderReady, IS_PRERENDER } from "@/lib/prerender";

/**
 * Signals `window.__PRERENDER_READY__ = true` after a route's Suspense
 * boundary resolves and Helmet has had a tick to flush metadata.
 * No-op outside prerender.
 */
export default function PrerenderReadySignal() {
  const location = useLocation();
  useEffect(() => {
    if (!IS_PRERENDER) return;
    // Two RAFs give react-helmet-async time to apply <title>/meta,
    // and downstream Suspense children a tick to mount.
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        signalPrerenderReady();
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [location.pathname]);
  return null;
}
