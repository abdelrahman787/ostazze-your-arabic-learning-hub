import { createFileRoute, notFound } from "@tanstack/react-router";
import { IG_COURSES } from "@/data/igcse";
import IgcseCourseDetail from "@/pages/IgcseCourseDetail";
import NotFound from "@/pages/NotFound";

export const Route = createFileRoute("/igcse/$courseId")({
  loader: ({ params }) => {
    const course = IG_COURSES.find((item) => item.id === params.courseId);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => {
    const course = loaderData?.course;
    const title = course
      ? `${course.title} — IGCSE | OSTAZE`
      : "IGCSE Course Not Found | OSTAZE";
    const description = course
      ? `View the ${course.title} online course, instructor, course outline and enrollment details.`
      : "The requested IGCSE course could not be found.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(!course
          ? [{ name: "robots", content: "noindex,nofollow" }]
          : []),
      ],
    };
  },
  component: IgcseCourseRoute,
  notFoundComponent: NotFound,
});

function IgcseCourseRoute() {
  const { course } = Route.useLoaderData();
  return <IgcseCourseDetail courseId={course.id} />;
}