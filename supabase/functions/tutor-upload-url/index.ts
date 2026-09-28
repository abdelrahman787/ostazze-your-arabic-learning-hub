// Server-validated upload for tutor files. The browser sends the file here; this
// function checks the real file content (magic bytes), size and kind, picks an
// unpredictable name itself, and stores it with the service role. Clients have
// no direct write access to tutor-cvs or tutor-photos.
//   cv    -> tutor-cvs, real PDF only, <= 5MB
//            signed-in user: <uid>/<uuid>.pdf   applicant: applications/<uuid>.pdf
//   photo -> tutor-photos, real JPEG/PNG/WebP only (no SVG), <= 5MB: photo/<uuid>.<ext>
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { checkRateLimit, sha256Hex } from "../_shared/security.ts";

const MAX = 5 * 1024 * 1024;

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const startsWith = (b: Uint8Array, sig: number[], at = 0) => sig.every((v, i) => b[at + i] === v);
const ascii = (s: string) => [...s].map((c) => c.charCodeAt(0));

/** Detect the real type from file bytes. Returns null when not an allowed type. */
export function sniff(b: Uint8Array): { kind: "cv" | "photo"; ext: string; mime: string } | null {
  if (startsWith(b, ascii("%PDF-"))) {
    // A real PDF ends with %%EOF (allow trailing whitespace/newlines).
    const tail = new TextDecoder().decode(b.subarray(Math.max(0, b.length - 1024)));
    if (tail.includes("%%EOF")) return { kind: "cv", ext: "pdf", mime: "application/pdf" };
    return null;
  }
  if (startsWith(b, [0xff, 0xd8, 0xff])) return { kind: "photo", ext: "jpg", mime: "image/jpeg" };
  if (startsWith(b, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return { kind: "photo", ext: "png", mime: "image/png" };
  if (startsWith(b, ascii("RIFF")) && startsWith(b, ascii("WEBP"), 8)) return { kind: "photo", ext: "webp", mime: "image/webp" };
  return null; // SVG, HTML, video, renamed files, etc.
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const declared = Number(req.headers.get("content-length") || "0");
  if (declared > MAX + 64 * 1024) return json({ error: "File too large" }, 413);

  let form: FormData;
  try { form = await req.formData(); } catch { return json({ error: "Invalid request" }, 400); }
  const kind = form.get("kind");
  const file = form.get("file");
  if ((kind !== "cv" && kind !== "photo") || !(file instanceof File)) return json({ error: "Invalid request" }, 400);
  if (file.size === 0 || file.size > MAX) return json({ error: "File too large" }, 400);

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (bytes.length > MAX) return json({ error: "File too large" }, 400);
  const real = sniff(bytes);
  if (!real || real.kind !== kind) return json({ error: "File type not allowed" }, 400);

  const url = Deno.env.get("SUPABASE_URL")!;
  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  // Optional signed-in tutor (their CV goes in their own folder).
  let userId: string | null = null;
  const auth = req.headers.get("Authorization") ?? "";
  if (auth.startsWith("Bearer ")) {
    const { data } = await admin.auth.getUser(auth.slice(7));
    userId = data?.user?.id ?? null;
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  try {
    const subject = userId ?? (await sha256Hex(ip));
    if (!(await checkRateLimit(admin, "tutor-upload-url", subject, 10, 3600))) return json({ error: "Too many requests" }, 429);
  } catch {
    return json({ error: "Temporarily unavailable" }, 503);
  }

  const id = crypto.randomUUID();
  const bucket = kind === "cv" ? "tutor-cvs" : "tutor-photos";
  const path = kind === "cv" ? (userId ? `${userId}/${id}.pdf` : `applications/${id}.pdf`) : `photo/${id}.${real.ext}`;

  const { error } = await admin.storage.from(bucket).upload(path, bytes, { contentType: real.mime, upsert: false });
  if (error) return json({ error: "Upload failed" }, 500);
  return json({ path, bucket });
});
