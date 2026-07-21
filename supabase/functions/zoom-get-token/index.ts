import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";


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
    throw new Error(
      "Missing Zoom credentials. Ensure ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET are set.",
    );
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
    // Require an authenticated admin caller — this endpoint returns a
    // Zoom access token that must never be exposed to non-admins.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const jwt = authHeader.replace("Bearer ", "");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(jwt);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: roles } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", claimsData.claims.sub as string)
      .eq("role", "admin");
    if (!roles || roles.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Forbidden" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const token = await getZoomAccessToken();
    return new Response(
      JSON.stringify({ success: true, access_token: token }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("zoom-get-token error:", message);
    return new Response(
      JSON.stringify({ success: false, error: message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});

export { getZoomAccessToken };
