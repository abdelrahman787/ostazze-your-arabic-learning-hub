import { createFileRoute } from "@tanstack/react-router";
import ResetPassword from "@/pages/ResetPassword";

export const Route = createFileRoute("/reset-password")({
  component: ResetPassword,
  head: () => ({ meta: [
    { title: "Reset Password | OSTAZE" },
    { name: "description", content: "Set a new password for your OSTAZE account." },
    { property: "og:title", content: "Reset Password | OSTAZE" },
    { property: "og:description", content: "Set a new password for your OSTAZE account." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
});
