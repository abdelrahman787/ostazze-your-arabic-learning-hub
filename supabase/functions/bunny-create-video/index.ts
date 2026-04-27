// Creates an empty video on Bunny.net Stream and returns the video GUID
// + a direct upload endpoint. Admin uploads the file directly from the browser
// using PUT to Bunny's video URL.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;

    // Verify the caller is an admin
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { title } = await req.json().catch(() => ({ title: "Untitled" }));
    if (typeof title !== "string" || title.length > 500) {
      return new Response(JSON.stringify({ error: "Invalid title" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const libraryId = Deno.env.get("BUNNY_STREAM_LIBRARY_ID");
    const apiKey = Deno.env.get("BUNNY_STREAM_API_KEY");
    if (!libraryId || !apiKey) {
      return new Response(
        JSON.stringify({ error: "Bunny credentials not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const bunnyRes = await fetch(
      `https://video.bunnycdn.com/library/${libraryId}/videos`,
      {
        method: "POST",
        headers: {
          AccessKey: apiKey,
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ title: title || "Untitled" }),
      }
    );

    if (!bunnyRes.ok) {
      const txt = await bunnyRes.text();
      console.error("Bunny create video failed:", bunnyRes.status, txt);
      return new Response(
        JSON.stringify({ error: `Bunny error: ${bunnyRes.status}` }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const video = await bunnyRes.json();
    const guid: string = video.guid;

    // Build TUS upload signature for browser-based resumable uploads (CORS-enabled)
    // Signature = SHA256(LibraryId + APIKey + ExpirationTime + VideoId)
    const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24h
    const sigInput = `${libraryId}${apiKey}${expirationTime}${guid}`;
    const sigBuf = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(sigInput)
    );
    const authorizationSignature = Array.from(new Uint8Array(sigBuf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return new Response(
      JSON.stringify({
        videoId: guid,
        libraryId,
        authorizationSignature,
        authorizationExpire: expirationTime,
        tusEndpoint: "https://video.bunnycdn.com/tusupload",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("bunny-create-video error:", err);
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
