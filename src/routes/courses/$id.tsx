import { createFileRoute, notFound } from "@tanstack/react-router";
import CourseDetail from "@/pages/CourseDetail";
import NotFound from "@/pages/NotFound";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/courses/$id")({
  loader: async ({ params }) => {
    const course = await (
      await import("@/lib/publicData.functions")
    ).getPublicCourse({ data: { id: params.id } });
    if (!course) throw notFound();
    return { course };
  },
  component: CourseRoute,
  // Unpublished/unknown courses return 404 to visitors; admins still see them client-side.
  notFoundComponent: CourseFallback,
});

function CourseRoute() {
  const { course } = Route.useLoaderData();
  return (
    <CourseDetail
      initialCourse={
        course as unknown as NonNullable<
          Parameters<typeof CourseDetail>[0]
        >["initialCourse"]
      }
    />
  );
}

function CourseFallback() {
  // Visitors (and the server response) get a real "not found" page. Only a signed-in
  // user — the owner or an admin — falls through to the private client-side view.
  const { user, loading } = useAuth();
  if (loading || !user) return <NotFound />;
  return (
    <>
      <meta name="robots" content="noindex,nofollow" />
      <CourseDetail />
    </>
  );
}
