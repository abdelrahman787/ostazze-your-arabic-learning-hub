import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `أنت "أستازي" — المساعد الذكي الرسمي لمنصة OSTAZZE التعليمية.

═══ الهوية والشخصية ═══
اسمك: أستازي
دورك: مساعد تعليمي شخصي ذكي يساعد الطلاب في إيجاد المعلم المناسب وحجز الجلسات
شخصيتك: ودود، محترف، صبور، متحمس للتعليم
لهجتك: مصرية ودودة لكن محترفة
لو الطالب كتب بالإنجليزي، رد بالإنجليزي.

═══ سلوك البحث — مهم جداً ═══
1. لما الطالب يطلب مادة، نفّذ search_teachers فوراً بدون أسئلة إضافية غير ضرورية
2. لو الطالب قال "رياضيات" أو "ماث"، ابحث أيضاً عن: التفاضل والتكامل، الإحصاء، الجبر، Math, Calculus, Statistics, Algebra
3. لو الطالب قال "فيزياء"، ابحث أيضاً عن: فيزياء عامة, Physics
4. لو مفيش نتائج بالكلمة المحددة، وسّع البحث تلقائياً (بدون جامعة، بدون فلتر توثيق)
5. لو لسه مفيش نتائج، ابحث بدون أي فلاتر واعرض كل المعلمين المتاحين
6. متسألش أكتر من سؤال واحد قبل ما تبحث — ابحث الأول وبعدين اسأل لو محتاج تفاصيل أكتر

═══ سير المحادثة ═══

▎المرحلة 1: الترحيب وفهم الاحتياج
- رحّب بالطالب باسمه (لو متاح)
- اسأله: "إيه اللي أقدر أساعدك فيه النهاردة؟"

▎المرحلة 2: البحث والترشيح
- لما الطالب يذكر مادة → نفّذ search_teachers فوراً
- اعرض أفضل 1-3 معلمين بالشكل:
  🏆 الترشيح الأول: أ/ [الاسم]
     ✅ موثق (لو موثق)
     🎓 [الجامعة]
     📚 متخصص في: [المواد]
     ⭐ التقييم: [X]/5
     💰 السعر: [X]
- اسأل: "تحب تحجز مع مين؟"

▎المرحلة 3: الحجز
بعد اختيار المعلم:
1. اعرض المواعيد المتاحة (get_teacher_availability)
2. الطالب يختار الموعد
3. اسأل عن ملاحظات (اختياري)
4. اعرض ملخص الحجز واطلب التأكيد
5. بعد التأكيد → نفّذ create_booking

═══ قواعد مهمة ═══
1. لا تخترع معلمين أو بيانات — استخدم الـ Functions فقط
2. لا تأكد حجز بدون موافقة صريحة ("أيوا" / "تمام" / "أبعت")
3. لا تشارك بيانات خاصة (إيميل، تليفون)
4. أكّد المنطقة الزمنية قبل الحجز
5. اسأل سؤال واحد أو اتنين بس في كل رسالة — متسألش كل الأسئلة مرة واحدة
6. استخدم إيموجي بشكل معتدل (1-3 في الرسالة)
7. الرسائل تكون قصيرة ومركزة
8. في نهاية كل عملية ناجحة، اسأل "محتاج حاجة تانية؟"
9. لو الطالب مش مسجل دخوله، وجّهه لتسجيل الدخول قبل الحجز

═══ سيناريوهات خاصة ═══
- لو مفيش معلم: "للأسف مفيش معلم متاح حالياً للمادة دي 😔 تحب أدوّر في مواد قريبة؟"
- لو الطالب عاوز يلغي حجز: وجّهه للتواصل مع الدعم
- لو عاوز يتكلم مع إنسان: واتساب أو إيميل info@ostazze.com

═══ معلومات المنصة ═══
- المنصة: OSTAZZE — تربط الطلاب بأفضل المعلمين الخصوصيين
- الجلسات: مباشرة عبر Zoom
- الدعم: واتساب + إيميل info@ostazze.com
- تخدم الكويت وقطر حالياً
- اللغات: عربي وإنجليزي
- الموقع: https://ostazze.com`;

