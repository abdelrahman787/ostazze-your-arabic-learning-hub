import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("[OSTAZE] main.tsx loaded");

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(<App />);
} else {
  console.error("[OSTAZE] #root element not found");
}
