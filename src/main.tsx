import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { startPerfMonitor } from "./lib/perfMonitor";
import { initMotionVisibility } from "./lib/motionVisibility";

console.log("[OSTAZE] main.tsx loaded");

startPerfMonitor();
initMotionVisibility();

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(<App />);
} else {
  console.error("[OSTAZE] #root element not found");
}
