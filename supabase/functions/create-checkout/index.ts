import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Trusted server-side price. MUST stay in sync with src/lib/pricing.ts.
// One hour = 125 SAR, always charged in EGP.
const BASE_PRICE_SAR = 125;
const SAR_TO_EGP = 12.95;

function resolveAmountCents(_country: unknown): number {
  return Math.round(BASE_PRICE_SAR * SAR_TO_EGP * 100);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { country, teacherName, subject, customerEmail, userId, returnUrl, environment } =
      await req.json();

    // Ignore any client-supplied amount/currency — always compute server-side.
    const amountInCents = resolveAmountCents(country);
    const cur = "egp";

    const env = (environment || "sandbox") as StripeEnv;
    console.log("Creating checkout session, env:", env, "amount:", amountInCents, "currency:", cur, "country:", country);
    const stripe = createStripeClient(env);

    const productName = `Tutoring Session${subject ? ` - ${subject}` : ""}`;
    const description = teacherName ? `Session with ${teacherName}` : undefined;

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: cur,
            product_data: {
              name: productName,
              ...(description && { description }),
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      ui_mode: "embedded",
      return_url: returnUrl || `${req.headers.get("origin")}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
      ...(customerEmail && { customer_email: customerEmail }),
      ...(userId && { metadata: { userId, country: String(country || "EG") } }),
    });

    return new Response(JSON.stringify({ clientSecret: session.client_secret }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Checkout error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
