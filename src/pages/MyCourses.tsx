import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookMarked, PlayCircle, Radio, Layers, Clock, ArrowRight, Video, Calendar, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBilingual } from "@/hooks/useBilingual";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PageHelmet from "@/components/PageHelmet";
import PageHeader from "@/components/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";

interface EnrolledCourse {
  enrollment_id: string;
  enrolled_at: string;
  course: {
    id: string;
    title: string;
    title_en: string | null;
    cover_image_url: string | null;
    course_type: "recorded" | "live" | "hybrid";
    total_hours: number;
    category: string | null;
    category_en: string | null;
    instructor_name: string | null;
    instructor_name_en: string | null;
  };
  lessons_count: number;
  next_session: { date: string; time: string; zoom_url: string | null; title: string; title_en: string | null } | null;
}

const typeConfig = {
  recorded: { icon: PlayCircle, ar: "مسجّل", en: "Recorded" },
  live: { icon: Radio, ar: "لايف", en: "Live" },
  hybrid: { icon: Layers, ar: "مختلط", en: "Hybrid" },
} as const;

const MyCourses = () => {
  const { lang } = useLanguage();
  const { b } = useBilingual();
  const { user } = useAuth();
  const [items, setItems] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      setLoading(true);
      const { data: enrollments } = await supabase
        .from("course_enrollments")
        .select("id, enrolled_at, course_id")
        .eq("student_id", user.id)
        .eq("status", "active")
        .order("enrolled_at", { ascending: false });

      if (!enrollments || enrollments.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      const courseIds = enrollments.map(e => e.course_id);
      const [{ data: courses }, { data: lessonCounts }] = await Promise.all([
        supabase.from("courses").select("id, title, title_en, cover_image_url, course_type, total_hours, category, category_en, instructor_name, instructor_name_en").in("id", courseIds),
        supabase.from("course_lessons").select("course_id, id").in("course_id", courseIds),
      ]);

      // Fetch enrolled-only sessions (with zoom_url) per course via SECURITY DEFINER RPC
      const sessionResults = await Promise.all(
        courseIds.map(cid => supabase.rpc("get_course_live_sessions_enrolled", { _course_id: cid }))
      );
      const sessions = sessionResults.flatMap((r, i) =>
        (r.data || []).map((s: any) => ({ ...s, course_id: courseIds[i] }))
      ).filter(s => !s.is_completed)
        .sort((a, b) =>
          (a.scheduled_date + a.scheduled_time).localeCompare(b.scheduled_date + b.scheduled_time)
        );

      const courseMap = new Map(courses?.map(c => [c.id, c]) || []);
      const lessonsMap = new Map<string, number>();
      lessonCounts?.forEach(l => lessonsMap.set(l.course_id, (lessonsMap.get(l.course_id) || 0) + 1));
      const nextSessionMap = new Map<string, EnrolledCourse["next_session"]>();
      sessions?.forEach(s => {
        if (!nextSessionMap.has(s.course_id)) {
          nextSessionMap.set(s.course_id, {
            date: s.scheduled_date,
            time: s.scheduled_time,
            zoom_url: s.zoom_url,
            title: s.title,
            title_en: s.title_en,
          });
        }
      });

      const merged: EnrolledCourse[] = enrollments
        .map(e => {
          const c = courseMap.get(e.course_id);
          if (!c) return null;
          return {
            enrollment_id: e.id,
            enrolled_at: e.enrolled_at,
            course: c as EnrolledCourse["course"],
            lessons_count: lessonsMap.get(e.course_id) || 0,
            next_session: nextSessionMap.get(e.course_id) || null,
          };
        })
        .filter(Boolean) as EnrolledCourse[];

      setItems(merged);
      setLoading(false);
    };
    fetch();
  }, [user]);

  return (
    <div>
      <PageHelmet
        title={lang === "ar" ? "كورساتي" : "My Courses"}
        description={lang === "ar" ? "تابع كورساتك المسجّلة واللايف في OSTAZE" : "Track your enrolled courses on OSTAZE"}
      />
      <PageHeader
        title={lang === "ar" ? "كورساتي" : "My Courses"}
        subtitle={lang === "ar" ? "تابع تقدمك واحضر جلساتك القادمة" : "Track your progress and attend upcoming sessions"}
        variant="subjects"
      />

      <div className="container py-8">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card-base overflow-hidden">
                <Skeleton className="aspect-video w-full bg-muted-foreground/15" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4 bg-muted-foreground/15" />
                  <Skeleton className="h-4 w-1/2 bg-muted-foreground/15" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-5">
              <BookMarked size={36} className="text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-extrabold mb-2">{lang === "ar" ? "لم تشترك في أي كورس بعد" : "You haven't enrolled in any course yet"}</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              {lang === "ar" ? "تصفح الكورسات المتاحة وابدأ رحلتك التعليمية" : "Browse available courses and start your learning journey"}
            </p>
            <Link to="/courses" className="btn-primary inline-flex items-center gap-2">
              {lang === "ar" ? "تصفح الكورسات" : "Browse Courses"} <ArrowRight size={16} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((it, i) => {
              const cfg = typeConfig[it.course.course_type];
              const TypeIcon = cfg.icon;
              const title = b(it.course.title, it.course.title_en);
              const inst = b(it.course.instructor_name, it.course.instructor_name_en);
              return (
                <motion.div
                  key={it.enrollment_id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="card-base overflow-hidden flex flex-col"
                >
                  <Link to={`/courses/${it.course.id}`} className="block relative aspect-video overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                    {it.course.cover_image_url ? (
                      <img src={it.course.cover_image_url} alt={title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary/40">
                        <BookMarked size={48} />
                      </div>
                    )}
                    <div className="absolute top-3 start-3 px-2.5 py-1 rounded-full text-[0.7rem] font-bold flex items-center gap-1.5 bg-card/90 backdrop-blur-md">
                      <TypeIcon size={12} /> {lang === "ar" ? cfg.ar : cfg.en}
                    </div>
                  </Link>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-base mb-1 line-clamp-2">{title}</h3>
                    {inst && <p className="text-xs text-muted-foreground mb-3">{inst}</p>}

                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1"><Video size={12} /> {it.lessons_count} {lang === "ar" ? "درس" : "lessons"}</span>
                      {it.course.total_hours > 0 && (
                        <span className="flex items-center gap-1"><Clock size={12} /> {it.course.total_hours} {lang === "ar" ? "س" : "h"}</span>
                      )}
                    </div>

                    {it.next_session && (
                      <div className="bg-primary/5 border border-primary/15 rounded-xl p-3 mb-4">
                        <div className="text-[0.65rem] font-bold text-primary uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Calendar size={11} /> {lang === "ar" ? "جلسة قادمة" : "Upcoming session"}
                        </div>
                        <div className="text-xs font-semibold mb-1 line-clamp-1">{b(it.next_session.title, it.next_session.title_en)}</div>
                        <div className="text-[0.7rem] text-muted-foreground">
                          {new Date(it.next_session.date).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", { day: "numeric", month: "short" })}
                          {" • "}{it.next_session.time.slice(0, 5)}
                        </div>
                        {it.next_session.zoom_url && (
                          <a href={it.next_session.zoom_url} target="_blank" rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-[0.7rem] font-bold text-primary hover:underline">
                            {lang === "ar" ? "انضم الآن" : "Join now"} <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    )}

                    <Link to={`/courses/${it.course.id}`} className="btn-primary !py-2.5 text-sm mt-auto flex items-center justify-center gap-2">
                      {lang === "ar" ? "افتح الكورس" : "Open Course"} <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
