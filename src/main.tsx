import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { startPerfMonitor } from "./lib/perfMonitor";

console.log("[OSTAZE] main.tsx loaded");

// Start lightweight performance monitor (LCP/CLS + jank detection).
// Logs to the developer console only — no UI side effects.
startPerfMonitor();

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(<App />);
} else {
  console.error("[OSTAZE] #root element not found");
}
