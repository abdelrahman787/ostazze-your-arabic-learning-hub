import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-secret",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Require bootstrap secret
    const provided = req.headers.get("x-admin-secret");
    const expected = Deno.env.get("ADMIN_BOOTSTRAP_SECRET");
    if (!expected) {
      return new Response(
        JSON.stringify({ error: "Server misconfigured: ADMIN_BOOTSTRAP_SECRET not set" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!provided || provided !== expected) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Optional: read admins payload from body, otherwise fall back to bootstrap defaults
    let body: any = {};
    try { body = await req.json(); } catch {}
    const adminsToCreate: Array<{ email: string; password: string; name: string }> = Array.isArray(body?.admins)
      ? body.admins
      : [];

    if (adminsToCreate.length === 0) {
      return new Response(
        JSON.stringify({ error: "Provide { admins: [{ email, password, name }] } in the request body." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const results: Array<{ email: string; status: string; error?: string }> = [];

    for (const admin of adminsToCreate) {
      if (!admin?.email || !admin?.password) {
        results.push({ email: admin?.email ?? "?", status: "invalid" });
        continue;
      }
      const existing = existingUsers?.users?.find((u) => u.email === admin.email);

      let userId: string | undefined;

      if (existing) {
        userId = existing.id;
        results.push({ email: admin.email, status: "already exists" });
      } else {
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: admin.email,
          password: admin.password,
          email_confirm: true,
          user_metadata: { full_name: admin.name ?? "Admin", account_type: "student" },
        });

        if (createError) {
          results.push({ email: admin.email, status: "failed", error: createError.message });
          continue;
        }
        userId = newUser.user.id;
        results.push({ email: admin.email, status: "created" });
      }

      if (userId) {
        const { data: existingRole } = await supabaseAdmin
          .from("user_roles")
          .select("id")
          .eq("user_id", userId)
          .eq("role", "admin")
          .maybeSingle();

        if (!existingRole) {
          const { error: roleError } = await supabaseAdmin
            .from("user_roles")
            .insert({ user_id: userId, role: "admin" });
          if (roleError) {
            results.push({ email: admin.email, status: "role_failed", error: roleError.message });
          }
        }
      }
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
