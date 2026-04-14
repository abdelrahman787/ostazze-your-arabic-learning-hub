import { createClient } from "npm:@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { type StripeEnv, verifyWebhook } from "../_shared/stripe.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const url = new URL(req.url);
  const env = (url.searchParams.get("env") || "sandbox") as StripeEnv;

  try {
    const event = await verifyWebhook(req, env);
    console.log("Received event:", event.type, "env:", env);

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;
      default:
        console.log("Unhandled event:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Webhook error:", e);
    return new Response("Webhook error", { status: 400 });
  }
});

async function handleCheckoutCompleted(session: any) {
  console.log("Checkout completed:", session.id);
  const userId = session.metadata?.userId;
  if (!userId) {
    console.log("No userId in metadata, skipping session update");
    return;
  }

  // Find the most recent pending session_request for this student and confirm it
  const { data: request } = await supabase
    .from("session_requests")
    .select("id")
    .eq("student_id", userId)
    .eq("status", "pending_payment")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (request) {
    await supabase
      .from("session_requests")
      .update({ status: "confirmed" })
      .eq("id", request.id);
    console.log("Session request confirmed:", request.id);
  }
}
