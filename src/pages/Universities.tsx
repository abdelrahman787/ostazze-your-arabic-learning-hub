import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, Building2, ChevronLeft, Globe, Calendar,
  BookOpen, ChevronDown, ExternalLink, Layers, Search, Hash, ChevronRight, CalendarPlus
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import PageHelmet from "@/components/PageHelmet";
import FaqAccordion from "@/components/FaqAccordion";
import { breadcrumbJsonLd, collectionPageJsonLd, faqJsonLd } from "@/lib/seo";
import { useLanguage } from "@/contexts/LanguageContext";
import { allUniversities, University, College } from "@/data/universitiesData";
import { resolveCourseSubject } from "@/lib/courseSubjectMap";
import { Input } from "@/components/ui/input";
import flagKW from "@/assets/flag-kw-wave.gif";
import flagQA from "@/assets/flag-qa-wave.gif";

// Group universities by country
const getCountries = () => {
  const map = new Map<string, { code: string; name_ar: string; name_en: string; universities: University[] }>();
  allUniversities.forEach((u) => {
    if (!map.has(u.country_code)) {
      map.set(u.country_code, { code: u.country_code, name_ar: u.country_ar, name_en: u.country_en, universities: [] });
    }
    map.get(u.country_code)!.universities.push(u);
  });
  return Array.from(map.values());
};

const flagImages: Record<string, string> = { KW: flagKW, QA: flagQA };

const countryColors: Record<string, { from: string; to: string; accent: string }> = {
  KW: { from: "from-green-500/20", to: "to-red-500/10", accent: "text-green-600 dark:text-green-400" },
  QA: { from: "from-red-600/20", to: "to-red-400/10", accent: "text-red-600 dark:text-red-400" },
};

// ===== Animated Flag using real waving GIFs =====
const AnimatedFlag = ({ code, size = 120 }: { code: string; size?: number }) => (
  <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
    <motion.div
      className="absolute inset-0 rounded-full blur-2xl opacity-25"
      style={{ background: code === "KW" ? "radial-gradient(circle, #007A3D 0%, #CE1126 100%)" : "radial-gradient(circle, #8A1538 0%, #FFFFFF 100%)" }}
      animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    <img
      src={flagImages[code]}
      alt={code}
      className="relative z-10 object-contain drop-shadow-xl"
      style={{ width: size, height: size }}
    />
  </div>
);

