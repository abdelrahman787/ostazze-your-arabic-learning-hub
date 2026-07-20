import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { startPerfMonitor } from "./lib/perfMonitor";
import { initMotionVisibility } from "./lib/motionVisibility";

console.log("[OSTAZE] main.tsx loaded");

startPerfMonitor();
initMotionVisibility();

const rootEl = document.getElementById("root");
if (rootEl) {
  // If the root already contains generated prerendered markup (data-prerendered
  // is stamped by the post-build renderer), hydrate; otherwise create a fresh
  // client-only tree.
  const isPrerendered =
    rootEl.getAttribute("data-prerendered") === "1" &&
    rootEl.childElementCount > 0;
  if (isPrerendered) {
    hydrateRoot(rootEl, <App />);
  } else {
    createRoot(rootEl).render(<App />);
  }
} else {
  console.error("[OSTAZE] #root element not found");
}
