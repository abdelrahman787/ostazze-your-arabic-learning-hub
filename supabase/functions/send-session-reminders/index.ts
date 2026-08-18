import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendWapilotText } from "../_shared/wapilot.ts";

serve(async (req) => {
  if (req.method !== "POST" && req.method !== "GET") return new Response("Method not allowed", { status: 405 });
  try {
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const today = new Date().toISOString().slice(0, 10);
    const { data: requests, error } = await admin.from("session_requests")
      .select("id, student_id, subject, preferred_date, preferred_time, zoom_url, whatsapp_reminder_1h_sent_at, whatsapp_start_sent_at")
      .eq("status", "confirmed")
      .not("zoom_url", "is", null)
      .gte("preferred_date", today);
    if (error) throw error;

    const studentIds = [...new Set((requests || []).map((r) => r.student_id))];
    const { data: profiles } = studentIds.length
      ? await admin.from("profiles").select("user_id, full_name, phone").in("user_id", studentIds)
      : { data: [] };
    const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));
    const now = Date.now();
    const results: Array<Record<string, unknown>> = [];

    for (const request of requests || []) {
      if (!request.preferred_date || !request.preferred_time) continue;
      const startsAt = new Date(`${request.preferred_date}T${String(request.preferred_time).slice(0, 8)}+03:00`).getTime();
      const minutesUntil = (startsAt - now) / 60000;
      const student = profileMap.get(request.student_id);
      if (!student?.phone) continue;

      if (minutesUntil >= 50 && minutesUntil <= 70 && !request.whatsapp_reminder_1h_sent_at) {
        await sendWapilotText(student.phone, `تذكير من أستاذي: محاضرتك بعد حوالي ساعة.\nرابط Zoom: ${request.zoom_url}`);
        await admin.from("session_requests").update({ whatsapp_reminder_1h_sent_at: new Date().toISOString() }).eq("id", request.id);
        results.push({ id: request.id, type: "one_hour", sent: true });
      } else if (minutesUntil >= 0 && minutesUntil <= 15 && !request.whatsapp_start_sent_at) {
        await sendWapilotText(student.phone, `حان موعد محاضرتك الآن من أستاذي.\nرابط Zoom: ${request.zoom_url}`);
        await admin.from("session_requests").update({ whatsapp_start_sent_at: new Date().toISOString() }).eq("id", request.id);
        results.push({ id: request.id, type: "start", sent: true });
      }
    }

    return new Response(JSON.stringify({ success: true, results }), { headers: { "Content-Type": "application/json" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("send-session-reminders error:", message);
    return new Response(JSON.stringify({ success: false, error: message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
