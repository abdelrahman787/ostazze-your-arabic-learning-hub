import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Building2, ChevronLeft, Globe, Calendar, BookOpen, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { allUniversities, University, College, Department } from "@/data/universitiesData";

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

const countryFlags: Record<string, string> = {
  KW: "🇰🇼",
  QA: "🇶🇦",
};

const CollegeAccordion = ({ college, lang }: { college: College; lang: "ar" | "en" }) => {
  const [open, setOpen] = useState(false);
  const name = lang === "ar" ? college.name_ar : college.name_en;

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 hover:bg-secondary/50 transition-colors text-start"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Building2 size={14} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{name}</p>
            <p className="text-xs text-muted-foreground">
              {college.departments.length} {lang === "ar" ? "قسم" : "dept."}
            </p>
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-muted-foreground" />
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
            <div className="px-3 pb-3 space-y-1.5">
              {college.departments.map((dept) => (
                <div key={dept.id} className="p-2.5 bg-secondary/60 rounded-lg">
                  <p className="text-sm font-medium">{lang === "ar" ? dept.name_ar : dept.name_en}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {dept.degrees.map((d) => (
                      <span key={d} className="text-[0.65rem] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">
                        {d}
                      </span>
                    ))}
                    <span className="text-[0.65rem] text-muted-foreground">
                      • {dept.courses.length} {lang === "ar" ? "مادة" : "courses"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

type View = "countries" | "universities" | "university";

const Universities = () => {
  const { lang, t } = useLanguage();
  const countries = getCountries();

  const [view, setView] = useState<View>("countries");
  const [selectedCountry, setSelectedCountry] = useState<typeof countries[0] | null>(null);
  const [selectedUni, setSelectedUni] = useState<University | null>(null);

  const goToCountry = (c: typeof countries[0]) => {
    setSelectedCountry(c);
    setView("universities");
  };

  const goToUni = (u: University) => {
    setSelectedUni(u);
    setView("university");
  };

  const goBack = () => {
    if (view === "university") {
      setView("universities");
      setSelectedUni(null);
    } else if (view === "universities") {
      setView("countries");
      setSelectedCountry(null);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-14 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container text-center">
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-extrabold mb-2">
            {t("universities_title")}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-muted-foreground">
            {t("universities_subtitle")}
          </motion.p>
        </div>
      </section>

      <div className="container py-8">
        {/* Breadcrumb / Back */}
        {view !== "countries" && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={goBack}
            className="flex items-center gap-2 text-sm text-primary hover:underline mb-6 font-medium"
          >
            <ChevronLeft size={16} />
            {view === "universities"
              ? lang === "ar" ? "العودة للدول" : "Back to Countries"
              : lang === "ar" ? "العودة للجامعات" : "Back to Universities"}
          </motion.button>
        )}

        <AnimatePresence mode="wait">
          {/* === COUNTRIES VIEW === */}
          {view === "countries" && (
            <motion.div
              key="countries"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto"
            >
              {countries.map((c, i) => (
                <motion.button
                  key={c.code}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => goToCountry(c)}
                  className="card-base p-8 flex flex-col items-center gap-4 hover:border-primary/40 hover:shadow-xl transition-all cursor-pointer group"
                >
                  <span className="text-7xl drop-shadow-lg group-hover:scale-110 transition-transform">
                    {countryFlags[c.code] || "🏳️"}
                  </span>
                  <div className="text-center">
                    <h3 className="font-bold text-xl">{lang === "ar" ? c.name_ar : c.name_en}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {c.universities.length} {lang === "ar" ? "جامعات" : "Universities"}
                    </p>
                  </div>
                </motion.button>
              ))}
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
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">{countryFlags[selectedCountry.code] || "🏳️"}</span>
                <h2 className="text-2xl font-bold">
                  {lang === "ar" ? selectedCountry.name_ar : selectedCountry.name_en}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {selectedCountry.universities.map((u, i) => (
                  <motion.button
                    key={u.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => goToUni(u)}
                    className="card-base p-6 text-start hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                      <GraduationCap size={22} className="text-primary" />
                    </div>
                    <h3 className="font-bold text-base mb-1">{lang === "ar" ? u.name_ar : u.name_en}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1"><Calendar size={11} /> {u.founded}</span>
                      <span className={`font-bold px-2 py-0.5 rounded-full text-[0.65rem] ${
                        u.type === "public" ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-accent/10 text-accent-foreground"
                      }`}>
                        {u.type === "public" ? (lang === "ar" ? "حكومية" : "Public") : (lang === "ar" ? "خاصة" : "Private")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{u.colleges.length} {lang === "ar" ? "كلية" : "Colleges"}</span>
                      <span>•</span>
                      <span>
                        {u.colleges.reduce((s, c) => s + c.departments.length, 0)} {lang === "ar" ? "قسم" : "Depts"}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
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
              {/* Uni header */}
              <div className="card-base p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                    <GraduationCap size={26} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-black text-xl">{lang === "ar" ? selectedUni.name_ar : selectedUni.name_en}</h2>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Globe size={11} /> {lang === "ar" ? selectedUni.country_ar : selectedUni.country_en}</span>
                      <span className="flex items-center gap-1"><Calendar size={11} /> {selectedUni.founded}</span>
                      <span className={`font-bold px-2 py-0.5 rounded-full text-[0.65rem] ${
                        selectedUni.type === "public" ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-accent/10 text-accent-foreground"
                      }`}>
                        {selectedUni.type === "public" ? (lang === "ar" ? "حكومية" : "Public") : (lang === "ar" ? "خاصة" : "Private")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mt-5">
                  {[
                    { label: lang === "ar" ? "كلية" : "Colleges", value: selectedUni.colleges.length },
                    { label: lang === "ar" ? "قسم" : "Depts", value: selectedUni.colleges.reduce((s, c) => s + c.departments.length, 0) },
                    { label: lang === "ar" ? "مادة" : "Courses", value: selectedUni.colleges.reduce((s, c) => s + c.departments.reduce((s2, d) => s2 + d.courses.length, 0), 0) },
                  ].map((s) => (
                    <div key={s.label} className="text-center p-3 bg-secondary/60 rounded-xl">
                      <p className="font-black text-lg text-primary">{s.value}</p>
                      <p className="text-[0.65rem] text-muted-foreground font-medium">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Website */}
                <a href={selectedUni.website} target="_blank" rel="noopener noreferrer"
                  className="mt-4 block text-center text-xs text-primary hover:underline font-medium">
                  {lang === "ar" ? "زيارة موقع الجامعة ←" : "Visit University Website →"}
                </a>
              </div>

              {/* Colleges list */}
              <h3 className="font-bold text-base flex items-center gap-2 mb-4">
                <BookOpen size={16} className="text-primary" />
                {lang === "ar" ? "الكليات والأقسام" : "Colleges & Departments"}
              </h3>
              <div className="space-y-3">
                {selectedUni.colleges.map((college) => (
                  <CollegeAccordion key={college.id} college={college} lang={lang} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Universities;
