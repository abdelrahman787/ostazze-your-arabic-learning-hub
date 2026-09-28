// Issues a one-time signed upload URL into the private tutor-cvs bucket for
// tutor applicants (who are not signed in). The client never gets general
// write access: type, size and object path are validated here.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";
import { checkRateLimit, sha256Hex } from "../_shared/security.ts";

const RULES = {
  cv: { exts: ["pdf", "doc", "docx"], mimes: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"], max: 10 * 1024 * 1024 },
  photo: { exts: ["jpg", "jpeg", "png", "webp"], mimes: ["image/jpeg", "image/png", "image/webp"], max: 5 * 1024 * 1024 },
  demo: { exts: ["mp4", "mov", "m4v", "webm"], mimes: ["video/mp4", "video/quicktime", "video/x-m4v", "video/webm"], max: 100 * 1024 * 1024 },
} as const;

const Body = z.object({
  kind: z.enum(["cv", "photo", "demo"]),
  ext: z.string().trim().toLowerCase().regex(/^[a-z0-9]{2,5}$/),
  contentType: z.string().trim().max(120),
  size: z.number().int().positive(),
}).strict();

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let raw: unknown;
  try { raw = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
  const parsed = Body.safeParse(raw);
  if (!parsed.success) return json({ error: "Invalid request" }, 400);
  const { kind, ext, contentType, size } = parsed.data;
  const rule = RULES[kind];
  if (!(rule.exts as readonly string[]).includes(ext)) return json({ error: "File type not allowed" }, 400);
  if (contentType && !(rule.mimes as readonly string[]).includes(contentType)) return json({ error: "File type not allowed" }, 400);
  if (size > rule.max) return json({ error: "File too large" }, 400);

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  try {
    const ok = await checkRateLimit(admin, "tutor-upload-url", await sha256Hex(ip), 10, 3600);
    if (!ok) return json({ error: "Too many requests" }, 429);
  } catch {
    return json({ error: "Temporarily unavailable" }, 503);
  }

  const path = `applications/${new Date().getFullYear()}/${kind}-${crypto.randomUUID()}.${ext}`;
  const { data, error } = await admin.storage.from("tutor-cvs").createSignedUploadUrl(path);
  if (error || !data) return json({ error: "Could not prepare upload" }, 500);
  return json({ path, token: data.token });
});
