import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBilingual } from "@/hooks/useBilingual";
import { Star, Clock, BookOpen, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BookSessionModal from "@/components/BookSessionModal";
import { supabase } from "@/integrations/supabase/client";

interface TeacherFull {
  user_id: string;
  full_name: string;
  full_name_en: string | null;
  bio: string | null;
  bio_en: string | null;
  avatar_url: string | null;
  subjects: string[];
  subjects_en: string[];
  university: string | null;
  university_en: string | null;
  price: number;
  verified: boolean;
}

interface AvailSlot {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

const TeacherProfile = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const [teacher, setTeacher] = useState<TeacherFull | null>(null);
  const [availability, setAvailability] = useState<AvailSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  const DAYS = [t("day_sun"), t("day_mon"), t("day_tue"), t("day_wed"), t("day_thu"), t("day_fri"), t("day_sat")];

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      const { data: tp } = await supabase
        .from("teacher_profiles")
        .select("user_id, subjects, university, price, verified")
        .eq("user_id", id)
        .single();

      if (!tp) { setLoading(false); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, bio, avatar_url")
        .eq("user_id", id)
        .single();

      setTeacher({
        user_id: tp.user_id,
        full_name: profile?.full_name || t("the_teacher"),
        bio: profile?.bio || null,
        avatar_url: profile?.avatar_url || null,
        subjects: tp.subjects || [],
        university: tp.university || null,
        price: tp.price || 0,
        verified: tp.verified || false,
      });

      const { data: avail } = await supabase
        .from("teacher_availability")
        .select("day_of_week, start_time, end_time")
        .eq("teacher_id", id)
        .eq("is_active", true)
        .order("day_of_week");

      setAvailability((avail as AvailSlot[]) || []);
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">{t("teacher_not_found")}</h1>
        <Link to="/teachers" className="btn-primary mt-4 inline-block">{t("teacher_back")}</Link>
      </div>
    );
  }

  const initials = teacher.full_name.split(" ").map((w) => w[0]).join("").slice(0, 2);

  return (
    <div>
      <section className="hero-gradient py-8">
        <div className="container">
          <p className="text-muted-foreground text-sm">
            <Link to="/teachers" className="hover:text-primary">{t("nav_teachers")}</Link> / {teacher.full_name}
          </p>
        </div>
      </section>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card-base p-6">
              <div className="flex gap-5 mb-6">
                <motion.div whileHover={{ scale: 1.08, rotate: 5 }} className="w-20 h-20 rounded-2xl stats-gradient text-primary-foreground flex items-center justify-center text-2xl font-black shrink-0">
                  {initials}
                </motion.div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1 className="text-xl font-black">{teacher.full_name}</h1>
                    {teacher.verified && <span className="text-xs bg-success/10 text-success px-2.5 py-1 rounded-full font-semibold">{t("teacher_verified")}</span>}
                  </div>
                  {teacher.university && (
                    <div className="inline-flex items-center gap-1.5 mt-2 text-xs bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 px-3 py-1 rounded-full">
                      <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}><BookOpen size={12} /></motion.div>
                      {teacher.university}
                    </div>
                  )}
                </div>
              </div>

              {teacher.bio && <p className="text-muted-foreground leading-relaxed mb-6">{teacher.bio}</p>}

              <div className="flex flex-wrap gap-2 mb-6">
                {teacher.subjects.map((s, i) => <span key={i} className="badge-brand">{s}</span>)}
              </div>

              <div className="flex gap-4 items-center flex-wrap">
                <div className="bg-secondary rounded-xl p-4 text-center">
                  <div className="text-xl font-black text-primary">{teacher.price} {t("sar")}</div>
                  <div className="text-muted-foreground text-xs">{t("teacher_per_session")}</div>
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowBooking(true)} className="btn-primary flex-1 text-center text-lg">
                  {t("teacher_book")} →
                </motion.button>
              </div>

              <BookSessionModal
                open={showBooking}
                onClose={() => setShowBooking(false)}
                teacherId={teacher.user_id}
                teacherName={teacher.full_name}
                subjects={teacher.subjects}
                price={teacher.price}
                currency={t("sar")}
              />
            </div>

            {availability.length > 0 && (
              <div className="card-base p-6">
                <h3 className="font-extrabold text-lg mb-4 flex items-center gap-2">
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}><Clock size={20} className="text-primary" /></motion.div>
                  {t("teacher_availability")}
                </h3>
                <div className="space-y-3">
                  {availability.map((a, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                      <span className="font-bold text-sm">{DAYS[a.day_of_week]}</span>
                      <span className="text-muted-foreground text-sm">{a.start_time.slice(0, 5)} - {a.end_time.slice(0, 5)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="card-base p-6">
              <h3 className="font-extrabold text-lg mb-4">{t("teacher_reviews")}</h3>
              <div className="text-center py-8 text-muted-foreground text-sm">
                {t("no_reviews_yet")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
