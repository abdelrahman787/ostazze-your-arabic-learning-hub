import { createFileRoute } from "@tanstack/react-router";
import Igcse from "@/pages/Igcse";

const title = "IGCSE Courses — OSTAZE";
const description =
  "Explore online IGCSE courses in Physics, Chemistry, Biology, Mathematics, English and more.";

export const Route = createFileRoute("/igcse/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Igcse,
});