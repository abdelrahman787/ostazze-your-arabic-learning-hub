import { createFileRoute } from "@tanstack/react-router";
import LectureView from "@/pages/LectureView";
import ProtectedRoute from "@/components/ProtectedRoute";

export const Route = createFileRoute("/lectures/$id")({
  component: () => (
    <ProtectedRoute>
      <LectureView />
    </ProtectedRoute>
  ),
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
});
