import { createFileRoute } from "@tanstack/react-router";
import TeacherProfile from "@/pages/TeacherProfile";

export const Route = createFileRoute("/teachers/$id")({
  component: TeacherProfile,
});
