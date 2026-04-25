import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

async function getZoomAccessToken(): Promise<string> {
  const accountId = Deno.env.get("ZOOM_ACCOUNT_ID");
  const clientId = Deno.env.get("ZOOM_CLIENT_ID");
  const clientSecret = Deno.env.get("ZOOM_CLIENT_SECRET");

  if (!accountId || !clientId || !clientSecret) {
    throw new Error("Missing Zoom credentials in environment.");
  }

  const basicAuth = btoa(`${clientId}:${clientSecret}`);
  const url = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(
    accountId,
  )}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Zoom token request failed (${res.status}): ${text}`);
  }
  const json = JSON.parse(text);
  if (!json.access_token) {
    throw new Error(`No access_token in Zoom response: ${text}`);
  }
  return json.access_token as string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1) Validate auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } =
      await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 2) Parse body
    let body: Record<string, unknown> = {};
    if (req.method === "POST") {
      try {
        body = await req.json();
      } catch {
        body = {};
      }
    }

    const topic = (body.topic as string) || "OSTAZE Session";
    const duration = (body.duration as number) || 60;
    const start_time =
      (body.start_time as string) ||
      new Date(Date.now() + 60 * 60 * 1000).toISOString();

    // 3) Get Zoom token
    const accessToken = await getZoomAccessToken();

    // 4) Create meeting
    const meetingPayload = {
      topic,
      type: 2,
      start_time,
      duration,
      timezone: "Asia/Kuwait",
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        waiting_room: true,
        approval_type: 0,
        meeting_authentication: false,
      },
    };

    const zoomRes = await fetch(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(meetingPayload),
      },
    );

    const zoomText = await zoomRes.text();
    if (!zoomRes.ok) {
      throw new Error(
        `Zoom create meeting failed (${zoomRes.status}): ${zoomText}`,
      );
    }
    const meeting = JSON.parse(zoomText);

    return new Response(
      JSON.stringify({
        success: true,
        meeting: {
          id: meeting.id,
          join_url: meeting.join_url,
          start_url: meeting.start_url,
          password: meeting.password,
          topic: meeting.topic,
          start_time: meeting.start_time,
          duration: meeting.duration,
          timezone: meeting.timezone,
        },
        raw: meeting,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("zoom-create-meeting error:", message);
    return new Response(
      JSON.stringify({ success: false, error: message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
