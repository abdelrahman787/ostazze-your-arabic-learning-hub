import { createFileRoute, notFound } from "@tanstack/react-router";
import IgcseCourseDetail from "@/pages/IgcseCourseDetail";
import NotFound from "@/pages/NotFound";
import { IG_COURSES } from "@/data/igcse";

export const Route = createFileRoute("/igcse/$courseId")({
  loader: ({ params }) => {
    const course = IG_COURSES.find((c) => c.id === params.courseId);
    if (!course) throw notFound();
    return { courseId: course.id };
  },
  head: ({ loaderData }) => {
    const c =
      loaderData && IG_COURSES.find((x) => x.id === loaderData.courseId);
    if (!c)
      return {
        meta: [
          { title: "الصفحة غير موجودة | OSTAZE" },
          { name: "robots", content: "noindex,nofollow" },
        ],
      };
    const title = `${c.title} — كورس IGCSE | OSTAZE`;
    const desc = `كورس ${c.title} (${c.board}) أونلاين لطلاب IGCSE بسعر ثابت ${c.priceEGP.toLocaleString("en-US")} جنيه.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: CourseRoute,
  notFoundComponent: NotFound,
});

function CourseRoute() {
  const { courseId } = Route.useLoaderData();
  return <IgcseCourseDetail courseId={courseId} />;
}
