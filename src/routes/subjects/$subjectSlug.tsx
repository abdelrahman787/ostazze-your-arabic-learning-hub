import { createFileRoute } from "@tanstack/react-router";
import { requireSubject } from "@/lib/routeGuards";
import { subjectNameFromSlug } from "@/lib/subjectSlugs";
import type { University } from "@/data/universities/types";
import Subjects from "@/pages/Subjects";

export const Route = createFileRoute("/subjects/$subjectSlug")({
  beforeLoad: ({ params }) => requireSubject(params.subjectSlug),
  // Loads only this subject's slice of the catalog so the first server response has
  // the real course list (not a skeleton) and hydration uses the same data.
  loader: async ({ params }) => {
    const name = subjectNameFromSlug(params.subjectSlug) || "";
    const { SUBJECT_INDEX } =
      await import("@/data/universities/subjectIndex.generated");
    const info = SUBJECT_INDEX.find((s) => s.name_en === name);
    const { loadUniversities } = await import("@/data/universities/loader");
    const all = await loadUniversities(info?.universityIds || []);
    const universities: University[] = all
      .map((u) => ({
        ...u,
        colleges: u.colleges
          .map((c) => ({
            ...c,
            departments: c.departments.filter((d) => d.name_en === name),
          }))
          .filter((c) => c.departments.length > 0),
      }))
      .filter((u) => u.colleges.length > 0);
    return { universities };
  },
  component: SubjectRoute,
});

function SubjectRoute() {
  const { universities } = Route.useLoaderData();
  return <Subjects initialUniversities={universities} />;
}
