import { createFileRoute } from "@tanstack/react-router";

// Liveness check for any host (load balancers, uptime monitors). No data, never cached.
export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: () =>
        new Response(JSON.stringify({ status: "ok" }), {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
        }),
    },
  },
});
