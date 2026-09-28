import { createFileRoute } from "@tanstack/react-router";
import Teachers from "@/pages/Teachers";

export const Route = createFileRoute("/teachers/")({
  // First page of verified tutors rendered on the server (public fields only).
  loader: async () => ({
    teachers: await (
      await import("@/lib/publicData.functions")
    )
      .listPublicTeachers()
      .catch(() => null),
  }),
  component: TeachersRoute,
});

function TeachersRoute() {
  const { teachers } = Route.useLoaderData();
  if (!teachers) return <Teachers />;
  return (
    <Teachers
      initialTeachers={teachers.map((t) => ({
        ...t,
        full_name: t.full_name || "",
      }))}
    />
  );
}