// ===== Department Item =====
const DepartmentItem = ({ dept, lang, index }: { dept: College["departments"][0]; lang: "ar" | "en"; index: number }) => {
  const [showCourses, setShowCourses] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className="group"
    >
      <button
        onClick={() => setShowCourses(!showCourses)}
        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors text-start"
      >
        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-black">
          {index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight">{lang === "ar" ? dept.name_ar : dept.name_en}</p>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {dept.degrees.map((d) => (
              <span key={d} className="text-[0.55rem] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                {d}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[0.65rem] text-muted-foreground font-medium">
            {dept.courses.length} {lang === "ar" ? "مادة" : "courses"}
          </span>
          <motion.div animate={{ rotate: showCourses ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={14} className="text-primary/80" />
          </motion.div>
        </div>
      </button>
      <AnimatePresence>
        {showCourses && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ms-11 me-3 mb-4 mt-1 flex flex-col gap-2">
              {dept.courses.map((course) => {
                const courseName = lang === "ar" ? course.name_ar : course.name_en;
                const requestLabel = lang === "ar" ? "طلب حصة" : "Request a session";
                // Map course -> parent subject so the teachers filter actually matches
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
                    <Link
                      to={`/teachers?subject=${encodeURIComponent(parentSubject)}`}
                      title={`${requestLabel} • ${parentSubject}`}
                      aria-label={`${requestLabel}: ${courseName} (${parentSubject})`}
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0 inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary text-xs font-bold transition-colors"
                    >
                      <CalendarPlus size={13} />
                      <span className="hidden sm:inline">{requestLabel}</span>
                    </Link>
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

// ===== College Card =====
const CollegeCard = ({ college, lang, index }: { college: College; lang: "ar" | "en"; index: number }) => {
  const [open, setOpen] = useState(false);
  const name = lang === "ar" ? college.name_ar : college.name_en;
  const totalCourses = college.departments.reduce((s, d) => s + d.courses.length, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card-base overflow-hidden"
    >
      {/* College header with colored top bar */}
      <div className="h-1 bg-gradient-to-r from-primary/60 to-primary/20" />
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors text-start"
      >
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary flex items-center justify-center shrink-0 shadow-sm">
            <Building2 size={20} />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-base leading-tight">{name}</p>
            <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Layers size={11} />
                <strong className="text-foreground/70">{college.departments.length}</strong> {lang === "ar" ? "قسم" : "departments"}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen size={11} />
                <strong className="text-foreground/70">{totalCourses}</strong> {lang === "ar" ? "مادة" : "courses"}
              </span>
            </div>
          </div>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/10 dark:border-primary/20 flex items-center justify-center shrink-0"
        >
          <ChevronDown size={16} className="text-primary/80" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-border/30 pt-3">
              <div className="divide-y divide-border/20">
                {college.departments.map((dept, di) => (
                  <DepartmentItem key={dept.id} dept={dept} lang={lang} index={di} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

type View = "countries" | "universities" | "university";

const Universities = () => {
  const { lang, t } = useLanguage();
  const countries = useMemo(() => getCountries(), []);
  const [view, setView] = useState<View>("countries");
  const [selectedCountry, setSelectedCountry] = useState<typeof countries[0] | null>(null);
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const goToCountry = (c: typeof countries[0]) => { setSelectedCountry(c); setView("universities"); setSearchQuery(""); };
  const goToUni = (u: University) => { setSelectedUni(u); setView("university"); setSearchQuery(""); };
  const goBack = () => {
    if (view === "university") { setView("universities"); setSelectedUni(null); }
    else if (view === "universities") { setView("countries"); setSelectedCountry(null); }
    setSearchQuery("");
  };

  const filteredUnis = useMemo(() => {
    if (!selectedCountry || !searchQuery.trim()) return selectedCountry?.universities || [];
    const q = searchQuery.toLowerCase();
    return selectedCountry.universities.filter(u => u.name_ar.includes(searchQuery) || u.name_en.toLowerCase().includes(q));
  }, [selectedCountry, searchQuery]);

  const filteredColleges = useMemo(() => {
    if (!selectedUni || !searchQuery.trim()) return selectedUni?.colleges || [];
    const q = searchQuery.toLowerCase();
    return selectedUni.colleges.filter(c =>
      c.name_ar.includes(searchQuery) || c.name_en.toLowerCase().includes(q) ||
      c.departments.some(d => d.name_ar.includes(searchQuery) || d.name_en.toLowerCase().includes(q))
    );
  }, [selectedUni, searchQuery]);

  const uniFaq = [
    { q: lang === "ar" ? "كيف أجد معلماً من جامعتي؟" : "How do I find a tutor from my university?", a: lang === "ar" ? "اختر دولتك ثم جامعتك ثم تصفّح المواد للوصول إلى المعلمين المتخصصين بها." : "Pick your country, your university, then browse subjects to reach specialized tutors." },
    { q: lang === "ar" ? "هل تغطون كل الجامعات؟" : "Do you cover all universities?", a: lang === "ar" ? "نضيف جامعات وكليات بشكل مستمر بناءً على الطلب — تواصل معنا لاقتراح إضافة جامعتك." : "We continuously add universities and colleges based on demand — contact us to suggest yours." },
    { q: lang === "ar" ? "هل تختلف الأسعار حسب الجامعة؟" : "Do prices vary by university?", a: lang === "ar" ? "السعر يحدده كل معلم بشكل مستقل ويظهر بوضوح في ملفه قبل الحجز." : "Each tutor sets their own rate which is clearly displayed on their profile before booking." },
  ];

  return (
    <div className="min-h-screen">
      <PageHelmet
        title={lang === "ar" ? "الجامعات في الكويت وقطر" : "Universities in Kuwait & Qatar"}
        description={lang === "ar"
          ? "تصفّح جامعات الكويت وقطر وكلياتها وموادها، وابحث عن معلم متخصص في تخصصك."
          : "Browse universities in Kuwait and Qatar with their colleges and subjects, and find tutors specialized in your major."}
        keywords={lang === "ar" ? "جامعات الكويت, جامعات قطر, كليات, معلمون" : "Kuwait universities, Qatar universities, colleges, tutors"}
        jsonLd={[
          collectionPageJsonLd({
            name: lang === "ar" ? "جامعات الكويت وقطر" : "Universities of Kuwait & Qatar",
            description: lang === "ar" ? "دليل الجامعات والكليات والمواد" : "Directory of universities, colleges and subjects",
            path: "/universities",
            lang,
          }),
          breadcrumbJsonLd([
            { name: lang === "ar" ? "الرئيسية" : "Home", path: "/" },
            { name: lang === "ar" ? "الجامعات" : "Universities", path: "/universities" },
          ]),
          faqJsonLd(uniFaq),
        ]}
      />
      {/* Header */}
      <PageHeader title={t("universities_title")} subtitle={t("universities_subtitle")} variant="university">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-4">
          <GraduationCap size={16} />
          {lang === "ar" ? "الدليل الأكاديمي" : "Academic Directory"}
        </motion.div>
      </PageHeader>

      <div className="container py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">{lang === "ar" ? "الرئيسية" : "Home"}</Link>
          <ChevronRight size={12} />
          {view === "countries" && <span className="text-foreground font-medium">{t("universities_title")}</span>}
          {view === "universities" && selectedCountry && (
            <>
              <button onClick={() => { setView("countries"); setSelectedCountry(null); }} className="hover:text-primary transition-colors">{t("universities_title")}</button>
              <ChevronRight size={12} />
              <span className="text-foreground font-medium">{lang === "ar" ? selectedCountry.name_ar : selectedCountry.name_en}</span>
            </>
          )}
          {view === "university" && selectedCountry && selectedUni && (
            <>
              <button onClick={() => { setView("countries"); setSelectedCountry(null); }} className="hover:text-primary transition-colors">{t("universities_title")}</button>
              <ChevronRight size={12} />
              <button onClick={() => { setView("universities"); setSelectedUni(null); }} className="hover:text-primary transition-colors">{lang === "ar" ? selectedCountry.name_ar : selectedCountry.name_en}</button>
              <ChevronRight size={12} />
              <span className="text-foreground font-medium truncate max-w-[200px]">{lang === "ar" ? selectedUni.name_ar : selectedUni.name_en}</span>
            </>
          )}
        </div>

        {view !== "countries" && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between mb-6 gap-4">
            <button onClick={goBack} className="flex items-center gap-2 text-sm text-primary hover:underline font-medium shrink-0">
              <ChevronLeft size={16} />
              {view === "universities"
                ? lang === "ar" ? "العودة للدول" : "Back to Countries"
                : lang === "ar" ? "العودة للجامعات" : "Back to Universities"}
            </button>
            <div className="relative max-w-xs w-full">
              <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === "ar" ? "بحث..." : "Search..."} className="ps-9 h-9 text-sm" />
            </div>
          </motion.div>
        )}

        {/* Search for countries view */}
        {view === "countries" && (
          <div className="max-w-sm mx-auto mb-8">
            <div className="relative">
              <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === "ar" ? "ابحث عن دولة..." : "Search for a country..."} className="ps-9 h-10 text-sm" />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* === COUNTRIES === */}
          {view === "countries" && (
            <motion.div key="countries" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto"
            >
              {countries.map((c, i) => {
                const colors = countryColors[c.code] || { from: "from-primary/20", to: "to-accent/10", accent: "text-primary" };
                const totalDepts = c.universities.reduce((s, u) => s + u.colleges.reduce((s2, col) => s2 + col.departments.length, 0), 0);
                const totalCourses = c.universities.reduce((s, u) => s + u.colleges.reduce((s2, col) => s2 + col.departments.reduce((s3, d) => s3 + d.courses.length, 0), 0), 0);

                return (
                  <motion.button
                    key={c.code}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.15 }}
                    whileHover={{ scale: 1.02, y: -6 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => goToCountry(c)}
                    className="card-base p-8 flex flex-col items-center gap-5 hover:border-primary/40 hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.from} ${colors.to} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    {/* Animated Flag Image */}
                    <div className="relative z-10">
                      <AnimatedFlag code={c.code} size={160} />
                    </div>

                    {/* Static text - no animation */}
                    <div className="text-center relative z-10">
                      <h3 className="font-black text-2xl mb-1">{lang === "ar" ? c.name_ar : c.name_en}</h3>
                      <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-3">
                        <span className="flex items-center gap-1.5">
                          <GraduationCap size={14} className={colors.accent} />
                          <strong>{c.universities.length}</strong> {lang === "ar" ? "جامعة" : "Universities"}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-2">
                        <span>{totalDepts} {lang === "ar" ? "قسم" : "Depts"}</span>
                        <span>•</span>
                        <span>{totalCourses} {lang === "ar" ? "مادة" : "Courses"}</span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {/* === UNIVERSITIES === */}
          {view === "universities" && selectedCountry && (
            <motion.div key="universities" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="flex items-center gap-4 mb-8">
                <img src={flagImages[selectedCountry.code]} alt="" className="w-12 h-12 object-contain" />
                <div>
                  <h2 className="text-2xl font-black">{lang === "ar" ? selectedCountry.name_ar : selectedCountry.name_en}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {selectedCountry.universities.length} {lang === "ar" ? "مؤسسة تعليمية" : "Educational Institutions"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredUnis.map((u, i) => {
                  const totalDepts = u.colleges.reduce((s, c) => s + c.departments.length, 0);
                  const totalCourses = u.colleges.reduce((s, c) => s + c.departments.reduce((s2, d) => s2 + d.courses.length, 0), 0);
                  return (
                    <motion.button key={u.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -6, scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={() => goToUni(u)}
                      className="card-base p-6 text-start hover:border-primary/30 hover:shadow-xl transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <GraduationCap size={22} className="text-primary" />
                        </div>
                        <span className={`text-[0.6rem] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          u.type === "public" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}>
                          {u.type === "public" ? (lang === "ar" ? "حكومية" : "Public") : (lang === "ar" ? "خاصة" : "Private")}
                        </span>
                      </div>
                      <h3 className="font-bold text-base mb-2 leading-tight group-hover:text-primary transition-colors">
                        {lang === "ar" ? u.name_ar : u.name_en}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                        <Calendar size={11} />
                        <span>{lang === "ar" ? `تأسست ${u.founded}` : `Est. ${u.founded}`}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/50">
                        {[
                          { v: u.colleges.length, l: lang === "ar" ? "كلية" : "Colleges" },
                          { v: totalDepts, l: lang === "ar" ? "قسم" : "Depts" },
                          { v: totalCourses, l: lang === "ar" ? "مادة" : "Courses" },
                        ].map(s => (
                          <div key={s.l} className="text-center">
                            <p className="font-black text-sm text-primary">{s.v}</p>
                            <p className="text-[0.6rem] text-muted-foreground">{s.l}</p>
                          </div>
                        ))}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              {filteredUnis.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Search size={40} className="mx-auto mb-3 opacity-40" />
                  <p>{lang === "ar" ? "لم يتم العثور على نتائج" : "No results found"}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* === UNIVERSITY DETAIL === */}
          {view === "university" && selectedUni && (
            <motion.div key="university" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {/* Header Card */}
              <div className="card-base p-6 md:p-8 mb-8 relative overflow-hidden">
                <div className="absolute top-0 end-0 w-40 h-40 bg-gradient-to-bl from-primary/10 to-transparent ltr:rounded-bl-full rtl:rounded-br-full" />
                <div className="flex items-start gap-5 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center shrink-0 shadow-lg">
                    <GraduationCap size={30} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-black text-2xl md:text-3xl leading-tight">{lang === "ar" ? selectedUni.name_ar : selectedUni.name_en}</h2>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <span className="text-sm text-muted-foreground flex items-center gap-1.5"><Globe size={13} /> {lang === "ar" ? selectedUni.country_ar : selectedUni.country_en}</span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1.5"><Calendar size={13} /> {selectedUni.founded}</span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        selectedUni.type === "public" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}>
                        {selectedUni.type === "public" ? (lang === "ar" ? "حكومية" : "Public") : (lang === "ar" ? "خاصة" : "Private")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-6">
                  {[
                    { icon: Building2, label: lang === "ar" ? "كلية" : "Colleges", value: selectedUni.colleges.length },
                    { icon: Layers, label: lang === "ar" ? "قسم" : "Departments", value: selectedUni.colleges.reduce((s, c) => s + c.departments.length, 0) },
                    { icon: BookOpen, label: lang === "ar" ? "مادة" : "Courses", value: selectedUni.colleges.reduce((s, c) => s + c.departments.reduce((s2, d) => s2 + d.courses.length, 0), 0) },
                  ].map((s) => (
                    <div key={s.label} className="text-center p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/10 dark:border-primary/20">
                      <s.icon size={16} className="text-primary mx-auto mb-1.5" />
                      <p className="font-black text-xl text-primary">{s.value}</p>
                      <p className="text-xs text-foreground/70 font-medium">{s.label}</p>
                    </div>
                  ))}
                </div>
                <a href={selectedUni.website} target="_blank" rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium">
                  <ExternalLink size={14} />
                  {lang === "ar" ? "زيارة موقع الجامعة" : "Visit University Website"}
                </a>
              </div>

              {/* Colleges */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-lg flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 size={16} className="text-primary" />
                  </div>
                  {lang === "ar" ? "الكليات والأقسام" : "Colleges & Departments"}
                </h3>
                <span className="text-xs bg-primary/10 dark:bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/10 dark:border-primary/20">
                  {filteredColleges.length} {lang === "ar" ? "كلية" : "colleges"}
                </span>
              </div>

               <div className="columns-1 lg:columns-2 gap-4 space-y-4">
                {filteredColleges.map((college, i) => (
                  <div key={college.id} className="break-inside-avoid">
                    <CollegeCard college={college} lang={lang} index={i} />
                  </div>
                ))}
              </div>

              {filteredColleges.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Search size={40} className="mx-auto mb-3 opacity-40" />
                  <p>{lang === "ar" ? "لم يتم العثور على نتائج" : "No results found"}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* SEO intro + FAQ — visible only on countries view */}
        {view === "countries" && (
          <section className="mt-12 max-w-3xl mx-auto space-y-6">
            <div className="card-base p-6">
              <h2 className="text-xl font-extrabold mb-3">{t("uni_intro_title")}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">{t("uni_intro_p1")}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("uni_intro_p2")}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold">
                  {allUniversities.length} {lang === "ar" ? "جامعة" : "universities"}
                </span>
                <Link to="/subjects" className="px-3 py-1 rounded-full bg-foreground/5 hover:bg-primary/10 hover:text-primary transition-colors font-bold">
                  {t("uni_view_subjects")}
                </Link>
                <Link to="/teachers" className="px-3 py-1 rounded-full bg-foreground/5 hover:bg-primary/10 hover:text-primary transition-colors font-bold">
                  {lang === "ar" ? "تصفّح المعلمين" : "Browse tutors"}
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold mb-3">{t("faq_title")}</h3>
              <FaqAccordion items={uniFaq} defaultOpen={0} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Universities;
