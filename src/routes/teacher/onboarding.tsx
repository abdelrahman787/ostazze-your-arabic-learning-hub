import { createFileRoute } from "@tanstack/react-router";
import TeacherOnboarding from "@/pages/TeacherOnboarding";
import ProtectedRoute from "@/components/ProtectedRoute";

export const Route = createFileRoute("/teacher/onboarding")({
  component: () => (
    <ProtectedRoute>
      <TeacherOnboarding />
    </ProtectedRoute>
  ),
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
});
