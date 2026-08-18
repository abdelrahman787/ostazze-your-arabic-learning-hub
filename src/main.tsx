import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { startPerfMonitor } from "./lib/perfMonitor";
import { initMotionVisibility } from "./lib/motionVisibility";

console.log("[OSTAZE] main.tsx loaded");

// Safari/WebKit is disproportionately expensive when several Framer Motion
// transforms, filters and a requestAnimationFrame orbit run together. Keep a
// small capability flag so decorative motion can be rendered statically there
// without changing the experience in Chromium browsers.
if (typeof navigator !== "undefined" && typeof document !== "undefined") {
  const isWebKit = /AppleWebKit/i.test(navigator.userAgent) &&
    !/(Chrome|CriOS|FxiOS|EdgiOS|OPiOS|Android)/i.test(navigator.userAgent);
  if (isWebKit) document.documentElement.dataset.webkitLite = "1";
}

startPerfMonitor();
initMotionVisibility();

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(<App />);
} else {
  console.error("[OSTAZE] #root element not found");
}
