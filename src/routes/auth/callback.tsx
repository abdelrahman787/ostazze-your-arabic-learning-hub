import { createFileRoute } from "@tanstack/react-router";
import AuthCallback from "@/pages/AuthCallback";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
  head: () => ({
    meta: [
      { title: "Account Recovery | OSTAZE" },
      { name: "description", content: "Securely complete your OSTAZE password recovery request." },
      { property: "og:title", content: "Account Recovery | OSTAZE" },
      { property: "og:description", content: "Securely complete your OSTAZE password recovery request." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});