import { createFileRoute } from "@tanstack/react-router";
import { requireCollege } from "@/lib/routeGuards";
import CollegeDetail from "@/pages/CollegeDetail";

export const Route = createFileRoute(
  "/universities/$countrySlug/$universitySlug/colleges/$collegeId",
)({
  // Returns the university so the server HTML and the first browser render match.
  loader: async ({ params }) => ({
    university: await requireCollege(
      params.countrySlug,
      params.universitySlug,
      params.collegeId,
    ),
  }),
  component: CollegeRoute,
});

function CollegeRoute() {
  const { university } = Route.useLoaderData();
  return <CollegeDetail initialUniversity={university} />;
}
