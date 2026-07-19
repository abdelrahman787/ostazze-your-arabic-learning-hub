/**
 * P2.5 — Pause decorative CSS animations when the tab is hidden.
 * Toggles `data-motion-paused="1"` on <html>; CSS in index.css uses that
 * attribute to set `animation-play-state: paused` globally.
 *
 * Tiny, zero-dep, mounted once from main.tsx. Adds no initial JS beyond a
 * single event listener registration.
 */
export function initMotionVisibility() {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  const sync = () => {
    if (document.hidden) html.setAttribute("data-motion-paused", "1");
    else html.removeAttribute("data-motion-paused");
  };
  document.addEventListener("visibilitychange", sync, { passive: true });
  sync();
}
