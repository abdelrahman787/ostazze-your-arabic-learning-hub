import { createFileRoute } from "@tanstack/react-router";
import CollegeDetail from "@/pages/CollegeDetail";

export const Route = createFileRoute("/universities/$countrySlug/colleges/$collegeId")({
  component: CollegeDetail,
});
