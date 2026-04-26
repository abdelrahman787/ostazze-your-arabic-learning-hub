import { useState, useMemo, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, ChevronLeft, ChevronRight, ChevronDown,
  BookOpen, Layers, GraduationCap, CalendarPlus, Loader2, Search,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import PageHelmet from "@/components/PageHelmet";
import { breadcrumbJsonLd, collectionPageJsonLd } from "@/lib/seo";
import { useLanguage } from "@/contexts/LanguageContext";
import { allUniversities, College, Department } from "@/data/universitiesData";
import { resolveCourseSubject } from "@/lib/courseSubjectMap";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import BookingFlowModal from "@/components/BookingFlowModal";
import type { TeacherData } from "@/components/TeacherCard";

interface DeptProps {
  dept: Department;
  lang: "ar" | "en";
  index: number;
  onRequest: (subject: string, courseLabel: string) => void;
}

const DepartmentBlock = ({ dept, lang, index, onRequest }: DeptProps) => {
  const [open, setOpen] = useState(index === 0);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="card-base overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors text-start"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-black text-sm">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-base leading-tight">
            {lang === "ar" ? dept.name_ar : dept.name_en}
          </p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {dept.degrees.map((d) => (
              <span
                key={d}
                className="text-[0.6rem] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase tracking-wider"
              >
                {d}
              </span>
            ))}
            <span className="text-xs text-muted-foreground">
              • {dept.courses.length} {lang === "ar" ? "مادة" : "courses"}
            </span>
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} className="text-primary/80" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border/30"
          >
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
              {dept.courses.map((course) => {
                const courseName = lang === "ar" ? course.name_ar : course.name_en;
                const requestLabel =
                  lang === "ar" ? "طلب حصة" : "Request a session";
                const parentSubject = resolveCourseSubject(
                  course.code,
                  {
                    ar: dept.name_ar.replace(/^قسم\s+/, ""),
                    en: dept.name_en.replace(/^Department of\s+/i, ""),
                  },
                  lang
                );
                return (
                  <div
                    key={course.code}
                    className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-card hover:bg-primary/5 dark:hover:bg-primary/10 border border-border/40 hover:border-primary/30 transition-colors"
                  >
                    <span className="font-mono text-[0.7rem] font-bold text-primary bg-primary/10 px-2 py-1 rounded shrink-0 tracking-wide">
                      {course.code}
                    </span>
                    <span className="text-sm text-foreground/90 truncate flex-1 font-medium">
                      {courseName}
                    </span>
                    <span className="text-[0.65rem] text-muted-foreground shrink-0 hidden sm:inline">
                      {course.credits}h
                    </span>
                    <button
                      type="button"
                      title={`${requestLabel} • ${parentSubject}`}
                      aria-label={`${requestLabel}: ${courseName} (${parentSubject})`}
                      onClick={() => onRequest(parentSubject, courseName)}
                      className="shrink-0 inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary text-xs font-bold transition-colors"
                    >
                      <CalendarPlus size={13} />
                      <span className="hidden sm:inline">{requestLabel}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CollegeDetail = () => {
  const { uniId, collegeId } = useParams();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState("");

  const university = useMemo(
    () => allUniversities.find((u) => u.id === uniId),
    [uniId]
  );
  const college: College | undefined = useMemo(
    () => university?.colleges.find((c) => c.id === collegeId),
    [university, collegeId]
  );

  // Booking modal state
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingSubject, setBookingSubject] = useState("");
  const [bookingCourseLabel, setBookingCourseLabel] = useState("");
  const [allTeachers, setAllTeachers] = useState<TeacherData[]>([]);
  const [teachersLoading, setTeachersLoading] = useState(false);
  const [teachersFetched, setTeachersFetched] = useState(false);

  const fetchTeachers = useCallback(async () => {
    if (teachersFetched || teachersLoading) return;
    setTeachersLoading(true);
    const { data: tps } = await supabase
      .from("teacher_profiles")
      .select(
        "user_id, subjects, subjects_en, university, university_en, price, verified"
      );
    if (!tps || tps.length === 0) {
      setAllTeachers([]);
      setTeachersFetched(true);
      setTeachersLoading(false);
      return;
    }
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
        full_name: profile?.full_name || (lang === "ar" ? "المعلم" : "Tutor"),
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
    setAllTeachers(merged);
    setTeachersFetched(true);
    setTeachersLoading(false);
  }, [teachersFetched, teachersLoading, lang]);

  const handleBookingTrigger = useCallback(
    (subject: string, courseLabel: string) => {
      setBookingSubject(subject);
      setBookingCourseLabel(courseLabel);
      setBookingOpen(true);
      fetchTeachers();
    },
    [fetchTeachers]
  );

  const bookingTeachers = useMemo(() => {
    if (!bookingSubject) return [] as TeacherData[];
    const q = bookingSubject.toLowerCase().trim();
    return allTeachers.filter((tc) => {
      const all = [...(tc.subjects || []), ...(tc.subjects_en || [])].map(
        (s) => s.toLowerCase()
      );
      return all.some((s) => s.includes(q) || q.includes(s));
    });
  }, [allTeachers, bookingSubject]);

  // Filter departments by search
  const filteredDepts = useMemo(() => {
    if (!college) return [];
    const q = search.trim().toLowerCase();
    if (!q) return college.departments;
    return college.departments.filter(
      (d) =>
        d.name_ar.includes(search) ||
        d.name_en.toLowerCase().includes(q) ||
        d.courses.some(
          (c) =>
            c.name_ar.includes(search) ||
            c.name_en.toLowerCase().includes(q) ||
            c.code.toLowerCase().includes(q)
        )
    );
  }, [college, search]);

  if (!university || !college) {
    return (
      <div className="min-h-screen container py-20 text-center">
        <p className="text-lg text-muted-foreground mb-4">
          {lang === "ar" ? "الكلية غير موجودة" : "College not found"}
        </p>
        <Link to="/universities" className="text-primary font-bold hover:underline">
          {lang === "ar" ? "← العودة للجامعات" : "← Back to Universities"}
        </Link>
      </div>
    );
  }

  const collegeName = lang === "ar" ? college.name_ar : college.name_en;
  const uniName = lang === "ar" ? university.name_ar : university.name_en;
  const totalCourses = college.departments.reduce(
    (s, d) => s + d.courses.length,
    0
  );

  return (
    <div className="min-h-screen">
      <PageHelmet
        title={`${collegeName} — ${uniName}`}
        description={
          lang === "ar"
            ? `أقسام ومواد ${collegeName} في ${uniName}. اطلب حصة خاصة مع معلم متخصص.`
            : `Departments and courses of ${collegeName} at ${uniName}. Request a private session with a specialized tutor.`
        }
        jsonLd={[
          collectionPageJsonLd({
            name: `${collegeName} — ${uniName}`,
            description:
              lang === "ar"
                ? "أقسام ومواد الكلية"
                : "College departments and courses",
            path: `/universities/${university.id}/colleges/${college.id}`,
            lang,
          }),
          breadcrumbJsonLd([
            { name: lang === "ar" ? "الرئيسية" : "Home", path: "/" },
            { name: lang === "ar" ? "الجامعات" : "Universities", path: "/universities" },
            { name: uniName, path: `/universities` },
            {
              name: collegeName,
              path: `/universities/${university.id}/colleges/${college.id}`,
            },
          ]),
        ]}
      />

      <PageHeader title={collegeName} subtitle={uniName} variant="university">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-4"
        >
          <Building2 size={16} />
          {lang === "ar" ? "كلية" : "College"}
        </motion.div>
      </PageHeader>

      <div className="container py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap">
          <Link to="/" className="hover:text-primary transition-colors">
            {lang === "ar" ? "الرئيسية" : "Home"}
          </Link>
          <ChevronRight size={12} />
          <Link to="/universities" className="hover:text-primary transition-colors">
            {lang === "ar" ? "الجامعات" : "Universities"}
          </Link>
          <ChevronRight size={12} />
          <span className="hover:text-primary transition-colors truncate max-w-[200px]">
            {uniName}
          </span>
          <ChevronRight size={12} />
          <span className="text-foreground font-medium truncate max-w-[200px]">
            {collegeName}
          </span>
        </div>

        {/* Back + search bar */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-primary hover:underline font-medium shrink-0"
          >
            <ChevronLeft size={16} />
            {lang === "ar" ? "العودة" : "Back"}
          </button>
          <div className="relative max-w-xs w-full">
            <Search
              size={14}
              className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                lang === "ar" ? "ابحث في الأقسام والمواد..." : "Search departments & courses..."
              }
              className="ps-9 h-9 text-sm"
            />
          </div>
        </div>

        {/* Header card */}
        <div className="card-base p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 end-0 w-40 h-40 bg-gradient-to-bl from-primary/10 to-transparent ltr:rounded-bl-full rtl:rounded-br-full" />
          <div className="flex items-start gap-5 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center shrink-0 shadow-lg">
              <Building2 size={28} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-black text-2xl md:text-3xl leading-tight">
                {collegeName}
              </h1>
              <Link
                to="/universities"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mt-1 transition-colors"
              >
                <GraduationCap size={13} />
                {uniName}
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {[
              {
                icon: Layers,
                label: lang === "ar" ? "قسم" : "Departments",
                value: college.departments.length,
              },
              {
                icon: BookOpen,
                label: lang === "ar" ? "مادة" : "Courses",
                value: totalCourses,
              },
            ].map((s) => (
              <div
                key={s.label}
                className="text-center p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/10 dark:border-primary/20"
              >
                <s.icon size={16} className="text-primary mx-auto mb-1.5" />
                <p className="font-black text-xl text-primary">{s.value}</p>
                <p className="text-xs text-foreground/70 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Departments */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-black text-lg flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Layers size={16} className="text-primary" />
            </div>
            {lang === "ar" ? "الأقسام والمواد" : "Departments & Courses"}
          </h2>
          <span className="text-xs bg-primary/10 dark:bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/10 dark:border-primary/20">
            {filteredDepts.length} {lang === "ar" ? "قسم" : "depts"}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {filteredDepts.map((dept, i) => (
            <DepartmentBlock
              key={dept.id}
              dept={dept}
              lang={lang}
              index={i}
              onRequest={handleBookingTrigger}
            />
          ))}
        </div>

        {filteredDepts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Search size={40} className="mx-auto mb-3 opacity-40" />
            <p>{lang === "ar" ? "لم يتم العثور على نتائج" : "No results found"}</p>
          </div>
        )}
      </div>

      {/* Booking modal */}
      <BookingFlowModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        subject={bookingSubject}
        courseLabel={bookingCourseLabel}
        teachers={bookingTeachers}
      />

      {bookingOpen && teachersLoading && (
        <div className="fixed bottom-6 inset-x-0 z-[60] flex justify-center pointer-events-none">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/80 text-background text-xs font-medium shadow-lg">
            <Loader2 size={14} className="animate-spin" />
            {lang === "ar" ? "جاري تحميل المعلمين..." : "Loading tutors..."}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeDetail;
