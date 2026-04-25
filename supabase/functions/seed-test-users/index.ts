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

    const users = [
      {
        email: "teacher.test@ostazze.com",
        password: "Teacher@123456",
        full_name: "أحمد المعلم",
        full_name_en: "Ahmed Teacher",
        account_type: "teacher",
        teacher: {
          university: "جامعة الكويت",
          university_en: "Kuwait University",
          subjects: ["رياضيات", "فيزياء"],
          subjects_en: ["Mathematics", "Physics"],
          price: 10,
          verified: true,
          bio: "معلم خبرة في الرياضيات والفيزياء",
          bio_en: "Experienced teacher in Math and Physics",
        },
      },
      {
        email: "student.test@ostazze.com",
        password: "Student@123456",
        full_name: "محمد الطالب",
        full_name_en: "Mohammed Student",
        account_type: "student",
      },
    ];

    const { data: existing } = await supabaseAdmin.auth.admin.listUsers();
    const results: Array<Record<string, unknown>> = [];

    for (const u of users) {
      const found = existing?.users?.find((x) => x.email === u.email);
      let userId: string;

      if (found) {
        userId = found.id;
        // Reset password to ensure it's known
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          password: u.password,
          email_confirm: true,
        });
        results.push({ email: u.email, status: "already_existed_password_reset" });
      } else {
        const { data: created, error: createErr } =
          await supabaseAdmin.auth.admin.createUser({
            email: u.email,
            password: u.password,
            email_confirm: true,
            user_metadata: {
              full_name: u.full_name,
              account_type: u.account_type,
            },
          });
        if (createErr) throw createErr;
        userId = created.user!.id;
        results.push({ email: u.email, status: "created" });
      }

      // Ensure profile exists/updated
      await supabaseAdmin
        .from("profiles")
        .upsert(
          {
            user_id: userId,
            full_name: u.full_name,
            full_name_en: u.full_name_en,
            account_type: u.account_type,
            bio: u.teacher?.bio ?? null,
            bio_en: u.teacher?.bio_en ?? null,
          },
          { onConflict: "user_id" }
        );

      if (u.teacher) {
        await supabaseAdmin
          .from("teacher_profiles")
          .upsert(
            {
              user_id: userId,
              university: u.teacher.university,
              university_en: u.teacher.university_en,
              subjects: u.teacher.subjects,
              subjects_en: u.teacher.subjects_en,
              price: u.teacher.price,
              verified: u.teacher.verified,
            },
            { onConflict: "user_id" }
          );
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        results,
        credentials: {
          teacher: { email: "teacher.test@ostazze.com", password: "Teacher@123456" },
          student: { email: "student.test@ostazze.com", password: "Student@123456" },
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