const tools = [
  {
    type: "function",
    function: {
      name: "search_teachers",
      description:
        "Search for teachers by subject, university, price, or verification status. Returns matching teachers with their details.",
      parameters: {
        type: "object",
        properties: {
          subject: { type: "string", description: "Subject name (Arabic or English)" },
          university: { type: "string", description: "University name (Arabic or English)" },
          max_price: { type: "number", description: "Maximum price per session" },
          verified_only: { type: "boolean", description: "Only show verified teachers" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_teacher_details",
      description: "Get full details of a specific teacher including reviews.",
      parameters: {
        type: "object",
        properties: { teacher_id: { type: "string" } },
        required: ["teacher_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_teacher_availability",
      description: "Get available time slots for a teacher.",
      parameters: {
        type: "object",
        properties: { teacher_id: { type: "string" } },
        required: ["teacher_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_booking",
      description:
        "Create a session request/booking for a student with a teacher. Requires explicit student confirmation before calling.",
      parameters: {
        type: "object",
        properties: {
          teacher_id: { type: "string" },
          subject: { type: "string" },
          preferred_date: { type: "string", description: "Date in YYYY-MM-DD format" },
          preferred_time: { type: "string", description: "Time in HH:MM format" },
          notes: { type: "string" },
        },
        required: ["teacher_id", "subject", "preferred_date", "preferred_time"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_student_bookings",
      description: "Get current and past bookings for the logged-in student.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "get_subjects_list",
      description: "Get list of available subjects on the platform.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "get_universities_list",
      description: "Get list of supported universities.",
      parameters: { type: "object", properties: {} },
    },
  },
];

// ─── Tool implementations ─────────────────────────────────────────

async function executeToolCall(
  name: string,
  args: Record<string, unknown>,
  supabaseAdmin: ReturnType<typeof createClient>,
  studentId: string | null
): Promise<string> {
  try {
    switch (name) {
      case "search_teachers": {
        let query = supabaseAdmin
          .from("teacher_profiles")
          .select("user_id, price, verified, subjects, subjects_en, university, university_en");

        if (args.verified_only) query = query.eq("verified", true);
        if (args.max_price) query = query.lte("price", args.max_price);

        const { data: teachers, error } = await query;
        if (error) return JSON.stringify({ error: error.message });

        // Filter by subject/university text match
        let results = teachers || [];
        if (args.subject) {
          const s = (args.subject as string).toLowerCase();
          results = results.filter(
            (t) =>
              t.subjects?.some((sub: string) => sub.toLowerCase().includes(s)) ||
              t.subjects_en?.some((sub: string) => sub.toLowerCase().includes(s))
          );
        }
        if (args.university) {
          const u = (args.university as string).toLowerCase();
          results = results.filter(
            (t) =>
              t.university?.toLowerCase().includes(u) ||
              t.university_en?.toLowerCase().includes(u)
          );
        }

        // Enrich with profile names and reviews
        const enriched = await Promise.all(
          results.slice(0, 10).map(async (t) => {
            const [profileRes, reviewsRes] = await Promise.all([
              supabaseAdmin
                .from("profiles")
                .select("full_name, full_name_en")
                .eq("user_id", t.user_id)
                .maybeSingle(),
              supabaseAdmin
                .from("teacher_reviews")
                .select("rating")
                .eq("teacher_id", t.user_id),
            ]);

            const reviews = reviewsRes.data || [];
            const avgRating =
              reviews.length > 0
                ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                : null;

            return {
              teacher_id: t.user_id,
              name: profileRes.data?.full_name || profileRes.data?.full_name_en || "معلم",
              name_en: profileRes.data?.full_name_en,
              subjects: t.subjects,
              subjects_en: t.subjects_en,
              university: t.university,
              university_en: t.university_en,
              price: t.price,
              verified: t.verified,
              rating: avgRating,
              review_count: reviews.length,
            };
          })
        );

        // Sort: verified first, then by rating
        enriched.sort((a, b) => {
          if (a.verified !== b.verified) return a.verified ? -1 : 1;
          return (parseFloat(b.rating || "0") - parseFloat(a.rating || "0"));
        });

        return JSON.stringify({ teachers: enriched, total: enriched.length });
      }

      case "get_teacher_details": {
        const tid = args.teacher_id as string;
        const [tpRes, profRes, revRes] = await Promise.all([
          supabaseAdmin.from("teacher_profiles").select("*").eq("user_id", tid).maybeSingle(),
          supabaseAdmin.from("profiles").select("full_name, full_name_en, bio, bio_en").eq("user_id", tid).maybeSingle(),
          supabaseAdmin.from("teacher_reviews").select("rating, comment, created_at").eq("teacher_id", tid).order("created_at", { ascending: false }).limit(5),
        ]);

        const reviews = revRes.data || [];
        const avgRating = reviews.length > 0
          ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
          : null;

        return JSON.stringify({
          teacher_id: tid,
          name: profRes.data?.full_name,
          name_en: profRes.data?.full_name_en,
          bio: profRes.data?.bio,
          bio_en: profRes.data?.bio_en,
          ...tpRes.data,
          rating: avgRating,
          review_count: reviews.length,
          recent_reviews: reviews,
        });
      }

      case "get_teacher_availability": {
        const tid = args.teacher_id as string;
        const { data, error } = await supabaseAdmin
          .from("teacher_availability")
          .select("day_of_week, start_time, end_time, is_active")
          .eq("teacher_id", tid)
          .eq("is_active", true)
          .order("day_of_week");

        if (error) return JSON.stringify({ error: error.message });

        const dayNames = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
        const dayNamesEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        const slots = (data || []).map((s) => ({
          day: dayNames[s.day_of_week],
          day_en: dayNamesEn[s.day_of_week],
          start_time: s.start_time,
          end_time: s.end_time,
        }));

        return JSON.stringify({ availability: slots });
      }

      case "create_booking": {
        if (!studentId) return JSON.stringify({ error: "الطالب غير مسجل الدخول" });

        const { data, error } = await supabaseAdmin.from("session_requests").insert({
          student_id: studentId,
          teacher_id: args.teacher_id as string,
          subject: args.subject as string,
          preferred_date: args.preferred_date as string,
          preferred_time: args.preferred_time as string,
          notes: (args.notes as string) || null,
          status: "pending",
        }).select("id").single();

        if (error) return JSON.stringify({ error: error.message });
        return JSON.stringify({ success: true, booking_id: data.id, message: "تم إرسال طلب الحجز بنجاح" });
      }

      case "get_student_bookings": {
        if (!studentId) return JSON.stringify({ error: "الطالب غير مسجل الدخول" });

        const { data, error } = await supabaseAdmin
          .from("session_requests")
          .select("id, subject, preferred_date, preferred_time, status, teacher_id, notes")
          .eq("student_id", studentId)
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) return JSON.stringify({ error: error.message });

        // Enrich with teacher names
        const enriched = await Promise.all(
          (data || []).map(async (b) => {
            const { data: prof } = await supabaseAdmin
              .from("profiles")
              .select("full_name")
              .eq("user_id", b.teacher_id)
              .maybeSingle();
            return { ...b, teacher_name: prof?.full_name || "معلم" };
          })
        );

        return JSON.stringify({ bookings: enriched });
      }

      case "get_subjects_list": {
        const { data } = await supabaseAdmin
          .from("teacher_profiles")
          .select("subjects, subjects_en");

        const allSubjects = new Set<string>();
        (data || []).forEach((t) => {
          t.subjects?.forEach((s: string) => allSubjects.add(s));
          t.subjects_en?.forEach((s: string) => allSubjects.add(s));
        });

        return JSON.stringify({ subjects: Array.from(allSubjects) });
      }

      case "get_universities_list": {
        const { data } = await supabaseAdmin
          .from("teacher_profiles")
          .select("university, university_en");

        const unis = new Map<string, string>();
        (data || []).forEach((t) => {
          if (t.university) unis.set(t.university, t.university_en || t.university);
        });

        return JSON.stringify({
          universities: Array.from(unis.entries()).map(([ar, en]) => ({ name_ar: ar, name_en: en })),
        });
      }

      default:
        return JSON.stringify({ error: `Unknown function: ${name}` });
    }
  } catch (e) {
    return JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" });
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, conversation_id, student_id, student_name } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Build system prompt with student context
    let systemPrompt = SYSTEM_PROMPT;
    if (student_name) {
      systemPrompt += `\n\nالطالب الحالي: ${student_name}`;
    }
    if (!student_id) {
      systemPrompt += `\n\nالطالب غير مسجل الدخول. اطلب منه تسجيل الدخول أولاً لو عاوز يحجز.`;
    }

    const allMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    // Call AI with tools
    let response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: allMessages,
        tools,
        tool_choice: "auto",
      }),
    });

    if (!response.ok) {
      const status = response.status;
      const txt = await response.text();
      console.error("AI gateway error:", status, txt);
      if (status === 429) {
        return new Response(JSON.stringify({ error: "rate_limited" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "payment_required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI error: ${status}`);
    }

    let result = await response.json();
    let choice = result.choices?.[0];

    // Tool call loop (max 5 iterations)
    let iterations = 0;
    while (choice?.message?.tool_calls && iterations < 5) {
      iterations++;
      const toolCalls = choice.message.tool_calls;

      // Add assistant message with tool calls
      allMessages.push(choice.message);

      // Execute all tool calls
      for (const tc of toolCalls) {
        const fnName = tc.function.name;
        const fnArgs = JSON.parse(tc.function.arguments || "{}");
        const fnResult = await executeToolCall(fnName, fnArgs, supabaseAdmin, student_id);

        allMessages.push({
          role: "tool",
          tool_call_id: tc.id,
          content: fnResult,
        });
      }

      // Call AI again with tool results
      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: allMessages,
          tools,
          tool_choice: "auto",
        }),
      });

      if (!response.ok) {
        const txt = await response.text();
        console.error("AI follow-up error:", response.status, txt);
        throw new Error("AI follow-up error");
      }

      result = await response.json();
      choice = result.choices?.[0];
    }

    const assistantContent = choice?.message?.content || "عذراً، حصلت مشكلة. حاول تاني.";

    // Save messages to DB if conversation_id provided
    if (conversation_id && student_id) {
      const userMsg = messages[messages.length - 1];
      await supabaseAdmin.from("ai_chat_messages").insert([
        { conversation_id, role: "user", content: userMsg.content },
        { conversation_id, role: "assistant", content: assistantContent },
      ]);
    }

    return new Response(JSON.stringify({ content: assistantContent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ostazze-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
