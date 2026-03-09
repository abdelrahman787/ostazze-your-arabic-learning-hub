import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: { user: caller }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !caller) throw new Error("Unauthorized");

    const { data: callerRole } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "admin")
      .single();

    if (!callerRole) throw new Error("Only admins can manage roles");

    const { action, email, role, user_id } = await req.json();

    if (action === "add_role") {
      // Add role to existing user by email
      if (!email || !role) throw new Error("Email and role are required");
      if (!["admin", "moderator"].includes(role)) throw new Error("Invalid role");

      // Find user by email
      const { data: users } = await supabaseAdmin.auth.admin.listUsers();
      const targetUser = users?.users?.find((u) => u.email === email);
      if (!targetUser) throw new Error("المستخدم غير موجود بهذا البريد الإلكتروني");

      // Check if already has role
      const { data: existing } = await supabaseAdmin
        .from("user_roles")
        .select("id")
        .eq("user_id", targetUser.id)
        .eq("role", role)
        .single();

      if (existing) throw new Error("المستخدم يملك هذا الدور بالفعل");

      const { error: insertError } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: targetUser.id, role });

      if (insertError) throw insertError;

      return new Response(
        JSON.stringify({ message: "تمت إضافة الدور بنجاح", user_id: targetUser.id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "remove_role") {
      if (!user_id || !role) throw new Error("user_id and role are required");

      // Don't let admin remove their own admin role
      if (user_id === caller.id && role === "admin") {
        throw new Error("لا يمكنك إزالة دور المدير من نفسك");
      }

      const { error: deleteError } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", user_id)
        .eq("role", role);

      if (deleteError) throw deleteError;

      return new Response(
        JSON.stringify({ message: "تمت إزالة الدور بنجاح" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "add_teacher") {
      // Convert existing student to teacher
      if (!user_id) throw new Error("user_id is required");

      // Update profile account_type
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .update({ account_type: "teacher" })
        .eq("user_id", user_id);

      if (profileError) throw profileError;

      // Create teacher_profile if not exists
      const { data: existingTP } = await supabaseAdmin
        .from("teacher_profiles")
        .select("id")
        .eq("user_id", user_id)
        .single();

      if (!existingTP) {
        const { error: tpError } = await supabaseAdmin
          .from("teacher_profiles")
          .insert({ user_id, verified: true });

        if (tpError) throw tpError;
      }

      return new Response(
        JSON.stringify({ message: "تمت إضافة المعلم بنجاح" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    throw new Error("Invalid action");
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
