import { createFileRoute } from "@tanstack/react-router";
import Igcse from "@/pages/Igcse";

export const Route = createFileRoute("/igcse/")({
  head: () => ({
    meta: [
      { title: "كورسات IGCSE | OSTAZE" },
      {
        name: "description",
        content:
          "كورسات IGCSE أونلاين في الفيزياء والكيمياء والأحياء والرياضيات والإنجليزية، بسعر ثابت لكل كورس.",
      },
      { property: "og:title", content: "كورسات IGCSE | OSTAZE" },
      {
        property: "og:description",
        content: "كورسات IGCSE أونلاين بسعر ثابت لكل كورس مع معلمين متخصصين.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Igcse,
});
