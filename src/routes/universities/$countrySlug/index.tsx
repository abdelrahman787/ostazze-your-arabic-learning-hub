import { createFileRoute } from "@tanstack/react-router";
import Universities from "@/pages/Universities";

export const Route = createFileRoute("/universities/$countrySlug/")({
  component: Universities,
});
