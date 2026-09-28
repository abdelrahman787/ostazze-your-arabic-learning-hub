import { createFileRoute, notFound } from "@tanstack/react-router";
import TeacherProfile from "@/pages/TeacherProfile";
import NotFound from "@/pages/NotFound";
import { useAuth } from "@/contexts/AuthContext";

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
  // Visitors (and the server response) get a real "not found" page. Only a signed-in
  // user — the owner or an admin — falls through to the private client-side view.
  const { user, loading } = useAuth();
  if (loading || !user) return <NotFound />;
  return (
    <>
      <meta name="robots" content="noindex,nofollow" />
      <TeacherProfile />
    </>
  );
}
