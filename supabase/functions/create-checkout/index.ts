import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";
import { checkRateLimit } from "../_shared/security.ts";

// Trusted server-side price. MUST stay in sync with src/lib/pricing.ts.
// One hour = 125 SAR, always charged in EGP.
const BASE_PRICE_SAR = 125;
const SAR_TO_EGP = 12.95;
const AMOUNT_CENTS = Math.round(BASE_PRICE_SAR * SAR_TO_EGP * 100);

const ALLOWED_ORIGINS = new Set([
  "https://ostaze.com",
  "https://www.ostaze.com",
  "https://ostazze-learn-hub.lovable.app",
  "https://id-preview--dc7db421-26c3-4945-8236-93600ec382aa.lovable.app",
  "http://localhost:8080",
]);
const RETURN_PATH = "/checkout/return";

const BodySchema = z.object({
  country: z.string().trim().regex(/^[A-Z]{2}$/).optional().nullable(),
  teacherName: z.string().trim().max(120).optional().nullable(),
  subject: z.string().trim().max(160).optional().nullable(),
  returnUrl: z.string().url().max(500).optional().nullable(),
}).strict();

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

/** Mode is decided server-side only: STRIPE_MODE, else live when a live key exists. */
function resolveEnv(): StripeEnv {
  const mode = Deno.env.get("STRIPE_MODE");
  if (mode === "live" || mode === "sandbox") return mode;
  return Deno.env.get("STRIPE_LIVE_API_KEY") ? "live" : "sandbox";
}

function resolveReturnUrl(candidate: string | null | undefined, origin: string | null): string | null {
  const base = candidate ? (() => { try { return new URL(candidate); } catch { return null; } })() : null;
  const originOk = (o: string) => ALLOWED_ORIGINS.has(o);
  if (base) {
    if (!originOk(base.origin) || base.pathname !== RETURN_PATH) return null;
  } else if (!origin || !originOk(origin)) {
    return null;
  }
  const o = base ? base.origin : origin!;
  return `${o}${RETURN_PATH}?session_id={CHECKOUT_SESSION_ID}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  // 1. Authenticate
  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);
  const userClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser(authHeader.slice(7));
  const user = userData?.user;
  if (userErr || !user) return json({ error: "Unauthorized" }, 401);

  // 2. Validate body
  let raw: unknown;
  try { raw = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);
  const { country, teacherName, subject, returnUrl } = parsed.data;

  const finalReturnUrl = resolveReturnUrl(returnUrl, req.headers.get("origin"));
  if (!finalReturnUrl) return json({ error: "Return URL not allowed" }, 400);

  try {
    // 3. Rate limit: 5 sessions per user per 10 minutes
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const allowed = await checkRateLimit(admin, "create-checkout", user.id, 5, 600);
    if (!allowed) return json({ error: "Too many requests, try again later" }, 429);

    const env = resolveEnv();
    const stripe = createStripeClient(env);

    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price_data: {
          currency: "egp",
          product_data: {
            name: `Tutoring Session${subject ? ` - ${subject}` : ""}`,
            ...(teacherName && { description: `Session with ${teacherName}` }),
          },
          unit_amount: AMOUNT_CENTS,
        },
        quantity: 1,
      }],
      mode: "payment",
      ui_mode: "embedded",
      return_url: finalReturnUrl,
      ...(user.email && { customer_email: user.email }),
      metadata: { userId: user.id, country: country || "EG" },
    });

    return json({ clientSecret: session.client_secret });
  } catch (error: unknown) {
    console.error("Checkout error:", error instanceof Error ? error.message : String(error));
    return json({ error: "Failed to create checkout session" }, 500);
  }
});
