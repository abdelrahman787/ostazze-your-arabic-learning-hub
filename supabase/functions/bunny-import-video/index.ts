import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  let storagePath: string | null = null;

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleRow) {
      return jsonResponse({ error: "Forbidden" }, 403);
    }

    const body = await req.json().catch(() => ({}));
    storagePath = body?.storagePath;
    const title = typeof body?.title === "string" && body.title.trim()
      ? body.title.trim().slice(0, 500)
      : "Untitled";
    const contentType = typeof body?.contentType === "string" && body.contentType.startsWith("video/")
      ? body.contentType
      : "video/mp4";

    if (typeof storagePath !== "string" || !storagePath.startsWith("bunny-temp/") || storagePath.length > 300) {
      return jsonResponse({ error: "Invalid storagePath" }, 400);
    }

    const libraryId = Deno.env.get("BUNNY_STREAM_LIBRARY_ID");
    const apiKey = Deno.env.get("BUNNY_STREAM_API_KEY");
    if (!libraryId || !apiKey) {
      return jsonResponse({ error: "Bunny credentials not configured" }, 500);
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: signed, error: signError } = await supabaseAdmin.storage
      .from("lecture-videos")
      .createSignedUrl(storagePath, 60 * 60 * 24);

    if (signError || !signed?.signedUrl) {
      return jsonResponse({ error: signError?.message || "Could not read uploaded video" }, 500);
    }

    const sourceRes = await fetch(signed.signedUrl);
    if (!sourceRes.ok || !sourceRes.body) {
      return jsonResponse({ error: `Could not open uploaded video: ${sourceRes.status}` }, 502);
    }

    const createRes = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos`, {
      method: "POST",
      headers: {
        AccessKey: apiKey,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (!createRes.ok) {
      const txt = await createRes.text();
      console.error("Bunny create video failed:", createRes.status, txt);
      return jsonResponse({ error: `Bunny create error: ${createRes.status}` }, 502);
    }

    const video = await createRes.json();
    const videoId = video?.guid;
    if (typeof videoId !== "string" || !videoId) {
      return jsonResponse({ error: "Bunny did not return a video id" }, 502);
    }

    const uploadRes = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`, {
      method: "PUT",
      headers: {
        AccessKey: apiKey,
        accept: "application/json",
        "Content-Type": contentType,
      },
      body: sourceRes.body,
    });

    if (!uploadRes.ok) {
      const txt = await uploadRes.text();
      console.error("Bunny server upload failed:", uploadRes.status, txt);
      return jsonResponse({ error: `Bunny upload error: ${uploadRes.status}` }, 502);
    }

    await supabaseAdmin.storage.from("lecture-videos").remove([storagePath]);
    storagePath = null;

    return jsonResponse({ videoId });
  } catch (err) {
    console.error("bunny-import-video error:", err);
    return jsonResponse({ error: err instanceof Error ? err.message : "Unknown error" }, 500);
  } finally {
    if (storagePath) {
      try {
        const supabaseAdmin = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );
        await supabaseAdmin.storage.from("lecture-videos").remove([storagePath]);
      } catch (cleanupErr) {
        console.warn("Could not clean temporary video:", cleanupErr);
      }
    }
  }
});
