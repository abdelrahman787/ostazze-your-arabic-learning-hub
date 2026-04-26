import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Video, Calendar, Clock, ExternalLink, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

interface Lesson {
  id: string;
  subject: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  status: string;
  zoom_url: string | null;
  teacher_name?: string;
  student_name?: string;
}

const MyLessons = ({ role }: { role: "student" | "teacher" }) => {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const col = role === "teacher" ? "teacher_id" : "student_id";
    const { data } = await supabase
      .from("session_requests")
      .select("*")
      .eq(col, user.id)
      .in("status", ["assigned", "confirmed", "completed"])
      .order("preferred_date", { ascending: true });

    if (data && data.length > 0) {
      const otherCol = role === "teacher" ? "student_id" : "teacher_id";
      const ids = [...new Set((data as any[]).map((d: any) => d[otherCol]).filter(Boolean))];
      const { data: profiles } = await supabase.rpc("get_public_profiles", { _user_ids: ids });
      const pMap = new Map((profiles || []).map((p: any) => [p.user_id, p.full_name]));
      setLessons((data as any[]).map((r: any) => ({
        ...r,
        teacher_name: role === "student" ? pMap.get(r.teacher_id) || "—" : undefined,
        student_name: role === "teacher" ? pMap.get(r.student_id) || "—" : undefined,
      })));
    } else {
      setLessons([]);
    }
    setLoading(false);
  }, [user, role]);

  useEffect(() => { fetch(); }, [fetch]);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  if (lessons.length === 0) {
    return (
      <div className="card-base p-12 text-center">
        <BookOpen size={48} className="mx-auto text-muted-foreground/30 mb-3" />
        <p className="text-muted-foreground">{t("no_lessons")}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {lessons.map((lesson, i) => (
        <motion.div key={lesson.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
          className="card-base p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-bold text-sm">{lesson.subject || t("the_subject")}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {role === "student" ? `${t("the_teacher")}: ${lesson.teacher_name}` : `${t("the_student")}: ${lesson.student_name}`}
              </p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
              lesson.status === "assigned" ? "bg-primary/10 text-primary" :
              lesson.status === "confirmed" ? "bg-success/10 text-success" :
              "bg-muted text-muted-foreground"
            }`}>
              {t((`bstatus_${lesson.status}` as any)) || lesson.status}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            {lesson.preferred_date && (
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {new Date(lesson.preferred_date).toLocaleDateString(lang === "ar" ? "ar" : "en", { month: "short", day: "numeric" })}
              </span>
            )}
            {lesson.preferred_time && (
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {lesson.preferred_time.slice(0, 5)}
              </span>
            )}
          </div>

          {lesson.zoom_url ? (
            <motion.a whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              href={lesson.zoom_url} target="_blank" rel="noopener noreferrer"
              className="btn-primary flex items-center justify-center gap-2 text-sm w-full">
              <Video size={16} /> {t("lesson_zoom")} <ExternalLink size={12} />
            </motion.a>
          ) : (
            <div className="text-xs text-muted-foreground text-center py-2 bg-secondary rounded-xl">
              {t("lesson_no_zoom")}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default MyLessons;
