import { createFileRoute } from "@tanstack/react-router";
import ZoomTestPage from "@/pages/ZoomTestPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export const Route = createFileRoute("/zoom-test")({
  component: () => (
    <ProtectedRoute>
      <ZoomTestPage />
    </ProtectedRoute>
  ),
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
});
