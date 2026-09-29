import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const CODE_COUNT = 10;
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

async function sha256(text: string) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const normalize = (c: string) => c.toUpperCase().replace(/[^A-Z0-9]/g, "");

function randomCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  const s = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `${s.slice(0, 5)}-${s.slice(5)}`;
}

async function isAdminRow(userId: string) {
  const { supabaseAdmin } =
    await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  return { supabaseAdmin, isAdmin: !!data };
}

/** Status only — never returns codes. */
export const getRecoveryStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin, isAdmin } = await isAdminRow(context.userId);
    if (!isAdmin) return { remaining: 0 };
    const { count } = await supabaseAdmin
      .from("admin_recovery_codes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", context.userId)
      .is("used_at", null);
    return { remaining: count ?? 0 };
  });

/** Issues fresh codes (replacing old ones). Requires a two-step verified session. */
export const generateRecoveryCodes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    if ((context.claims as { aal?: string }).aal !== "aal2")
      throw new Error("Two-step verification required");
    const { supabaseAdmin, isAdmin } = await isAdminRow(context.userId);
    if (!isAdmin) throw new Error("Forbidden");
    const codes = Array.from({ length: CODE_COUNT }, randomCode);
    const rows = await Promise.all(
      codes.map(async (c) => ({
        user_id: context.userId,
        code_hash: await sha256(`${context.userId}:${normalize(c)}`),
      })),
    );
    await supabaseAdmin
      .from("admin_recovery_codes")
      .delete()
      .eq("user_id", context.userId);
    const { error } = await supabaseAdmin
      .from("admin_recovery_codes")
      .insert(rows);
    if (error) throw new Error("Could not save recovery codes");
    return { codes };
  });

/**
 * Uses one recovery code: marks it spent and removes the lost authenticator so
 * the admin can enroll a new one. Rate limited to 5 attempts per 15 minutes.
 */
export const redeemRecoveryCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: { code: string }) => {
    if (!input || typeof input.code !== "string" || input.code.length > 32)
      throw new Error("Invalid code");
    return { code: input.code };
  })
  .handler(async ({ data, context }) => {
    const { supabaseAdmin, isAdmin } = await isAdminRow(context.userId);
    if (!isAdmin) return { ok: false };
    const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("rate_limit_events")
      .select("id", { count: "exact", head: true })
      .eq("bucket", "mfa_recovery")
      .eq("subject", context.userId)
      .gte("created_at", since);
    if ((count ?? 0) >= 5) return { ok: false, limited: true };
    await supabaseAdmin
      .from("rate_limit_events")
      .insert({ bucket: "mfa_recovery", subject: context.userId });

    const hash = await sha256(`${context.userId}:${normalize(data.code)}`);
    const { data: spent } = await supabaseAdmin
      .from("admin_recovery_codes")
      .update({ used_at: new Date().toISOString() })
      .eq("user_id", context.userId)
      .eq("code_hash", hash)
      .is("used_at", null)
      .select("id");
    if (!spent || spent.length === 0) return { ok: false };

    const { data: factors } = await supabaseAdmin.auth.admin.mfa.listFactors({
      userId: context.userId,
    });
    for (const f of factors?.factors ?? []) {
      await supabaseAdmin.auth.admin.mfa.deleteFactor({
        id: f.id,
        userId: context.userId,
      });
    }
    return { ok: true };
  });
