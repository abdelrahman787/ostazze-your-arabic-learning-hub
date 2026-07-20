import { useState, useEffect } from "react";

import { useSearchParams } from "react-router-dom";
import TeacherCard from "@/components/TeacherCard";
import type { TeacherData } from "@/components/TeacherCard";
import { UserX, RefreshCw, Sparkles, Users, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import PageHelmet from "@/components/PageHelmet";
import PageHeader from "@/components/PageHeader";
import BookingFlowModal from "@/components/BookingFlowModal";
import WhatsAppTutorBanner from "@/components/WhatsAppTutorBanner";

const TeacherCardSkeleton = () => (
  <div className="card-base flex flex-col p-5 gap-3">
    <div className="flex gap-3">
      <Skeleton className="w-14 h-14 rounded-2xl bg-muted-foreground/15" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4 bg-muted-foreground/15" />
        <Skeleton className="h-3 w-1/2 bg-muted-foreground/15" />
      </div>
    </div>
    <div className="flex gap-1.5 mt-2">
      <Skeleton className="h-6 w-16 rounded-lg bg-muted-foreground/15" />
      <Skeleton className="h-6 w-20 rounded-lg bg-muted-foreground/15" />
    </div>
    <Skeleton className="h-10 w-full rounded-xl mt-auto bg-muted-foreground/15" />
  </div>
);

const Teachers = () => {
  const { t, lang } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialSubject = searchParams.get("subject") || "";
  const courseLabel = searchParams.get("course") || "";
  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);


  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) setLoadingTimeout(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      setLoadingTimeout(false);
      const { data: tps } = await supabase
        .from("teacher_profiles")
        .select("user_id, subjects, subjects_en, university, university_en, price, verified");

      if (!tps || tps.length === 0) { setLoading(false); return; }

      const userIds = tps.map((tp) => tp.user_id);
      const { data: profiles } = await supabase.rpc("get_public_profiles", { _user_ids: userIds });

      const profileMap = new Map((profiles || []).map((p: any) => [p.user_id, p]));

      const merged: TeacherData[] = tps.map((tp) => {
        const profile = profileMap.get(tp.user_id);
        return {
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
        };
      });

      setTeachers(merged);
      setLoading(false);
    };
    fetchTeachers();
  }, [t]);

  const sorted = teachers;


  return (
    <div>
      <PageHelmet
        title={lang === "ar"
          ? "المعلمون - أفضل المعلمين الجامعيين - أستازي OSTAZE"
          : "Tutors - Top University Tutors - OSTAZE"}
        description={lang === "ar"
          ? "تصفح أفضل المعلمين الجامعيين على منصة أستازي — معلمون متخصصون بتقييمات حقيقية من الطلاب. احجز حصتك الخصوصية الآن."
          : "Browse top university tutors on OSTAZE — verified specialists with real student ratings. Book your private session now."}
        canonical="https://ostaze.com/teachers"
      />
      <PageHeader title={t("teachers_title")} subtitle={t("teachers_choose")} variant="teachers" />

      <div className="container pt-6">
        <WhatsAppTutorBanner />
      </div>

      <div className="container py-8">
        {/* Subject context banner — appears when arriving from a course request */}
        {initialSubject && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                <Users size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium">
                  {lang === "ar" ? "تتصفح مدرسي" : "Browsing tutors for"}
                </p>
                <h3 className="font-extrabold text-base sm:text-lg text-foreground truncate">
                  {initialSubject}
                  {courseLabel && courseLabel !== initialSubject && (
                    <span className="text-sm text-muted-foreground font-medium block sm:inline sm:ms-2">
                      ({courseLabel})
                    </span>
                  )}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {lang === "ar"
                    ? "اضغط حجز حصة لتختار المدرس المناسب وتتابع للدفع"
                    : "Click Book a session to pick your tutor and proceed to payment"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setAssignModalOpen(true)}
              className="btn-primary inline-flex items-center justify-center gap-2 shrink-0"
            >
              <Calendar size={16} />
              {lang === "ar" ? "حجز حصة" : "Book a session"}
            </button>
          </motion.div>
        )}

        {loading ? (
          <div>
            {loadingTimeout && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-6">
                <p className="text-muted-foreground text-sm">{t("teachers_loading_timeout")}</p>
                <button onClick={() => window.location.reload()} className="text-primary text-sm font-bold hover:underline mt-2 inline-flex items-center gap-1.5">
                  <RefreshCw size={14} />
                  {lang === "ar" ? "تحديث الصفحة" : "Refresh Page"}
                </button>
              </motion.div>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <TeacherCardSkeleton key={i} />)}
            </div>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground text-sm mb-6 font-medium">{t("showing_results")} {sorted.length} {t("teacher_word")}</p>
            {sorted.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sorted.map((tc, i) => <TeacherCard key={tc.user_id} teacher={tc} index={i} />)}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16 max-w-xl mx-auto">
                <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-5">
                  <UserX size={36} className="text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-extrabold mb-2">{t("teachers_empty_title")}</h3>
                <p className="text-muted-foreground mx-auto mb-6">
                  {initialSubject
                    ? lang === "ar"
                      ? `لم نجد مدرسين متاحين حالياً في "${initialSubject}". اطلب وسنجد لك مدرس مناسب.`
                      : `No tutors available right now for "${initialSubject}". Request one and we'll find you a match.`
                    : t("teachers_empty_desc")}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {initialSubject && (
                    <button
                      onClick={() => setAssignModalOpen(true)}
                      className="btn-primary inline-flex items-center gap-2"
                    >
                      <Sparkles size={16} />
                      {lang === "ar" ? "اطلب مدرس مناسب" : "Request a tutor"}
                    </button>
                  )}
                  <a href="/register" className="btn-outline inline-flex items-center gap-2">
                    {t("teachers_empty_register_cta")}
                  </a>
                  <a href="https://wa.me/966559003498" target="_blank" rel="noopener noreferrer" className="btn-outline inline-flex items-center gap-2">
                    {t("teachers_empty_contact_cta")}
                  </a>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      <BookingFlowModal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        subject={initialSubject}
        courseLabel={courseLabel || undefined}
        teachers={sorted}
      />
    </div>
  );
};

export default Teachers;
