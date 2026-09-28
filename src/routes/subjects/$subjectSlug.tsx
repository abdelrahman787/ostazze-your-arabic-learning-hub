import { createFileRoute } from "@tanstack/react-router";
import { requireSubject } from "@/lib/routeGuards";
import Subjects from "@/pages/Subjects";

export const Route = createFileRoute("/subjects/$subjectSlug")({
  beforeLoad: ({ params }) => requireSubject(params.subjectSlug),
  component: Subjects,
});
