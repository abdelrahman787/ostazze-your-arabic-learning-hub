import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, PlayCircle, Radio, Layers, BookMarked, CheckCircle2, Users, Calendar, Lock, Video, FileText, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBilingual } from "@/hooks/useBilingual";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PageHelmet from "@/components/PageHelmet";
import RefundNote from "@/components/RefundNote";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  title_en: string | null;
  description: string;
  description_en: string | null;
  short_description: string | null;
  short_description_en: string | null;
  price: number;
  course_type: "recorded" | "live" | "hybrid";
  cover_image_url: string | null;
  total_hours: number;
  category: string | null;
  category_en: string | null;
  instructor_name: string | null;
  instructor_name_en: string | null;
  level: string | null;
  enrollment_count: number;
  is_published: boolean;
}

interface Lesson {
  id: string;
  title: string;
  title_en: string | null;
  duration_minutes: number;
  order_index: number;
  is_free_preview: boolean;
  video_url: string | null;
}

interface LiveSession {
  id: string;
  title: string;
  title_en: string | null;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
}

const typeConfig = {
  recorded: { icon: PlayCircle, ar: "كورس مسجّل", en: "Recorded Course" },
  live: { icon: Radio, ar: "كورس لايف", en: "Live Course" },
  hybrid: { icon: Layers, ar: "كورس مختلط", en: "Hybrid Course" },
} as const;

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { b } = useBilingual();
  const { user, isLoggedIn } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      setLoading(true);
      const [{ data: c }, { data: l }, { data: s }] = await Promise.all([
        supabase.from("courses").select("*").eq("id", id).maybeSingle(),
        supabase.from("course_lessons").select("id, title, title_en, duration_minutes, order_index, is_free_preview, video_url").eq("course_id", id).order("order_index"),
        supabase.from("course_live_sessions").select("id, title, title_en, scheduled_date, scheduled_time, duration_minutes").eq("course_id", id).order("scheduled_date").order("scheduled_time"),
      ]);
      setCourse((c as Course) || null);
      setLessons((l as Lesson[]) || []);
      setLiveSessions((s as LiveSession[]) || []);

      if (user && c) {
        const { data: enr } = await supabase
          .from("course_enrollments")
          .select("id")
          .eq("course_id", id)
          .eq("student_id", user.id)
          .eq("status", "active")
          .maybeSingle();
        setEnrolled(!!enr);
      }
      setLoading(false);
    };
    fetch();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!isLoggedIn) {
      toast.info(lang === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please sign in first");
      navigate(`/login?redirect=/courses/${id}`);
      return;
    }
    if (!course || !user) return;
    setEnrolling(true);
    try {
      // For free courses: instant enrollment as 'active'
      if (course.price === 0) {
        const { error } = await supabase.from("course_enrollments").insert({
          course_id: course.id,
          student_id: user.id,
          status: "pending",
          amount_paid: 0,
        });
        if (error && !error.message.includes("duplicate")) throw error;
        toast.success(lang === "ar" ? "تم التسجيل في الكورس بنجاح ✅" : "Enrolled successfully ✅");
        toast.info(lang === "ar" ? "في انتظار تفعيل الإدارة" : "Awaiting admin activation");
        setEnrolled(false);
      } else {
        toast.info(lang === "ar" ? "نظام الدفع قيد التفعيل، سيتم تفعيله قريباً" : "Payment system coming soon");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
    setEnrolling(false);
  };

  if (loading) {
    return (
      <div className="container pt-32 pb-12">
        <Skeleton className="h-8 w-64 mb-6 bg-muted-foreground/15" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="aspect-video w-full rounded-2xl bg-muted-foreground/15" />
            <Skeleton className="h-6 w-3/4 bg-muted-foreground/15" />
            <Skeleton className="h-4 w-full bg-muted-foreground/15" />
          </div>
          <Skeleton className="h-96 w-full rounded-2xl bg-muted-foreground/15" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container pt-32 pb-12 text-center">
        <h1 className="text-2xl font-extrabold mb-3">{lang === "ar" ? "الكورس غير موجود" : "Course not found"}</h1>
        <Link to="/courses" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={16} /> {lang === "ar" ? "عودة للكورسات" : "Back to courses"}
        </Link>
      </div>
    );
  }

  const title = b(course.title, course.title_en);
  const desc = b(course.description, course.description_en);
  const inst = b(course.instructor_name, course.instructor_name_en);
  const cat = b(course.category, course.category_en);
  const cfg = typeConfig[course.course_type];
  const TypeIcon = cfg.icon;
  const typeLabel = lang === "ar" ? cfg.ar : cfg.en;

  return (
    <div>
      <PageHelmet title={title} description={b(course.short_description, course.short_description_en) || desc.slice(0, 160)} />

      {/* Hero header with cover */}
      <section className="relative pt-28 pb-10 bg-section-alt overflow-hidden">
        <div
          className="absolute inset-0 -z-0"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, hsl(14 91% 50% / 0.18) 0%, transparent 65%)" }}
          aria-hidden
        />
        <div className="container relative z-10">
          <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft size={14} /> {lang === "ar" ? "كل الكورسات" : "All Courses"}
          </Link>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3">
              {cat && <span className="inline-block text-xs font-bold text-primary uppercase tracking-wider mb-3">{cat}</span>}
              <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-black mb-4 leading-tight">
                {title}
              </motion.h1>
              {b(course.short_description, course.short_description_en) && (
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-5">
                  {b(course.short_description, course.short_description_en)}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-bold">
                  <TypeIcon size={15} /> {typeLabel}
                </span>
                {course.total_hours > 0 && (
                  <span className="flex items-center gap-1.5 text-muted-foreground"><Clock size={15} /> {course.total_hours} {lang === "ar" ? "ساعة" : "hours"}</span>
                )}
                {course.enrollment_count > 0 && (
                  <span className="flex items-center gap-1.5 text-muted-foreground"><Users size={15} /> {course.enrollment_count} {lang === "ar" ? "مشترك" : "enrolled"}</span>
                )}
                {inst && (
                  <span className="text-muted-foreground">{lang === "ar" ? "بإشراف " : "By "}<span className="font-semibold text-foreground">{inst}</span></span>
                )}
              </div>
            </div>

            {/* Cover */}
            <div className="lg:col-span-2">
              <div className="relative aspect-video rounded-2xl overflow-hidden border bg-gradient-to-br from-primary/20 to-primary/5">
                {course.cover_image_url ? (
                  <img src={course.cover_image_url} alt={title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary/40">
                    <BookMarked size={64} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="container py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Description + Curriculum */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-xl font-extrabold mb-4">{lang === "ar" ? "وصف الكورس" : "About this course"}</h2>
              <div className="card-base p-6 prose-card">
                <p className="text-foreground/85 leading-loose whitespace-pre-line">{desc}</p>
              </div>
            </section>

            {/* Curriculum */}
            {lessons.length > 0 && (
              <section>
                <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
                  <Video size={20} /> {lang === "ar" ? "محتوى الكورس" : "Course Content"}
                  <span className="text-sm text-muted-foreground font-medium">({lessons.length} {lang === "ar" ? "درس" : "lessons"})</span>
                </h2>
                <div className="card-base divide-y">
                  {lessons.map((lesson, i) => {
                    const lTitle = b(lesson.title, lesson.title_en);
                    const accessible = enrolled || lesson.is_free_preview;
                    return (
                      <div key={lesson.id} className="flex items-center gap-3 p-4">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          accessible ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        }`}>
                          {accessible ? <PlayCircle size={18} /> : <Lock size={16} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold">{i + 1}. {lTitle}</span>
                            {lesson.is_free_preview && (
                              <span className="text-[0.65rem] bg-success/15 text-success px-2 py-0.5 rounded-full font-bold">
                                {lang === "ar" ? "معاينة مجانية" : "Free preview"}
                              </span>
                            )}
                          </div>
                        </div>
                        {lesson.duration_minutes > 0 && (
                          <span className="text-xs text-muted-foreground tabular-nums">{lesson.duration_minutes} {lang === "ar" ? "د" : "min"}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Live Sessions */}
            {liveSessions.length > 0 && (
              <section>
                <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
                  <Radio size={20} /> {lang === "ar" ? "جلسات اللايف المجدولة" : "Scheduled Live Sessions"}
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {liveSessions.map((s) => (
                    <div key={s.id} className="card-base p-4 flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                        <Calendar size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm mb-1 line-clamp-1">{b(s.title, s.title_en)}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(s.scheduled_date).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", { day: "numeric", month: "short", year: "numeric" })}
                          {" • "}{s.scheduled_time.slice(0, 5)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right: Enrollment Card */}
          <aside className="lg:col-span-1">
            <div className="card-base p-6 sticky top-24">
              <div className="text-center mb-5">
                <div className="text-4xl font-black text-primary">
                  {course.price === 0 ? (lang === "ar" ? "مجاني" : "Free") : course.price}
                </div>
                {course.price > 0 && (
                  <div className="text-sm text-muted-foreground">{lang === "ar" ? "ريال سعودي" : "SAR"}</div>
                )}
              </div>

              {enrolled ? (
                <button
                  onClick={() => navigate("/my-courses")}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} /> {lang === "ar" ? "ابدأ التعلم" : "Start Learning"}
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="btn-primary w-full disabled:opacity-60"
                >
                  {enrolling ? "..." : (course.price === 0 ? (lang === "ar" ? "اشترك مجاناً" : "Enroll for free") : (lang === "ar" ? "اشترك في الكورس" : "Enroll Now"))}
                </button>
              )}

              {course.price > 0 && <div className="mt-4"><RefundNote /></div>}

              <div className="mt-6 space-y-3 text-sm">
                {[
                  { icon: CheckCircle2, text: lang === "ar" ? "وصول مدى الحياة" : "Lifetime access" },
                  { icon: Video, text: lang === "ar" ? `${lessons.length} درس فيديو` : `${lessons.length} video lessons` },
                  { icon: Radio, text: lang === "ar" ? `${liveSessions.length} جلسة لايف` : `${liveSessions.length} live sessions`, hide: liveSessions.length === 0 },
                  { icon: FileText, text: lang === "ar" ? "شهادة إتمام" : "Certificate of completion" },
                ].filter(i => !i.hide).map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-foreground/75">
                    <item.icon size={16} className="text-primary shrink-0" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
