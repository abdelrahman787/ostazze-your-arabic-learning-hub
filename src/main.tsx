import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { startPerfMonitor } from "./lib/perfMonitor";
import { initMotionVisibility } from "./lib/motionVisibility";

console.log("[OSTAZE] main.tsx loaded");

// Apple devices are disproportionately expensive when several Framer Motion
// transforms, filters and a requestAnimationFrame orbit run together. This
// includes Chrome on iPhone/iPad (WebKit) and Chrome on macOS (Blink), so use
// the platform rather than the browser engine for the decorative-motion flag.
if (typeof navigator !== "undefined" && typeof document !== "undefined") {
  const isApplePlatform = /Mac|iPhone|iPad|iPod/i.test(navigator.platform) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (isApplePlatform) document.documentElement.dataset.appleMotionLite = "1";
}

// After an update, old page chunks can disappear ("Failed to fetch dynamically
// imported module"). Reload once to pick up the fresh files instead of breaking.
const RELOAD_KEY = "ostaze_chunk_reload";
const reloadOnce = () => {
  if (sessionStorage.getItem(RELOAD_KEY)) return;
  sessionStorage.setItem(RELOAD_KEY, "1");
  window.location.reload();
};
window.addEventListener("vite:preloadError", (e) => { e.preventDefault(); reloadOnce(); });
window.addEventListener("unhandledrejection", (e) => {
  const msg = String((e.reason && e.reason.message) || e.reason || "");
  if (/dynamically imported module|Importing a module script failed/i.test(msg)) reloadOnce();
});
window.addEventListener("load", () => setTimeout(() => sessionStorage.removeItem(RELOAD_KEY), 10000));

startPerfMonitor();
initMotionVisibility();

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(<App />);
} else {
  console.error("[OSTAZE] #root element not found");
}
