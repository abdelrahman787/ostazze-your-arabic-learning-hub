import { createFileRoute } from "@tanstack/react-router";
import { redirectLegacySubjectQuery } from "@/lib/routeGuards";
import Subjects from "@/pages/Subjects";

export const Route = createFileRoute("/subjects/")({
  beforeLoad: ({ search }) =>
    redirectLegacySubjectQuery(search as Record<string, unknown>),
  component: Subjects,
});
