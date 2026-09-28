import { createFileRoute } from "@tanstack/react-router";
import { redirectLegacyCollege } from "@/lib/routeGuards";
import CollegeDetail from "@/pages/CollegeDetail";

export const Route = createFileRoute("/universities/$countrySlug/colleges/$collegeId")({
  beforeLoad: ({ params }) => redirectLegacyCollege(params.countrySlug, params.collegeId),
  component: CollegeDetail,
});
