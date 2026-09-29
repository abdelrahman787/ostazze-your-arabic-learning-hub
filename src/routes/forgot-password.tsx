import { createFileRoute } from "@tanstack/react-router";
import ForgotPassword from "@/pages/ForgotPassword";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPassword,
  head: () => ({
    meta: [
      { title: "Forgot Password | OSTAZE" },
      {
        name: "description",
        content: "Request a secure OSTAZE password reset link.",
      },
      { property: "og:title", content: "Forgot Password | OSTAZE" },
      {
        property: "og:description",
        content: "Request a secure OSTAZE password reset link.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});
