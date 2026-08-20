import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendWapilotText } from "../_shared/wapilot.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

/** Normalizes to digits only (international format, no +). */
function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.length < 8 || digits.length > 15) return null;
  return digits;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: caller, error: callerError } = await admin.auth.getUser(authHeader.slice(7));
    if (callerError || !caller.user) return json({ error: "Unauthorized" }, 401);

    const body = (await req.json().catch(() => ({}))) as { phone?: string; lang?: string };
    const lang = body.lang === "en" ? "en" : "ar";

    const { data: profile } = await admin
      .from("profiles")
      .select("full_name, phone, welcome_whatsapp_sent_at")
      .eq("user_id", caller.user.id)
      .maybeSingle();

    let phone = profile?.phone || "";
    if (body.phone) {
      const normalized = normalizePhone(body.phone);
      if (!normalized) return json({ error: "invalid_phone" }, 400);
      phone = normalized;
      const { error: updateError } = await admin
        .from("profiles")
        .update({ phone })
        .eq("user_id", caller.user.id);
      if (updateError) return json({ error: updateError.message }, 400);
    }

    if (!phone) return json({ error: "missing_phone" }, 400);
    if (profile?.welcome_whatsapp_sent_at) {
      return json({ success: true, already_sent: true });
    }

    const name = profile?.full_name || caller.user.user_metadata?.full_name || "";
    const text = lang === "en"
      ? [
          `Welcome to Ostaze${name ? `, ${name}` : ""}! 🎓`,
          "",
          "Your account is ready. You can now browse courses and book live sessions with top tutors.",
          "Reply to this message any time and our team will help you book.",
        ].join("\n")
      : [
          `أهلاً بك في استاذي${name ? ` يا ${name}` : ""}! 🎓`,
          "",
          "تم تفعيل حسابك بنجاح. تقدر الآن تتصفح المواد وتحجز حصص مباشرة مع أفضل المعلمين.",
          "ردّ على هذه الرسالة في أي وقت وفريقنا هيساعدك في الحجز.",
        ].join("\n");

    try {
      await sendWapilotText(phone, text);
    } catch (e) {
      console.error("welcome whatsapp failed:", (e as Error).message);
      return json({ success: false, error: (e as Error).message }, 502);
    }

    await admin
      .from("profiles")
      .update({ welcome_whatsapp_sent_at: new Date().toISOString() })
      .eq("user_id", caller.user.id);

    return json({ success: true });
  } catch (e) {
    console.error("send-welcome-whatsapp error:", (e as Error).message);
    return json({ error: (e as Error).message }, 500);
  }
});
