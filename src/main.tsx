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

startPerfMonitor();
initMotionVisibility();

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(<App />);
} else {
  console.error("[OSTAZE] #root element not found");
}
