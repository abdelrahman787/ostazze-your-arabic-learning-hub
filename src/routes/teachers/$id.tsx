import { createFileRoute, notFound } from "@tanstack/react-router";
import TeacherProfile from "@/pages/TeacherProfile";

export const Route = createFileRoute("/teachers/$id")({
  loader: async ({ params }) => {
    const teacher = await (
      await import("@/lib/publicData.functions")
    ).getPublicTeacher({ data: { id: params.id } });
    if (!teacher) throw notFound();
    return { teacher };
  },
  component: TeacherRoute,
  // Unverified/unknown tutors return 404 to visitors; the page still loads client-side
  // for the tutor themself or an admin (their session can read it), never indexed.
  notFoundComponent: TeacherFallback,
});

function TeacherRoute() {
  const { teacher } = Route.useLoaderData();
  return <TeacherProfile initialTeacher={teacher} />;
}

function TeacherFallback() {
  return (
    <>
      <meta name="robots" content="noindex,nofollow" />
      <TeacherProfile />
    </>
  );
}
