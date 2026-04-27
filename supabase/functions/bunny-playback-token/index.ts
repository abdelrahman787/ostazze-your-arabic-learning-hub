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
    const { data: claimsData, error: claimsErr } =
      await supabase.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub as string;
    const userEmail = (claimsData.claims.email as string) || "";

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
