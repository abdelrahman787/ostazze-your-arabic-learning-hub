import { createFileRoute } from "@tanstack/react-router";
import Checkout from "@/pages/Checkout";
import ProtectedRoute from "@/components/ProtectedRoute";

export const Route = createFileRoute("/checkout/")({
  component: () => (
    <ProtectedRoute>
      <Checkout />
    </ProtectedRoute>
  ),
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
});
