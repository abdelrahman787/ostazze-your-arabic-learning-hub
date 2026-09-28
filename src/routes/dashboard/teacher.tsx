import { createFileRoute } from "@tanstack/react-router";
import SmartDashboard from "@/pages/SmartDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

export const Route = createFileRoute("/dashboard/teacher")({
  component: () => (
    <ProtectedRoute>
      <SmartDashboard />
    </ProtectedRoute>
  ),
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
});
