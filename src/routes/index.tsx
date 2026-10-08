import { createFileRoute } from "@tanstack/react-router";
import Index from "@/pages/Index";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OSTAZE | أستاذي — Online Tutoring & IGCSE Courses" },
      {
        name: "description",
        content:
          "Explore university tutoring, IGCSE courses and live language lessons with OSTAZE أستاذي.",
      },
      { property: "og:title", content: "OSTAZE | University Tutoring & IGCSE" },
      {
        property: "og:description",
        content:
          "Find your next course: university subjects, IGCSE and languages with OSTAZE أستاذي.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "keywords",
        content:
          "أستاذي، استاذي، OSTAZE، IGCSE، دروس خصوصية اونلاين، live online lessons, university tutors",
      },
    ],
    links: [{ rel: "canonical", href: "https://ostaze.com/" }],
  }),
  component: Index,
});
