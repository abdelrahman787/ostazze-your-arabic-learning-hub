// ONE-TIME: moves legacy demo videos and photos out of tutor-cvs. Deleted after use.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { timingSafeEqual } from "../_shared/security.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: sec } = await admin.from("internal_secrets").select("value").eq("name", "move_legacy_token").maybeSingle();
  const given = req.headers.get("x-move-token") ?? "";
  if (req.method !== "POST" || !sec?.value || !timingSafeEqual(given, sec.value)) return new Response("forbidden", { status: 403, headers: corsHeaders });

  const { data: apps } = await admin.from("tutor_applications").select("id, demo_file_path, photo_file_path");
  const log: string[] = [];
  for (const a of apps ?? []) {
    for (const col of ["demo_file_path", "photo_file_path"] as const) {
      const p = a[col] as string | null;
      if (!p || p.startsWith("photo/") || p.startsWith("legacy-demo/")) continue;
      const ext = (p.split(".").pop() || "bin").toLowerCase().replace("jpeg", "jpg");
      const dest = col === "demo_file_path" ? { bucket: "tutor-legacy-demos", path: `legacy-demo/${crypto.randomUUID()}.${ext}` }
                                            : { bucket: "tutor-photos", path: `photo/${crypto.randomUUID()}.${ext}` };
      const { data: blob, error: dErr } = await admin.storage.from("tutor-cvs").download(p);
      if (dErr || !blob) { log.push(`FAIL download ${col}`); continue; }
      const { error: uErr } = await admin.storage.from(dest.bucket).upload(dest.path, blob, { contentType: blob.type, upsert: false });
      if (uErr) { log.push(`FAIL upload ${col} ${uErr.message}`); continue; }
      await admin.from("tutor_applications").update({ [col]: dest.path }).eq("id", a.id);
      await admin.storage.from("tutor-cvs").remove([p]);
      log.push(`moved ${col} -> ${dest.bucket}`);
    }
  }
  // Remove orphans left in tutor-cvs that are not PDFs.
  const { data: rest } = await admin.storage.from("tutor-cvs").list("2026", { limit: 1000 });
  const stray = (rest ?? []).filter((f) => !f.name.toLowerCase().endsWith(".pdf")).map((f) => `2026/${f.name}`);
  if (stray.length) { await admin.storage.from("tutor-cvs").remove(stray); log.push(`removed ${stray.length} stray non-PDF`); }
  // Remove unreferenced copies in tutor-photos (left by timed-out retries).
  const { data: refs } = await admin.from("tutor_applications").select("photo_file_path");
  const keep = new Set((refs ?? []).map((r) => r.photo_file_path));
  const { data: ph } = await admin.storage.from("tutor-photos").list("photo", { limit: 1000 });
  const orphans = (ph ?? []).map((f) => `photo/${f.name}`).filter((p) => !keep.has(p));
  if (orphans.length) { await admin.storage.from("tutor-photos").remove(orphans); log.push(`removed ${orphans.length} orphan photo copies`); }
  await admin.from("internal_secrets").delete().eq("name", "move_legacy_token");
  return new Response(JSON.stringify(log), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
