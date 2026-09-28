import { createFileRoute } from "@tanstack/react-router";
import { requireCountry } from "@/lib/routeGuards";
import Universities from "@/pages/Universities";

export const Route = createFileRoute("/universities/$countrySlug/")({
  beforeLoad: ({ params }) => requireCountry(params.countrySlug),
  component: Universities,
});
