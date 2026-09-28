// Shared security helpers for edge functions.
import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

/** Constant-time string comparison (length leak only). */
export function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  let diff = ab.length ^ bb.length;
  const len = Math.max(ab.length, bb.length);
  for (let i = 0; i < len; i++) diff |= (ab[i] ?? 0) ^ (bb[i] ?? 0);
  return diff === 0;
}

/**
 * Sliding-window rate limit backed by public.rate_limit_events (service role only).
 * Returns true when the call is allowed (and records it).
 */
export async function checkRateLimit(
  admin: SupabaseClient,
  bucket: string,
  subject: string,
  max: number,
  windowSeconds: number,
): Promise<boolean> {
  const since = new Date(Date.now() - windowSeconds * 1000).toISOString();
  const { count, error } = await admin
    .from("rate_limit_events")
    .select("id", { count: "exact", head: true })
    .eq("bucket", bucket)
    .eq("subject", subject)
    .gte("created_at", since);
  if (error) throw error;
  if ((count ?? 0) >= max) return false;
  await admin.from("rate_limit_events").insert({ bucket, subject });
  return true;
}

export async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
