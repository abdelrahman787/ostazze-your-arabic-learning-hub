import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, Building2, ChevronLeft, Globe, Calendar,
  BookOpen, ChevronDown, ExternalLink, Users, Layers, Search
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { allUniversities, University, College } from "@/data/universitiesData";
import { Input } from "@/components/ui/input";

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

const countryFlags: Record<string, string> = { KW: "🇰🇼", QA: "🇶🇦" };

const countryColors: Record<string, { from: string; to: string; accent: string }> = {
  KW: { from: "from-green-500/20", to: "to-red-500/10", accent: "text-green-600 dark:text-green-400" },
  QA: { from: "from-red-600/20", to: "to-red-400/10", accent: "text-red-600 dark:text-red-400" },
};

// ===== Department Accordion =====
const DepartmentItem = ({ dept, lang }: { dept: College["departments"][0]; lang: "ar" | "en" }) => {
  const [showCourses, setShowCourses] = useState(false);
  return (
    <div className="border border-border/30 rounded-lg overflow-hidden bg-background/50">
      <button
        onClick={() => setShowCourses(!showCourses)}
        className="w-full flex items-center justify-between p-3 hover:bg-secondary/40 transition-colors text-start"
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{lang === "ar" ? dept.name_ar : dept.name_en}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {dept.degrees.map((d) => (
              <span key={d} className="text-[0.6rem] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                {d}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[0.65rem] text-muted-foreground font-medium bg-secondary/80 px-2 py-0.5 rounded-full">
            {dept.courses.length} {lang === "ar" ? "مادة" : "courses"}
          </span>
          <motion.div animate={{ rotate: showCourses ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={14} className="text-muted-foreground" />
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
            <div className="px-3 pb-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {dept.courses.map((course) => (
                  <div key={course.code} className="flex items-center gap-2 p-2 bg-secondary/40 rounded text-xs">
                    <span className="font-mono text-primary font-bold shrink-0">{course.code}</span>
                    <span className="text-foreground/80 truncate">{course.name_en}</span>
                    <span className="text-muted-foreground shrink-0 ms-auto">{course.credits}cr</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ===== College Accordion =====
const CollegeAccordion = ({ college, lang, index }: { college: College; lang: "ar" | "en"; index: number }) => {
  const [open, setOpen] = useState(false);
  const name = lang === "ar" ? college.name_ar : college.name_en;
  const totalCourses = college.departments.reduce((s, d) => s + d.courses.length, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="border border-border/50 rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors text-start"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary flex items-center justify-center shrink-0">
            <Building2 size={18} />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm leading-tight">{name}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Layers size={10} /> {college.departments.length} {lang === "ar" ? "قسم" : "depts"}</span>
              <span className="flex items-center gap-1"><BookOpen size={10} /> {totalCourses} {lang === "ar" ? "مادة" : "courses"}</span>
            </div>
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} className="text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              {college.departments.map((dept) => (
                <DepartmentItem key={dept.id} dept={dept} lang={lang} />
              ))}
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
    return selectedCountry.universities.filter(
      u => u.name_ar.includes(searchQuery) || u.name_en.toLowerCase().includes(q)
    );
  }, [selectedCountry, searchQuery]);

  const filteredColleges = useMemo(() => {
    if (!selectedUni || !searchQuery.trim()) return selectedUni?.colleges || [];
    const q = searchQuery.toLowerCase();
    return selectedUni.colleges.filter(
      c => c.name_ar.includes(searchQuery) || c.name_en.toLowerCase().includes(q) ||
        c.departments.some(d => d.name_ar.includes(searchQuery) || d.name_en.toLowerCase().includes(q))
    );
  }, [selectedUni, searchQuery]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-16 bg-gradient-to-b from-primary/8 via-primary/3 to-transparent relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 start-10 w-32 h-32 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-10 end-20 w-40 h-40 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="container text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-4">
            <GraduationCap size={16} />
            {lang === "ar" ? "الدليل الأكاديمي" : "Academic Directory"}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-black mb-3">
            {t("universities_title")}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-muted-foreground max-w-lg mx-auto">
            {t("universities_subtitle")}
          </motion.p>
        </div>
      </section>

      <div className="container py-8">
        {/* Breadcrumb */}
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
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === "ar" ? "بحث..." : "Search..."}
                className="ps-9 h-9 text-sm"
              />
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {/* === COUNTRIES VIEW === */}
          {view === "countries" && (
            <motion.div
              key="countries"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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
                    className={`card-base p-8 flex flex-col items-center gap-5 hover:border-primary/40 hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden`}
                  >
                    {/* Background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.from} ${colors.to} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    {/* Flag with wave animation */}
                    <div className="relative z-10">
                      <motion.span
                        className="text-8xl block drop-shadow-xl"
                        animate={{
                          rotateZ: [0, -3, 3, -2, 2, 0],
                          scale: [1, 1.02, 1.02, 1.01, 1.01, 1],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          repeatDelay: 2,
                          ease: "easeInOut",
                        }}
                      >
                        {countryFlags[c.code] || "🏳️"}
                      </motion.span>
                      <motion.div
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-3 bg-foreground/5 rounded-full blur-sm"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
                      />
                    </div>

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

          {/* === UNIVERSITIES VIEW === */}
          {view === "universities" && selectedCountry && (
            <motion.div
              key="universities"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Country header */}
              <div className="flex items-center gap-4 mb-8">
                <motion.span
                  className="text-5xl"
                  animate={{ rotateZ: [0, -2, 2, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 3 }}
                >
                  {countryFlags[selectedCountry.code] || "🏳️"}
                </motion.span>
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
                    <motion.button
                      key={u.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -6, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => goToUni(u)}
                      className="card-base p-6 text-start hover:border-primary/30 hover:shadow-xl transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <GraduationCap size={22} className="text-primary" />
                        </div>
                        <span className={`text-[0.6rem] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          u.type === "public"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
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

          {/* === UNIVERSITY DETAIL VIEW === */}
          {view === "university" && selectedUni && (
            <motion.div
              key="university"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* University Header Card */}
              <div className="card-base p-6 md:p-8 mb-8 relative overflow-hidden">
                <div className="absolute top-0 end-0 w-40 h-40 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
                
                <div className="flex items-start gap-5 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center shrink-0 shadow-lg">
                    <GraduationCap size={30} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-black text-2xl md:text-3xl leading-tight">{lang === "ar" ? selectedUni.name_ar : selectedUni.name_en}</h2>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <Globe size={13} /> {lang === "ar" ? selectedUni.country_ar : selectedUni.country_en}
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <Calendar size={13} /> {selectedUni.founded}
                      </span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        selectedUni.type === "public"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}>
                        {selectedUni.type === "public" ? (lang === "ar" ? "حكومية" : "Public") : (lang === "ar" ? "خاصة" : "Private")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                  {[
                    { icon: Building2, label: lang === "ar" ? "كلية" : "Colleges", value: selectedUni.colleges.length },
                    { icon: Layers, label: lang === "ar" ? "قسم" : "Departments", value: selectedUni.colleges.reduce((s, c) => s + c.departments.length, 0) },
                    { icon: BookOpen, label: lang === "ar" ? "مادة" : "Courses", value: selectedUni.colleges.reduce((s, c) => s + c.departments.reduce((s2, d) => s2 + d.courses.length, 0), 0) },
                  ].map((s) => (
                    <div key={s.label} className="text-center p-4 bg-secondary/50 rounded-xl border border-border/30">
                      <s.icon size={16} className="text-primary mx-auto mb-1" />
                      <p className="font-black text-xl text-primary">{s.value}</p>
                      <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Website */}
                <a href={selectedUni.website} target="_blank" rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium">
                  <ExternalLink size={14} />
                  {lang === "ar" ? "زيارة موقع الجامعة" : "Visit University Website"}
                </a>
              </div>

              {/* Colleges Section */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-black text-lg flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 size={16} className="text-primary" />
                  </div>
                  {lang === "ar" ? "الكليات والأقسام" : "Colleges & Departments"}
                </h3>
                <span className="text-xs text-muted-foreground bg-secondary/60 px-3 py-1 rounded-full">
                  {filteredColleges.length} {lang === "ar" ? "كلية" : "colleges"}
                </span>
              </div>

              <div className="space-y-3">
                {filteredColleges.map((college, i) => (
                  <CollegeAccordion key={college.id} college={college} lang={lang} index={i} />
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
      </div>
    </div>
  );
};

export default Universities;
