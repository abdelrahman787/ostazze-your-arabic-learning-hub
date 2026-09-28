import { createClient } from "npm:@supabase/supabase-js@2";
import { sendWapilotText } from "../_shared/wapilot.ts";
import { timingSafeEqual } from "../_shared/security.ts";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Dedicated cron secret stored in public.internal_secrets (service role / cron only).
  const provided = req.headers.get("x-cron-secret") ?? "";
  const { data: secretRow, error: secretErr } = await admin
    .from("internal_secrets")
    .select("value")
    .eq("name", "session_reminders_cron")
    .maybeSingle();
  if (secretErr || !secretRow?.value) {
    console.error("send-session-reminders: cron secret unavailable");
    return json({ error: "Unauthorized" }, 401);
  }
  if (!provided || !timingSafeEqual(provided, secretRow.value))
    return json({ error: "Unauthorized" }, 401);

  try {
    const today = new Date().toISOString().slice(0, 10);
    const { data: requests, error } = await admin
      .from("session_requests")
      .select(
        "id, student_id, subject, preferred_date, preferred_time, zoom_url, whatsapp_reminder_1h_sent_at, whatsapp_start_sent_at",
      )
      .eq("status", "confirmed")
      .not("zoom_url", "is", null)
      .gte("preferred_date", today);
    if (error) throw error;

    const studentIds = [...new Set((requests || []).map((r) => r.student_id))];
    const { data: profiles } = studentIds.length
      ? await admin
          .from("profiles")
          .select("user_id, full_name, phone")
          .in("user_id", studentIds)
      : { data: [] };
    const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));
    const now = Date.now();
    let oneHour = 0;
    let start = 0;

    for (const request of requests || []) {
      if (!request.preferred_date || !request.preferred_time) continue;
      const startsAt = new Date(
        `${request.preferred_date}T${String(request.preferred_time).slice(0, 8)}+03:00`,
      ).getTime();
      const minutesUntil = (startsAt - now) / 60000;
      const student = profileMap.get(request.student_id);
      if (!student?.phone) continue;

      if (
        minutesUntil >= 50 &&
        minutesUntil <= 70 &&
        !request.whatsapp_reminder_1h_sent_at
      ) {
        await sendWapilotText(
          student.phone,
          `تذكير من أستاذي: محاضرتك بعد حوالي ساعة.\nرابط Zoom: ${request.zoom_url}`,
        );
        await admin
          .from("session_requests")
          .update({ whatsapp_reminder_1h_sent_at: new Date().toISOString() })
          .eq("id", request.id);
        oneHour++;
      } else if (
        minutesUntil >= 0 &&
        minutesUntil <= 15 &&
        !request.whatsapp_start_sent_at
      ) {
        await sendWapilotText(
          student.phone,
          `حان موعد محاضرتك الآن من أستاذي.\nرابط Zoom: ${request.zoom_url}`,
        );
        await admin
          .from("session_requests")
          .update({ whatsapp_start_sent_at: new Date().toISOString() })
          .eq("id", request.id);
        start++;
      }
    }

    // Counts only — no internal request IDs in the response.
    return json({ success: true, sent: { one_hour: oneHour, start } });
  } catch (error) {
    console.error(
      "send-session-reminders error:",
      error instanceof Error ? error.message : String(error),
    );
    return json({ success: false }, 500);
  }
});
