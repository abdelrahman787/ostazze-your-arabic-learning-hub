import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendWapilotText, normalizeChatId } from "../_shared/wapilot.ts";

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

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) throw new Error("Unauthorized");

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: caller, error: callerError } = await admin.auth.getUser(authHeader.slice(7));
    if (callerError || !caller.user) throw new Error("Unauthorized");
    const { data: role } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!role) throw new Error("Admins only.");

    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const action = (body as { action?: string }).action || "diagnose";

    const token = Deno.env.get("WAPILOT_API_TOKEN");
    const instanceId = Deno.env.get("WAPILOT_INSTANCE_ID");
    const baseUrl = (Deno.env.get("WAPILOT_API_BASE_URL") || "https://api.wapilot.net/api/v2").replace(/\/$/, "");

    // ---- Safe test message (explicit opt-in only) ----
    if (action === "send_test") {
      const phone = String((body as { phone?: string }).phone || "").trim();
      const confirmed = (body as { confirm?: boolean }).confirm === true;
      if (!confirmed) throw new Error("Explicit confirmation required.");
      if (normalizeChatId(phone).length < 8) throw new Error("Provide a valid international phone number.");
      await sendWapilotText(phone, "اختبار من أستاذي: تكامل واتساب يعمل بنجاح ✅");
      return json({ success: true, sent_to: `***${normalizeChatId(phone).slice(-4)}` });
    }

    // ---- Diagnostics (never sends a message) ----
    const secrets = {
      wapilot_token: Boolean(token),
      wapilot_instance_id: Boolean(instanceId),
      wapilot_base_url_configured: Boolean(Deno.env.get("WAPILOT_API_BASE_URL")),
      wapilot_base_url_effective: baseUrl,
      zoom_account_id: Boolean(Deno.env.get("ZOOM_ACCOUNT_ID")),
      zoom_client_id: Boolean(Deno.env.get("ZOOM_CLIENT_ID")),
      zoom_client_secret: Boolean(Deno.env.get("ZOOM_CLIENT_SECRET")),
    };

    let wapilot: Record<string, unknown> = { reachable: false };
    let lastError: string | null = null;

    if (token && instanceId) {
      try {
        const res = await fetch(`${baseUrl}/instances`, {
          headers: { accept: "application/json", token },
        });
        const raw = await res.text();
        if (!res.ok) throw new Error(`WaPilot /instances failed (${res.status})`);
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        const list: Array<Record<string, unknown>> = Array.isArray(parsed)
          ? parsed
          : (parsed.data as Array<Record<string, unknown>>) ||
            (parsed.instances as Array<Record<string, unknown>>) || [];
        const match = list.find(
          (i) =>
            String(i.instance_id ?? i.id ?? i.uuid ?? "") === String(instanceId) ||
            String(i.name ?? "") === String(instanceId),
        );
        wapilot = {
          reachable: true,
          instances_count: list.length,
          instance_found: Boolean(match),
          status: match?.status ?? null,
          session_status: match?.session_status ?? null,
          is_api: match?.is_api ?? null,
          subscription_status: match?.subscription_status ?? null,
        };
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
        wapilot = { reachable: false };
      }
    } else {
      lastError = "WaPilot secrets missing.";
    }

    // ---- Zoom credential check (token only, creates no meeting) ----
    let zoomAuth: { ok: boolean; error: string | null } = { ok: false, error: "Missing Zoom credentials." };
    if (secrets.zoom_account_id && secrets.zoom_client_id && secrets.zoom_client_secret) {
      try {
        const res = await fetch(
          `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(Deno.env.get("ZOOM_ACCOUNT_ID")!)}`,
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${btoa(`${Deno.env.get("ZOOM_CLIENT_ID")}:${Deno.env.get("ZOOM_CLIENT_SECRET")}`)}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        );
        zoomAuth = res.ok ? { ok: true, error: null } : { ok: false, error: `Zoom auth failed (${res.status})` };
        if (!res.ok) lastError = lastError || zoomAuth.error;
      } catch (error) {
        zoomAuth = { ok: false, error: error instanceof Error ? error.message : String(error) };
        lastError = lastError || zoomAuth.error;
      }
    }

    // ---- Scheduler + pending reminders ----
    let schedulerRows: Record<string, unknown> | null = null;
    try {
      const { data } = await admin.rpc("get_automation_cron_status").maybeSingle();
      schedulerRows = (data as Record<string, unknown>) ?? null;
    } catch (_e) {
      schedulerRows = null;
    }

    const today = new Date().toISOString().slice(0, 10);
    const { count: upcoming } = await admin
      .from("session_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "confirmed")
      .gte("preferred_date", today);

    return json({
      success: true,
      secrets,
      wapilot,
      zoom: zoomAuth,
      scheduler: schedulerRows ?? null,
      upcoming_confirmed_sessions: upcoming ?? 0,
      last_error: lastError,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("automation-diagnostics error:", message);
    return json({ success: false, error: message }, 400);
  }
});
