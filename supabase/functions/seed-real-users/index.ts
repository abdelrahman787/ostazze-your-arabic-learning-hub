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

    const teachers = [
      {
        email: "dr.fatima.ali@ostazze.com",
        password: "Teacher@2025",
        full_name: "د. فاطمة علي السالم",
        full_name_en: "Dr. Fatima Ali Al-Salem",
        bio: "دكتوراه في الرياضيات، خبرة 12 سنة في تدريس طلاب الجامعة",
        bio_en: "PhD in Mathematics, 12 years experience teaching university students",
        university: "جامعة الكويت",
        university_en: "Kuwait University",
        subjects: ["رياضيات", "إحصاء", "تفاضل وتكامل"],
        subjects_en: ["Mathematics", "Statistics", "Calculus"],
        price: 12,
      },
      {
        email: "prof.khaled.mansour@ostazze.com",
        password: "Teacher@2025",
        full_name: "أ. خالد منصور العنزي",
        full_name_en: "Prof. Khaled Mansour Al-Anzi",
        bio: "أستاذ الفيزياء، متخصص في الميكانيكا والكهرومغناطيسية",
        bio_en: "Physics professor specializing in Mechanics and Electromagnetism",
        university: "الجامعة الأمريكية في الكويت",
        university_en: "American University of Kuwait",
        subjects: ["فيزياء", "ميكانيكا"],
        subjects_en: ["Physics", "Mechanics"],
        price: 15,
      },
      {
        email: "dr.sara.ibrahim@ostazze.com",
        password: "Teacher@2025",
        full_name: "د. سارة إبراهيم الرشيد",
        full_name_en: "Dr. Sara Ibrahim Al-Rashid",
        bio: "دكتوراه في الكيمياء العضوية، خبرة في تدريس طلاب كلية الطب والصيدلة",
        bio_en: "PhD in Organic Chemistry, experienced in teaching medical and pharmacy students",
        university: "جامعة قطر",
        university_en: "Qatar University",
        subjects: ["كيمياء", "كيمياء عضوية", "كيمياء حيوية"],
        subjects_en: ["Chemistry", "Organic Chemistry", "Biochemistry"],
        price: 14,
      },
      {
        email: "eng.youssef.hassan@ostazze.com",
        password: "Teacher@2025",
        full_name: "م. يوسف حسن المطيري",
        full_name_en: "Eng. Youssef Hassan Al-Mutairi",
        bio: "مهندس برمجيات وخبير في علوم الحاسب، خبرة 8 سنوات في التدريس",
        bio_en: "Software engineer and computer science expert with 8 years of teaching",
        university: "جامعة الخليج للعلوم والتكنولوجيا",
        university_en: "Gulf University for Science and Technology",
        subjects: ["برمجة", "علوم الحاسب", "هياكل البيانات"],
        subjects_en: ["Programming", "Computer Science", "Data Structures"],
        price: 13,
      },
      {
        email: "dr.layla.abdullah@ostazze.com",
        password: "Teacher@2025",
        full_name: "د. ليلى عبدالله الكندري",
        full_name_en: "Dr. Layla Abdullah Al-Kandari",
        bio: "دكتوراه في الأدب الإنجليزي، متخصصة في تدريس اللغة والكتابة الأكاديمية",
        bio_en: "PhD in English Literature, specialized in language and academic writing",
        university: "جامعة الكويت",
        university_en: "Kuwait University",
        subjects: ["لغة إنجليزية", "كتابة أكاديمية", "أدب"],
        subjects_en: ["English", "Academic Writing", "Literature"],
        price: 11,
      },
    ];

    const students = [
      { email: "abdullah.ahmed@ostazze.com", full_name: "عبدالله أحمد الفهد", full_name_en: "Abdullah Ahmed Al-Fahad" },
      { email: "noura.salem@ostazze.com", full_name: "نورة سالم الدوسري", full_name_en: "Noura Salem Al-Dosari" },
      { email: "mohammed.khalid@ostazze.com", full_name: "محمد خالد العجمي", full_name_en: "Mohammed Khalid Al-Ajmi" },
      { email: "hessa.nasser@ostazze.com", full_name: "حصة ناصر المري", full_name_en: "Hessa Nasser Al-Marri" },
      { email: "fahad.sultan@ostazze.com", full_name: "فهد سلطان الشمري", full_name_en: "Fahad Sultan Al-Shammari" },
      { email: "maryam.jassim@ostazze.com", full_name: "مريم جاسم البلوشي", full_name_en: "Maryam Jassim Al-Balushi" },
      { email: "ali.hamad@ostazze.com", full_name: "علي حمد الخالدي", full_name_en: "Ali Hamad Al-Khaldi" },
      { email: "shaikha.rashed@ostazze.com", full_name: "شيخة راشد الهاجري", full_name_en: "Shaikha Rashed Al-Hajri" },
      { email: "omar.tariq@ostazze.com", full_name: "عمر طارق الصباح", full_name_en: "Omar Tariq Al-Sabah" },
      { email: "dana.waleed@ostazze.com", full_name: "دانة وليد العتيبي", full_name_en: "Dana Waleed Al-Otaibi" },
    ];

    const password = "Student@2025";
    const { data: existing } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    const results: Array<Record<string, unknown>> = [];

    // Teachers
    for (const t of teachers) {
      const found = existing?.users?.find((x) => x.email === t.email);
      let userId: string;

      if (found) {
        userId = found.id;
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          password: t.password,
          email_confirm: true,
        });
        results.push({ email: t.email, role: "teacher", status: "existed_updated" });
      } else {
        const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
          email: t.email,
          password: t.password,
          email_confirm: true,
          user_metadata: { full_name: t.full_name, account_type: "teacher" },
        });
        if (error) {
          results.push({ email: t.email, role: "teacher", error: error.message });
          continue;
        }
        userId = created.user!.id;
        results.push({ email: t.email, role: "teacher", status: "created" });
      }

      await supabaseAdmin.from("profiles").upsert(
        {
          user_id: userId,
          full_name: t.full_name,
          full_name_en: t.full_name_en,
          account_type: "teacher",
          bio: t.bio,
          bio_en: t.bio_en,
        },
        { onConflict: "user_id" }
      );

      await supabaseAdmin.from("teacher_profiles").upsert(
        {
          user_id: userId,
          university: t.university,
          university_en: t.university_en,
          subjects: t.subjects,
          subjects_en: t.subjects_en,
          price: t.price,
          verified: true,
        },
        { onConflict: "user_id" }
      );
    }

    // Students
    for (const s of students) {
      const found = existing?.users?.find((x) => x.email === s.email);
      let userId: string;

      if (found) {
        userId = found.id;
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          password,
          email_confirm: true,
        });
        results.push({ email: s.email, role: "student", status: "existed_updated" });
      } else {
        const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
          email: s.email,
          password,
          email_confirm: true,
          user_metadata: { full_name: s.full_name, account_type: "student" },
        });
        if (error) {
          results.push({ email: s.email, role: "student", error: error.message });
          continue;
        }
        userId = created.user!.id;
        results.push({ email: s.email, role: "student", status: "created" });
      }

      await supabaseAdmin.from("profiles").upsert(
        {
          user_id: userId,
          full_name: s.full_name,
          full_name_en: s.full_name_en,
          account_type: "student",
        },
        { onConflict: "user_id" }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        summary: {
          teachers_count: teachers.length,
          students_count: students.length,
          teacher_password: "Teacher@2025",
          student_password: "Student@2025",
        },
        results,
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
