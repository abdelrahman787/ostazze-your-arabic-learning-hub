import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Building2, ChevronDown, Globe, Calendar, BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { University, College } from "@/data/universitiesData";

interface Props {
  university: University;
}

const CollegeAccordion = ({ college, lang }: { college: College; lang: "ar" | "en" }) => {
  const [open, setOpen] = useState(false);
  const name = lang === "ar" ? college.name_ar : college.name_en;
  const totalDepts = college.departments.length;

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
              {totalDepts} {lang === "ar" ? "قسم" : "dept."}
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

const UniversityDetails = ({ university }: Props) => {
  const { lang } = useLanguage();
  const name = lang === "ar" ? university.name_ar : university.name_en;
  const country = lang === "ar" ? university.country_ar : university.country_en;
  const totalColleges = university.colleges.length;
  const totalDepts = university.colleges.reduce((s, c) => s + c.departments.length, 0);
  const totalCourses = university.colleges.reduce(
    (s, c) => s + c.departments.reduce((s2, d) => s2 + d.courses.length, 0),
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-base p-6"
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
          <GraduationCap size={26} className="text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-black text-lg leading-tight">{name}</h3>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Globe size={11} /> {country}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar size={11} /> {university.founded}
            </span>
            <span className={`text-[0.65rem] font-bold px-2 py-0.5 rounded-full ${
              university.type === "public"
                ? "bg-success/10 text-success"
                : "bg-accent/10 text-accent-foreground"
            }`}>
              {university.type === "public"
                ? lang === "ar" ? "حكومية" : "Public"
                : lang === "ar" ? "خاصة" : "Private"}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
          { label: lang === "ar" ? "كلية" : "Colleges", value: totalColleges },
          { label: lang === "ar" ? "قسم" : "Depts", value: totalDepts },
          { label: lang === "ar" ? "مادة" : "Courses", value: totalCourses },
        ].map((s) => (
          <div key={s.label} className="text-center p-3 bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 rounded-xl">
            <p className="font-black text-xl text-primary">{s.value}</p>
            <p className="text-xs text-foreground/70 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Colleges */}
      <div className="space-y-2">
        <h4 className="font-bold text-sm flex items-center gap-2 mb-3">
          <BookOpen size={14} className="text-primary" />
          {lang === "ar" ? "الكليات والأقسام" : "Colleges & Departments"}
        </h4>
        {university.colleges.map((college) => (
          <CollegeAccordion key={college.id} college={college} lang={lang} />
        ))}
      </div>

      {/* Website link */}
      <a
        href={university.website}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block text-center text-xs text-primary hover:underline font-medium"
      >
        {lang === "ar" ? "زيارة موقع الجامعة ←" : "Visit University Website →"}
      </a>
    </motion.div>
  );
};

export default UniversityDetails;
