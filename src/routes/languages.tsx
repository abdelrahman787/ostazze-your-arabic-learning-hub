import { createFileRoute } from "@tanstack/react-router";
import Languages from "@/pages/Languages";

export const Route = createFileRoute("/languages")({
  component: Languages,
});
