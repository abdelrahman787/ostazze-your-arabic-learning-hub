// Generates a short-lived signed playback URL for Bunny.net Stream embed
// with a dynamic watermark showing the student's name + email.
//
// Token spec (Bunny):
//   token = SHA256(TokenAuthKey + video_id + expires)  (hex)
//   Player URL: https://iframe.mediadelivery.net/embed/{libraryId}/{videoId}
//                ?token={token}&expires={expires}
//                &watermark_text={text}
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Ensures the given hostname is registered as an Allowed Referrer on the
 * Bunny Stream Library. Without this, the embed shows
 * "This content is blocked. Contact the site owner to fix the issue."
 */
async function ensureAllowedReferrer(
  libraryId: string,
  accountApiKey: string | undefined,
  hostname: string,
) {
  if (!accountApiKey || !hostname) return;
  try {
    // Read current library settings
    const getRes = await fetch(
      `https://api.bunny.net/videolibrary/${libraryId}`,
      {
        headers: { AccessKey: accountApiKey, accept: "application/json" },
      },
    );
    if (!getRes.ok) {
      console.warn("Could not read library settings:", getRes.status);
      return;
    }
    const lib = await getRes.json();
    const current: string[] = Array.isArray(lib?.AllowedReferrers)
      ? lib.AllowedReferrers
      : [];
    if (current.includes(hostname)) return;

    const updated = [...current, hostname];
    const updRes = await fetch(
      `https://api.bunny.net/videolibrary/${libraryId}`,
      {
        method: "POST",
        headers: {
          AccessKey: accountApiKey,
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ AllowedReferrers: updated }),
      },
    );
    if (!updRes.ok) {
      const txt = await updRes.text();
      console.warn("Could not update AllowedReferrers:", updRes.status, txt);
    }
  } catch (e) {
    console.warn("ensureAllowedReferrer failed:", e);
  }
}

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
    const userEmail = userData.user.email || "";

    const body = await req.json().catch(() => ({}));
    const lectureId = body?.lectureId;
    if (typeof lectureId !== "string" || lectureId.length > 64) {
      return new Response(JSON.stringify({ error: "Invalid lectureId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch lecture and confirm caller is teacher/student/admin
    const { data: lecture, error: lecErr } = await supabase
      .from("lectures")
      .select("id, student_id, teacher_id, bunny_video_id")
      .eq("id", lectureId)
      .maybeSingle();

    if (lecErr || !lecture) {
      return new Response(JSON.stringify({ error: "Lecture not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!lecture.bunny_video_id) {
      return new Response(
        JSON.stringify({ error: "No Bunny video for this lecture" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Authorization: student / teacher / admin
    const isStudent = lecture.student_id === userId;
    const isTeacher = lecture.teacher_id === userId;
    let isAdmin = false;
    if (!isStudent && !isTeacher) {
      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      isAdmin = !!roleRow;
    }
    if (!isStudent && !isTeacher && !isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get viewer's full name for watermark
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", userId)
      .maybeSingle();
    const viewerName = profile?.full_name || userEmail || "viewer";

    const libraryId = Deno.env.get("BUNNY_STREAM_LIBRARY_ID");
    const tokenKey = Deno.env.get("BUNNY_STREAM_TOKEN_KEY");
    if (!libraryId || !tokenKey) {
      return new Response(
        JSON.stringify({ error: "Bunny credentials not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const videoId = lecture.bunny_video_id;

    // Make sure the caller's origin is whitelisted on the library, otherwise
    // Bunny shows "This content is blocked".
    const origin = req.headers.get("origin") || req.headers.get("referer") || "";
    let originHost = "";
    try {
      if (origin) originHost = new URL(origin).hostname;
    } catch (_) {
      originHost = "";
    }
    const accountApiKey = Deno.env.get("BUNNY_ACCOUNT_API_KEY") ||
      Deno.env.get("BUNNY_STREAM_API_KEY");
    if (originHost) {
      await ensureAllowedReferrer(libraryId, accountApiKey, originHost);
    }

    // Token valid for 2 hours
    const expires = Math.floor(Date.now() / 1000) + 60 * 60 * 2;
    const signature = await sha256Hex(`${tokenKey}${videoId}${expires}`);

    // Watermark text: student name + masked email + timestamp
    const maskedEmail = userEmail
      ? userEmail.replace(/(.{2}).+(@.+)/, "$1***$2")
      : "";
    const watermarkText = `${viewerName} • ${maskedEmail}`;

    const params = new URLSearchParams({
      token: signature,
      expires: String(expires),
      watermark_text: watermarkText,
    });

    const embedUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?${params.toString()}`;

    return new Response(
      JSON.stringify({
        embedUrl,
        expires,
        watermark: watermarkText,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("bunny-playback-token error:", err);
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
