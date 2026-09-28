import { createFileRoute } from "@tanstack/react-router";
import { requireUniversity } from "@/lib/routeGuards";
import Universities from "@/pages/Universities";

export const Route = createFileRoute("/universities/$countrySlug/$universitySlug/")({
  beforeLoad: ({ params }) => requireUniversity(params.countrySlug, params.universitySlug),
  component: Universities,
});
