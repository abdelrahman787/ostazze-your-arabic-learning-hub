import { createFileRoute } from "@tanstack/react-router";
import Courses from "@/pages/Courses";

export const Route = createFileRoute("/courses/")({
  // First page of published courses rendered on the server (public fields only).
  loader: async () => ({
    courses: await (
      await import("@/lib/publicData.functions")
    )
      .listPublicCourses()
      .catch(() => null),
  }),
  component: CoursesRoute,
});

function CoursesRoute() {
  const { courses } = Route.useLoaderData();
  if (!courses) return <Courses />;
  return (
    <Courses
      initialCourses={
        courses as NonNullable<Parameters<typeof Courses>[0]>["initialCourses"]
      }
    />
  );
}
