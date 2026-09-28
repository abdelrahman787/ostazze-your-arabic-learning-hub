import { createFileRoute } from "@tanstack/react-router";
import MyBookings from "@/pages/MyBookings";
import ProtectedRoute from "@/components/ProtectedRoute";

export const Route = createFileRoute("/my-bookings")({
  component: () => (
    <ProtectedRoute>
      <MyBookings />
    </ProtectedRoute>
  ),
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
});
