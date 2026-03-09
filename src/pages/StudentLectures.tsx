import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Video, FileText, MessageSquare, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface LectureItem {
  id: string;
  title: string;
  subject: string | null;
  video_url: string | null;
  pdf_url: string | null;
  created_at: string;
}

const StudentLectures = () => {
  const { user } = useAuth();
  const [lectures, setLectures] = useState<LectureItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("lectures")
        .select("id, title, subject, video_url, pdf_url, created_at")
        .eq("student_id", user.id)
        .order("created_at", { ascending: false });
      setLectures((data as LectureItem[]) || []);
      setLoading(false);
    };
    fetch();
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
        <p className="text-muted-foreground">لا توجد محاضرات سابقة</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-extrabold text-lg">محاضراتي السابقة</h3>
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
              className="card-base p-4 block hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{lec.title}</h4>
                  {lec.subject && <span className="tag-outline text-[0.65rem] mt-1 inline-block">{lec.subject}</span>}
                </div>
                <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors mt-1 rotate-180" />
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Video size={12} className={lec.video_url ? "text-success" : ""} />
                  {lec.video_url ? "فيديو متاح" : "بدون فيديو"}
                </span>
                <span className="flex items-center gap-1">
                  <FileText size={12} className={lec.pdf_url ? "text-destructive" : ""} />
                  {lec.pdf_url ? "PDF متاح" : "بدون ملف"}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare size={12} />
                  محادثة
                </span>
              </div>
              <div className="text-[0.65rem] text-muted-foreground mt-2">
                {new Date(lec.created_at).toLocaleDateString("ar", { year: "numeric", month: "long", day: "numeric" })}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StudentLectures;
