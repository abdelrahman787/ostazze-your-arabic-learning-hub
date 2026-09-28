import { createFileRoute } from "@tanstack/react-router";
import CourseDetail from "@/pages/CourseDetail";

export const Route = createFileRoute("/courses/$id")({
  component: CourseDetail,
});
