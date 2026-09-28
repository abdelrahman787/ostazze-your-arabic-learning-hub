import { createFileRoute } from "@tanstack/react-router";
import { requireCollege } from "@/lib/routeGuards";
import CollegeDetail from "@/pages/CollegeDetail";

export const Route = createFileRoute(
  "/universities/$countrySlug/$universitySlug/colleges/$collegeId",
)({
  loader: ({ params }) =>
    requireCollege(params.countrySlug, params.universitySlug, params.collegeId),
  component: CollegeDetail,
});
