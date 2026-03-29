import { mockSubjects, mockCategories } from "@/data/mockData";
import { BookOpen, Users, ArrowUpLeft, Search, Filter, X, ArrowRight, ArrowLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMemo, useState } from "react";
import { allUniversities } from "@/data/universitiesData";

// Map category en name to its ar name for filtering
const categoryEnToAr = new Map<string, string>();
mockCategories.forEach(c => categoryEnToAr.set(c.name.en, c.name.ar));

const Subjects = () => {
  const { t, d, lang } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const [search, setSearch] = useState("");

  // Get category ar name for filtering
  const categoryAr = categoryEnToAr.get(categoryParam) || "";
  const categoryDisplay = categoryParam ? (lang === "ar" ? categoryAr : categoryParam) : "";

  // Filter subjects by category
  const filteredSubjects = useMemo(() => {
    let subjects = mockSubjects;
    if (categoryAr) {
      subjects = subjects.filter(s => s.category === categoryAr);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      subjects = subjects.filter(s =>
        s.name.ar.toLowerCase().includes(q) || s.name.en.toLowerCase().includes(q)
      );
    }
    return subjects;
  }, [categoryAr, search]);

  // Get courses count for this subject from university data
  const getCoursesForSubject = (subjectNameEn: string) => {
    let count = 0;
    allUniversities.forEach(u => {
      u.colleges.forEach(c => {
        c.departments.forEach(dept => {
          if (dept.name_en === subjectNameEn) {
            count += dept.courses.length;
          }
        });
      });
    });
    return count;
  };

  // Get universities that have this department
  const getUniversitiesForSubject = (subjectNameEn: string) => {
    const unis: string[] = [];
    allUniversities.forEach(u => {
      u.colleges.forEach(c => {
        c.departments.forEach(dept => {
          if (dept.name_en === subjectNameEn && !unis.includes(lang === "ar" ? u.name_ar : u.name_en)) {
            unis.push(lang === "ar" ? u.name_ar : u.name_en);
          }
        });
      });
    });
    return unis;
  };

  const clearCategory = () => {
    searchParams.delete("category");
    setSearchParams(searchParams);
  };

  const BackIcon = lang === "ar" ? ArrowRight : ArrowLeft;

  return (
    <div>
      <section className="py-16 bg-section-alt">
        <div className="container text-center">
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-extrabold mb-3">
            {categoryDisplay ? categoryDisplay : t("subjects_title")}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-muted-foreground">
            {categoryDisplay
              ? (lang === "ar" ? `المواد الدراسية في تصنيف ${categoryDisplay}` : `Subjects in ${categoryDisplay}`)
              : t("subjects_subtitle")}
          </motion.p>
        </div>
      </section>

      <div className="container py-10">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          {/* Back to categories + active filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link to="/categories" className="flex items-center gap-1.5 text-sm text-primary hover:underline font-medium">
              <BackIcon size={14} />
              {lang === "ar" ? "كل التصنيفات" : "All Categories"}
            </Link>
            {categoryParam && (
              <button onClick={clearCategory} className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-semibold">
                <Filter size={12} />
                {categoryDisplay}
                <X size={12} />
              </button>
            )}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute top-1/2 -translate-y-1/2 start-3 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "ar" ? "ابحث في المواد..." : "Search subjects..."}
              className="w-full ps-9 pe-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-5">
          {lang === "ar"
            ? `${filteredSubjects.length} قسم أكاديمي`
            : `${filteredSubjects.length} academic departments`}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubjects.map((s, i) => {
            const coursesCount = getCoursesForSubject(s.name.en);
            const universities = getUniversitiesForSubject(s.name.en);
            return (
              <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className={`card-base p-6 hover:border-primary/30 hover:shadow-lg transition-all ${i === 0 && !categoryParam ? "card-active" : ""}`}>
                <div className="flex items-start gap-4">
                  <div className="icon-box-lg bg-primary/10 shrink-0">
                    <BookOpen size={20} className="text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-base mb-1">{d(s.name)}</h3>
                    <div className="flex items-center gap-3 text-muted-foreground text-xs mb-2">
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {s.teacherCount} {t("subjects_teacher_count")}
                      </span>
                      {coursesCount > 0 && (
                        <span className="flex items-center gap-1">
                          <BookOpen size={12} />
                          {coursesCount} {lang === "ar" ? "مادة" : "courses"}
                        </span>
                      )}
                    </div>
                    {universities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {universities.slice(0, 2).map((uni, j) => (
                          <span key={j} className="text-[0.6rem] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">
                            {uni}
                          </span>
                        ))}
                        {universities.length > 2 && (
                          <span className="text-[0.6rem] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">
                            +{universities.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <Link to="/teachers" className="btn-dark flex items-center justify-center gap-2 w-full mt-4 text-sm">
                  {t("subjects_view_teachers")}
                  <ArrowUpLeft size={14} />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {filteredSubjects.length === 0 && (
          <div className="text-center py-16">
            <BookOpen size={40} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium">
              {lang === "ar" ? "لا توجد مواد مطابقة" : "No matching subjects found"}
            </p>
            {categoryParam && (
              <button onClick={clearCategory} className="text-primary text-sm hover:underline mt-2">
                {lang === "ar" ? "عرض كل المواد" : "Show all subjects"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subjects;
