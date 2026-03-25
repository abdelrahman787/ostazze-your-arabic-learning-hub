import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("[OSTAZZE] main.tsx loaded");

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(<App />);
} else {
  console.error("[OSTAZZE] #root element not found");
}
