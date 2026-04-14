import { mockSubjects, mockCategories } from "@/data/mockData";
import { BookOpen, Users, ArrowUpLeft, Search, Filter, X, ArrowRight, ArrowLeft, ChevronRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMemo, useState } from "react";
import { allUniversities } from "@/data/universitiesData";
import PageHeader from "@/components/PageHeader";
import PageHelmet from "@/components/PageHelmet";

const categoryEnToAr = new Map<string, string>();
mockCategories.forEach(c => categoryEnToAr.set(c.name.en, c.name.ar));

const ITEMS_PER_PAGE = 18;

// Color palette for category icons
const iconColors = [
  "text-primary bg-primary/15",
  "text-emerald-600 bg-emerald-500/15",
  "text-blue-600 bg-blue-500/15",
  "text-amber-600 bg-amber-500/15",
  "text-rose-600 bg-rose-500/15",
  "text-violet-600 bg-violet-500/15",
  "text-cyan-600 bg-cyan-500/15",
  "text-fuchsia-600 bg-fuchsia-500/15",
];

const Subjects = () => {
  const { t, d, lang } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const categoryAr = categoryEnToAr.get(categoryParam) || "";
  const categoryDisplay = categoryParam ? (lang === "ar" ? categoryAr : categoryParam) : "";

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

  const visibleSubjects = filteredSubjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredSubjects.length;

  const getCoursesForSubject = (subjectNameEn: string) => {
    let count = 0;
    allUniversities.forEach(u => {
      u.colleges.forEach(c => {
        c.departments.forEach(dept => {
          if (dept.name_en === subjectNameEn) count += dept.courses.length;
        });
      });
    });
    return count;
  };

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
      <PageHelmet title={categoryDisplay || t("subjects_title")} description={t("subjects_subtitle")} />
      <PageHeader
        variant="subjects"
        title={categoryDisplay || t("subjects_title")}
        subtitle={categoryDisplay
          ? (lang === "ar" ? `المواد الدراسية في تصنيف ${categoryDisplay}` : `Subjects in ${categoryDisplay}`)
          : t("subjects_subtitle")}
      />

      <div className="container py-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">{t("breadcrumb_home")}</Link>
          <ChevronRight size={12} />
          <Link to="/categories" className="hover:text-primary transition-colors">{t("nav_categories")}</Link>
          {categoryParam && (
            <>
              <ChevronRight size={12} />
              <span className="text-foreground font-medium">{categoryDisplay}</span>
            </>
          )}
          {!categoryParam && (
            <>
              <ChevronRight size={12} />
              <span className="text-foreground font-medium">{t("subjects_title")}</span>
            </>
          )}
        </div>

        {/* Search - centered & bigger */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search size={18} className="absolute top-1/2 -translate-y-1/2 start-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "ar" ? "ابحث في المواد الدراسية..." : "Search subjects..."}
              className="w-full ps-11 pe-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
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
          <p className="text-sm text-muted-foreground font-medium">
            {lang === "ar"
              ? `${filteredSubjects.length} قسم أكاديمي`
              : `${filteredSubjects.length} academic departments`}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-8">
          {visibleSubjects.map((s, i) => {
            const coursesCount = getCoursesForSubject(s.name.en);
            const universities = getUniversitiesForSubject(s.name.en);
            const colorClass = iconColors[i % iconColors.length];
            return (
              <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.5) }}
                className="h-full">
                <div className={`card-base p-6 hover:border-primary/30 hover:shadow-lg transition-all h-full flex flex-col feature-card ${i === 0 && !categoryParam ? "card-active" : ""}`}>
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                      <BookOpen size={20} />
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
                        <div className="flex flex-wrap gap-1">
                          {universities.slice(0, 2).map((uni, j) => (
                            <span key={j} className="text-[0.6rem] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                              {uni}
                            </span>
                          ))}
                          {universities.length > 2 && (
                            <span className="text-[0.6rem] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
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
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="text-center py-6">
            <button onClick={() => setVisibleCount(c => c + ITEMS_PER_PAGE)} className="btn-outline px-8">
              {lang === "ar" ? `عرض المزيد (${filteredSubjects.length - visibleCount} متبقي)` : `Show More (${filteredSubjects.length - visibleCount} remaining)`}
            </button>
          </div>
        )}

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
