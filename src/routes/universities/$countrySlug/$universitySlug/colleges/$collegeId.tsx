import { createFileRoute } from "@tanstack/react-router";
import CollegeDetail from "@/pages/CollegeDetail";

export const Route = createFileRoute("/universities/$countrySlug/$universitySlug/colleges/$collegeId")({
  component: CollegeDetail,
});
