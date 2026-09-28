import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";
import { checkRateLimit, sha256Hex } from "../_shared/security.ts";

const BodySchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(1000),
  lang: z.enum(["ar", "en"]).optional(),
  website: z.string().max(0).optional(), // honeypot must stay empty
}).strict();

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let raw: unknown;
  try { raw = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);
  const { name, email, message, lang } = parsed.data;

  try {
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
    const subject = await sha256Hex(ip);
    if (!(await checkRateLimit(admin, "submit-contact", subject, 5, 3600))) {
      return json({ error: "Too many requests" }, 429);
    }
    const { error } = await admin.from("contact_messages").insert({ name, email, message, lang: lang ?? null });
    if (error) throw error;
    return json({ ok: true });
  } catch (e) {
    console.error("submit-contact error:", e instanceof Error ? e.message : String(e));
    return json({ error: "Could not save message" }, 500);
  }
});
