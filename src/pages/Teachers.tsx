import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TeacherCard from "@/components/TeacherCard";
import type { TeacherData } from "@/components/TeacherCard";
import { Search, SlidersHorizontal, UserX, RefreshCw, Sparkles, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import PageHelmet from "@/components/PageHelmet";
import PageHeader from "@/components/PageHeader";
import BookingFlowModal from "@/components/BookingFlowModal";

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
  const [search, setSearch] = useState(initialSubject);
  const [showFilters, setShowFilters] = useState(!!initialSubject);
  const [sortBy, setSortBy] = useState("");
  const [filterUniversity, setFilterUniversity] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterVerified, setFilterVerified] = useState("");
  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  const universities = [...new Set(teachers.map((tc) => tc.university).filter(Boolean))] as string[];
  const subjects = [...new Set(teachers.flatMap((tc) => tc.subjects))] as string[];

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
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, full_name_en, bio, bio_en, avatar_url")
        .in("user_id", userIds);

      const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));

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

  const q = search.toLowerCase();
  const filterSubjectLower = filterSubject.toLowerCase().trim();
  const filtered = teachers.filter((tc) => {
    if (search && !(
      tc.full_name.toLowerCase().includes(q) ||
      tc.subjects.some((s) => s.toLowerCase().includes(q)) ||
      (tc.university && tc.university.toLowerCase().includes(q))
    )) return false;
    if (filterUniversity && tc.university !== filterUniversity) return false;
    if (filterSubjectLower) {
      // Match if any of teacher's subjects (Arabic or English) contains
      // the requested subject — or vice versa — for fuzzy linking from courses.
      const allSubjects = [...(tc.subjects || []), ...((tc as any).subjects_en || [])];
      const matched = allSubjects.some((s) => {
        const lower = String(s).toLowerCase();
        return lower.includes(filterSubjectLower) || filterSubjectLower.includes(lower);
      });
      if (!matched) return false;
    }
    if (filterVerified === "verified" && !tc.verified) return false;
    if (filterVerified === "unverified" && tc.verified) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "name-asc") return (a.full_name || "").localeCompare(b.full_name || "");
    if (sortBy === "name-desc") return (b.full_name || "").localeCompare(a.full_name || "");
    return 0;
  });

  const clearFilters = () => {
    setFilterUniversity("");
    setFilterSubject("");
    setFilterVerified("");
    setSortBy("");
  };

  const hasActiveFilters = filterUniversity || filterSubject || filterVerified || sortBy;

  const allLabel = lang === "ar" ? "الكل" : "All";
  const nameAsc = lang === "ar" ? "الاسم (أ-ي)" : "Name (A-Z)";
  const nameDesc = lang === "ar" ? "الاسم (ي-أ)" : "Name (Z-A)";
  const clearLabel = lang === "ar" ? "مسح الفلاتر" : "Clear Filters";

  return (
    <div>
      <PageHelmet title={t("teachers_title")} description={t("teachers_choose")} />
      <PageHeader title={t("teachers_title")} subtitle={t("teachers_choose")} variant="teachers" />

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

        <div className="card-base p-6 mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder={lang === "ar" ? "ابحث بالاسم، المادة، أو الجامعة..." : "Search by name, subject, or university..."}
                className="input-base !pr-10" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="btn-outline !py-2 flex items-center gap-2">
              <SlidersHorizontal size={16} />
              {t("filter_btn")}
              {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-primary" />}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 animate-fade-in space-y-3">
              <div className="flex flex-wrap gap-3">
                <select className="input-base !w-auto" value={filterUniversity} onChange={(e) => setFilterUniversity(e.target.value)}>
                  <option value="">{t("th_university")} - {allLabel}</option>
                  {universities.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
                <select className="input-base !w-auto" value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
                  <option value="">{t("th_subject")} - {allLabel}</option>
                  {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <select className="input-base !w-auto" value={filterVerified} onChange={(e) => setFilterVerified(e.target.value)}>
                  <option value="">{t("th_status")} - {allLabel}</option>
                  <option value="verified">{t("teacher_verified")}</option>
                  <option value="unverified">{t("admin_under_review")}</option>
                </select>
                <select className="input-base !w-auto" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="">{t("filter_sort")}</option>
                  <option value="name-asc">{nameAsc}</option>
                  <option value="name-desc">{nameDesc}</option>
                </select>
              </div>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-destructive font-bold hover:underline">
                  {clearLabel}
                </button>
              )}
            </div>
          )}
        </div>

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
