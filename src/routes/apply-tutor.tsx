import { createFileRoute } from "@tanstack/react-router";
import ApplyTutor from "@/pages/ApplyTutor";

export const Route = createFileRoute("/apply-tutor")({
  component: ApplyTutor,
});
