import { createFileRoute } from "@tanstack/react-router";
import Igcse from "@/pages/Igcse";

// Title, description and social tags come from PageHelmet inside the page (same as /pricing).
export const Route = createFileRoute("/igcse/")({
  component: Igcse,
});
