import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Video, FileText, MessageSquare, Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface LectureItem {
  id: string;
  title: string;
  subject: string | null;
  teacher_id: string;
  video_url: string | null;
  pdf_url: string | null;
  created_at: string;
  teacher_name?: string;
}

const StudentLectures = () => {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const [lectures, setLectures] = useState<LectureItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const { data } = await supabase
        .from("lectures")
        .select("id, title, subject, teacher_id, video_url, pdf_url, created_at")
        .eq("student_id", user.id)
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        const teacherIds = [...new Set(data.map((l) => l.teacher_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name, full_name_en")
          .in("user_id", teacherIds);
        const pMap = new Map(profiles?.map((p) => [p.user_id, p.full_name]) || []);
        setLectures(data.map((l) => ({ ...l, teacher_name: pMap.get(l.teacher_id) || "—" })));
      } else {
        setLectures([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (lectures.length === 0) {
    return (
      <div className="text-center p-12">
        <GraduationCap size={48} className="mx-auto text-muted-foreground/30 mb-3" />
        <p className="text-muted-foreground">{t("no_lectures_yet")}</p>
        <p className="text-muted-foreground text-xs mt-1">{t("lectures_added_by_admin")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-extrabold text-lg">{t("sidebar_my_lectures")}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {lectures.map((lec, i) => (
          <motion.div
            key={lec.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={`/lectures/${lec.id}`}
              className="card-base p-5 block hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{lec.title}</h4>
                  {lec.subject && <span className="tag-outline text-[0.65rem] mt-1 inline-block">{lec.subject}</span>}
                </div>
                <ArrowLeft size={16} className="text-muted-foreground group-hover:text-primary transition-colors mt-1" />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">{lec.teacher_name?.charAt(0) || "T"}</div>
                <span className="text-sm text-muted-foreground">{t("the_teacher")}: <span className="text-foreground font-medium">{lec.teacher_name}</span></span>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Video size={12} className={lec.video_url ? "text-success" : ""} />
                  {lec.video_url ? t("video_available") : t("no_video")}
                </span>
                <span className="flex items-center gap-1">
                  <FileText size={12} className={lec.pdf_url ? "text-destructive" : ""} />
                  {lec.pdf_url ? t("pdf_available") : t("no_file")}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare size={12} />
                  {t("chat_word")}
                </span>
              </div>
              <div className="text-[0.65rem] text-muted-foreground mt-2">
                {new Date(lec.created_at).toLocaleDateString(lang === "ar" ? "ar" : "en", { year: "numeric", month: "long", day: "numeric" })}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StudentLectures;
