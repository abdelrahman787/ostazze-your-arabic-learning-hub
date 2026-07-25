import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBilingual } from "@/hooks/useBilingual";
import { Clock, BookOpen, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BookSessionModal from "@/components/BookSessionModal";
import RefundNote from "@/components/RefundNote";
import PageHelmet from "@/components/PageHelmet";
import { personJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

import { getTeacherMajor } from "@/lib/teacherMajors";
import { getTeacherAvatar } from "@/lib/teacherAvatars";

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
  const { t, lang } = useLanguage();
  const { b, bArr } = useBilingual();
  const { user } = useAuth();
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
        .select("user_id, subjects, subjects_en, university, university_en, price, verified")
        .eq("user_id", id)
        .single();

      if (!tp) { setLoading(false); return; }

      const { data: profileRows } = await supabase.rpc("get_public_profile", { _user_id: id });
      const profile = (profileRows as any[])?.[0] || null;

      setTeacher({
        user_id: tp.user_id,
        full_name: profile?.full_name || t("the_teacher"),
        full_name_en: profile?.full_name_en || null,
        bio: profile?.bio || null,
        bio_en: profile?.bio_en || null,
        avatar_url: profile?.avatar_url || null,
        subjects: tp.subjects || [],
        subjects_en: (tp as any).subjects_en || [],
        university: tp.university || null,
        university_en: (tp as any).university_en || null,
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

  const displayName = b(teacher.full_name, teacher.full_name_en, t("the_teacher"));
  const displayBio = b(teacher.bio, teacher.bio_en);
  const displaySubjects = bArr(teacher.subjects, teacher.subjects_en);
  const initials = displayName.split(" ").map((w) => w[0]).join("").slice(0, 2);
  const displayMajor = getTeacherMajor(teacher.user_id, lang === "en" ? "en" : "ar");

  return (
    <div>
      <PageHelmet
        title={displayName}
        description={(displayBio || `${displayName} — ${displayMajor}`).slice(0, 160)}
        ogType="profile"
        jsonLd={[
          personJsonLd({
            id: teacher.user_id,
            name: displayName,
            jobTitle: lang === "ar" ? "معلم" : "Tutor",
            university: undefined,
            subjects: displaySubjects,
          }),
          breadcrumbJsonLd([
            { name: lang === "ar" ? "الرئيسية" : "Home", path: "/" },
            { name: t("nav_teachers"), path: "/teachers" },
            { name: displayName, path: `/teachers/${teacher.user_id}` },
          ]),
        ]}
      />
      <section className="hero-gradient py-8">
        <div className="container">
          <p className="text-muted-foreground text-sm">
            <Link to="/teachers" className="hover:text-primary">{t("nav_teachers")}</Link> / {displayName}
          </p>
        </div>
      </section>

      <div className="container py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="card-base p-6">
            <div className="flex gap-5 mb-6">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={teacher.avatar_url || getTeacherAvatar(teacher.user_id, teacher.full_name)}
                alt={displayName}
                className="w-20 h-20 rounded-2xl object-cover shadow-md shrink-0"
                loading="lazy"
                width={80}
                height={80}
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-xl font-black">{displayName}</h1>
                  {teacher.verified && <span className="text-xs bg-success/10 text-success px-2.5 py-1 rounded-full font-semibold">{t("teacher_verified")}</span>}
                </div>
                <div className="inline-flex items-center gap-1.5 mt-2 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                  <BookOpen size={12} />
                  {displayMajor}
                </div>
              </div>
            </div>


            {displayBio && <p className="text-muted-foreground leading-relaxed mb-6">{displayBio}</p>}

            <div className="flex flex-wrap gap-2 mb-6">
              {displaySubjects.map((s, i) => <span key={i} className="badge-brand">{s}</span>)}
            </div>

            <RefundNote className="mb-4" />

            <div className="flex gap-4 items-center flex-wrap">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowBooking(true)} className="btn-primary flex-1 text-center text-lg">
                {t("teacher_book")} →
              </motion.button>
            </div>

            <BookSessionModal
              open={showBooking}
              onClose={() => setShowBooking(false)}
              teacherId={teacher.user_id}
              teacherName={displayName}
              subjects={displaySubjects}
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
      </div>
    </div>
  );
};

export default TeacherProfile;
