import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createZoomMeeting } from "../_shared/zoom.ts";
import { sendWapilotText } from "../_shared/wapilot.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) throw new Error("Unauthorized");

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: caller, error: callerError } = await admin.auth.getUser(authHeader.slice(7));
    if (callerError || !caller.user) throw new Error("Unauthorized");
    const { data: role } = await admin.from("user_roles").select("role").eq("user_id", caller.user.id).eq("role", "admin").maybeSingle();
    if (!role) throw new Error("Only admins can confirm session requests.");

    const { request_id } = await req.json() as { request_id?: string };
    if (!request_id) throw new Error("request_id is required.");

    const { data: request, error: requestError } = await admin.from("session_requests").select("*").eq("id", request_id).single();
    if (requestError || !request) throw new Error("Session request not found.");
    if (!request.teacher_id) throw new Error("Assign a teacher before confirming the request.");

    if (request.status === "confirmed" && request.zoom_url) {
      return new Response(JSON.stringify({ success: true, zoom_url: request.zoom_url, already_confirmed: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const date = request.preferred_date || new Date().toISOString().slice(0, 10);
    const time = request.preferred_time || "09:00:00";
    const startTime = `${date}T${String(time).slice(0, 8)}+03:00`;
    const meeting = await createZoomMeeting({
      topic: `OSTAZE - ${request.subject || "Private session"}`,
      startTime,
      duration: 60,
    });

    const { error: updateError } = await admin.from("session_requests").update({
      status: "confirmed",
      zoom_url: meeting.join_url,
      assigned_by: caller.user.id,
    }).eq("id", request_id);
    if (updateError) throw updateError;

    const [{ data: student }, { data: teacher }] = await Promise.all([
      admin.from("profiles").select("full_name, phone").eq("user_id", request.student_id).maybeSingle(),
      admin.from("profiles").select("full_name").eq("user_id", request.teacher_id).maybeSingle(),
    ]);

    let whatsapp: Record<string, unknown> | null = null;
    let whatsapp_error: string | null = null;
    if (student?.phone) {
      try {
        whatsapp = await sendWapilotText(student.phone, [
          `مرحبًا ${student.full_name || ""}`.trim(),
          `تم تأكيد محاضرتك مع ${teacher?.full_name || "المدرس"}.`,
          `الموعد: ${date} ${String(time).slice(0, 5)}`,
          `رابط Zoom: ${meeting.join_url}`,
        ].join("\n"));
      } catch (error) {
        whatsapp_error = error instanceof Error ? error.message : String(error);
        console.error("WhatsApp confirmation failed:", whatsapp_error);
      }
    } else {
      whatsapp_error = "Student has no phone number.";
    }

    return new Response(JSON.stringify({ success: true, zoom_url: meeting.join_url, whatsapp, whatsapp_error }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("confirm-session-request error:", message);
    return new Response(JSON.stringify({ success: false, error: message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
