import { mockSubjects, mockCategories } from "@/data/mockData";
import { BookOpen, Users, ArrowUpLeft, Search, Filter, X, ArrowRight, ArrowLeft, ChevronRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMemo, useState } from "react";
import { allUniversities } from "@/data/universitiesData";
import PageHeader from "@/components/PageHeader";
import PageHelmet from "@/components/PageHelmet";
import FaqAccordion from "@/components/FaqAccordion";
import { breadcrumbJsonLd, collectionPageJsonLd, faqJsonLd } from "@/lib/seo";

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
  const departmentParam = searchParams.get("department") || "";
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

  // ---- Department (subject) courses view ----
  const departmentCourses = useMemo(() => {
    if (!departmentParam) return [];
    const seen = new Set<string>();
    const list: { code: string; name_en: string; name_ar: string; credits: number }[] = [];
    allUniversities.forEach(u => {
      u.colleges.forEach(c => {
        c.departments.forEach(dept => {
          if (dept.name_en !== departmentParam) return;
          dept.courses.forEach(course => {
            const key = `${course.code}|${course.name_en}`;
            if (seen.has(key)) return;
            seen.add(key);
            list.push({ code: course.code, name_en: course.name_en, name_ar: course.name_ar, credits: course.credits });
          });
        });
      });
    });
    return list.sort((a, b) => a.code.localeCompare(b.code));
  }, [departmentParam]);

  const departmentAr = useMemo(() => {
    const s = mockSubjects.find(x => x.name.en === departmentParam);
    return s?.name.ar || departmentParam;
  }, [departmentParam]);
  const departmentDisplay = departmentParam ? (lang === "ar" ? departmentAr : departmentParam) : "";

  const filteredCourses = useMemo(() => {
    if (!search.trim()) return departmentCourses;
    const q = search.toLowerCase();
    return departmentCourses.filter(c =>
      c.code.toLowerCase().includes(q) || c.name_en.toLowerCase().includes(q) || c.name_ar.toLowerCase().includes(q)
    );
  }, [departmentCourses, search]);

  const listLength = departmentParam ? filteredCourses.length : filteredSubjects.length;
  const visibleSubjects = filteredSubjects.slice(0, visibleCount);
  const visibleCourses = filteredCourses.slice(0, visibleCount);
  const hasMore = visibleCount < listLength;

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

  const openDepartment = (nameEn: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("department", nameEn);
    setSearchParams(next);
    setSearch("");
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const clearDepartment = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("department");
    setSearchParams(next);
    setSearch("");
    setVisibleCount(ITEMS_PER_PAGE);
  };



  const clearCategory = () => {
    searchParams.delete("category");
    setSearchParams(searchParams);
  };

  const BackIcon = lang === "ar" ? ArrowRight : ArrowLeft;

  const subjFaq = [
    { q: lang === "ar" ? "كيف أحجز معلماً للمادة؟" : "How do I book a tutor for a subject?", a: lang === "ar" ? "اضغط على المادة لعرض المعلمين المتاحين، ثم اختر معلماً وابدأ الحجز من ملفه." : "Click a subject to view available tutors, then pick one and book from their profile." },
    { q: lang === "ar" ? "هل المواد متاحة لكل الجامعات؟" : "Are subjects available across all universities?", a: lang === "ar" ? "تختلف التغطية حسب توافر المعلمين، لكن أغلب المواد الأساسية مدعومة لجامعات الكويت وقطر." : "Coverage depends on tutor availability, but most core subjects are supported across Kuwait & Qatar universities." },
    { q: lang === "ar" ? "هل يمكنني طلب مادة جديدة؟" : "Can I request a new subject?", a: lang === "ar" ? "نعم، تواصل معنا وسنحاول إيجاد معلم متخصص خلال 48 ساعة." : "Yes — contact us and we'll try to source a specialized tutor within 48 hours." },
  ];

  return (
    <div>
      <PageHelmet
        title={categoryDisplay
          ? `${categoryDisplay} - ${lang === "ar" ? "المواد الدراسية - أستاذي OSTAZE" : "Subjects - OSTAZE"}`
          : (lang === "ar" ? "المواد الدراسية - أستاذي OSTAZE" : "Subjects - OSTAZE")}
        description={lang === "ar"
          ? "اختر مادتك الدراسية على منصة أستاذي — رياضيات، فيزياء، برمجة، لغة إنجليزية، هندسة والمزيد. معلمون متخصصون بتقييمات وأسعار واضحة."
          : "Pick your subject on OSTAZE — math, physics, programming, English, engineering and more. Specialized tutors with clear ratings and pricing."}
        canonical="https://ostaze.com/subjects"
        keywords={lang === "ar" ? "مواد دراسية, دروس خصوصية, جامعات الكويت, جامعات قطر" : "subjects, tutoring, Kuwait universities, Qatar universities"}
        jsonLd={[
          collectionPageJsonLd({
            name: categoryDisplay || t("subjects_title"),
            description: t("subjects_intro"),
            path: "/subjects",
            lang,
          }),
          breadcrumbJsonLd([
            { name: lang === "ar" ? "الرئيسية" : "Home", path: "/" },
            { name: t("subjects_title"), path: "/subjects" },
            ...(categoryDisplay ? [{ name: categoryDisplay, path: `/subjects?category=${encodeURIComponent(categoryDisplay)}` }] : []),
          ]),
          faqJsonLd(subjFaq),
        ]}
      />
      <PageHeader
        variant="subjects"
        title={departmentDisplay || categoryDisplay || t("subjects_title")}
        subtitle={departmentDisplay
          ? (lang === "ar" ? `المواد والمقررات في قسم ${departmentDisplay}` : `Courses in ${departmentDisplay}`)
          : categoryDisplay
          ? (lang === "ar" ? `الأقسام الأكاديمية في تصنيف ${categoryDisplay}` : `Departments in ${categoryDisplay}`)
          : t("subjects_subtitle")}
      />

      <div className="container py-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap">
          <Link to="/" className="hover:text-primary transition-colors">{t("breadcrumb_home")}</Link>
          <ChevronRight size={12} />
          <Link to="/categories" className="hover:text-primary transition-colors">{t("nav_categories")}</Link>
          {categoryParam && (
            <>
              <ChevronRight size={12} />
              {departmentParam ? (
                <button onClick={clearDepartment} className="hover:text-primary transition-colors">{categoryDisplay}</button>
              ) : (
                <span className="text-foreground font-medium">{categoryDisplay}</span>
              )}
            </>
          )}
          {!categoryParam && (
            <>
              <ChevronRight size={12} />
              {departmentParam ? (
                <button onClick={clearDepartment} className="hover:text-primary transition-colors">{t("subjects_title")}</button>
              ) : (
                <span className="text-foreground font-medium">{t("subjects_title")}</span>
              )}
            </>
          )}
          {departmentParam && (
            <>
              <ChevronRight size={12} />
              <span className="text-foreground font-medium">{departmentDisplay}</span>
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
              onChange={(e) => { setSearch(e.target.value); setVisibleCount(ITEMS_PER_PAGE); }}
              placeholder={departmentParam
                ? (lang === "ar" ? "ابحث في المقررات..." : "Search courses...")
                : (lang === "ar" ? "ابحث في الأقسام الأكاديمية..." : "Search departments...")}
              className="w-full ps-11 pe-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            {departmentParam ? (
              <button onClick={clearDepartment} className="flex items-center gap-1.5 text-sm text-primary hover:underline font-medium">
                <BackIcon size={14} />
                {lang === "ar" ? "كل الأقسام" : "All Departments"}
              </button>
            ) : (
              <Link to="/categories" className="flex items-center gap-1.5 text-sm text-primary hover:underline font-medium">
                <BackIcon size={14} />
                {lang === "ar" ? "كل التصنيفات" : "All Categories"}
              </Link>
            )}
            {categoryParam && !departmentParam && (
              <button onClick={clearCategory} className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-semibold">
                <Filter size={12} />
                {categoryDisplay}
                <X size={12} />
              </button>
            )}
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            {departmentParam
              ? (lang === "ar" ? `${filteredCourses.length} مقرر` : `${filteredCourses.length} courses`)
              : (lang === "ar" ? `${filteredSubjects.length} قسم أكاديمي` : `${filteredSubjects.length} academic departments`)}
          </p>
        </div>

        {departmentParam ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
            {visibleCourses.map((c, i) => (
              <motion.div key={`${c.code}-${i}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.4) }}>
                <div className="card-base p-5 h-full flex flex-col feature-card">
                  <h2 className="font-bold text-sm leading-snug text-start flex-1">
                    {lang === "ar" ? (c.name_ar || c.name_en) : c.name_en}
                  </h2>
                  <a
                    href={(() => {
                      const courseName = lang === "ar" ? (c.name_ar || c.name_en) : c.name_en;
                      const text = lang === "ar"
                        ? `مرحباً، أرغب في طلب مادة: ${courseName}`
                        : `Hello, I would like to request this course: ${courseName}`;
                      return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
                    })()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-dark flex items-center justify-center gap-2 w-full mt-4 text-xs py-2"
                  >
                    {t("subjects_view_teachers")}
                    <ArrowUpLeft size={13} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-8">
          {visibleSubjects.map((s, i) => {
            const coursesCount = getCoursesForSubject(s.name.en);
            const colorClass = iconColors[i % iconColors.length];
            return (
              <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.5) }}
                className="h-full">
                <button onClick={() => openDepartment(s.name.en)} className="w-full text-start h-full">
                <div className={`card-base p-6 h-full flex flex-col feature-card ${i === 0 && !categoryParam ? "card-active" : ""}`}>
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                      <BookOpen size={20} />
                    </div>
                    <div className="min-w-0 flex-1 text-start">
                      <h2 className="font-bold text-base mb-1 text-start">{d(s.name)}</h2>
                      <div className="flex items-center gap-3 text-muted-foreground text-xs mb-2 justify-start">
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
                    </div>
                  </div>
                  <span className="btn-dark flex items-center justify-center gap-2 w-full mt-4 text-sm">
                    {lang === "ar" ? "عرض المقررات" : "View Courses"}
                    <ArrowUpLeft size={14} />
                  </span>
                </div>
                </button>
              </motion.div>
            );
          })}
        </div>
        )}


        {/* Load More */}
        {hasMore && (
          <div className="text-center py-6">
            <button onClick={() => setVisibleCount(c => c + ITEMS_PER_PAGE)} className="btn-outline px-8">
              {lang === "ar" ? `عرض المزيد (${listLength - visibleCount} متبقي)` : `Show More (${listLength - visibleCount} remaining)`}
            </button>
          </div>
        )}

        {listLength === 0 && (
          <div className="text-center py-16">
            <BookOpen size={40} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium">
              {departmentParam
                ? (lang === "ar" ? "لا توجد مقررات مطابقة" : "No matching courses found")
                : (lang === "ar" ? "لا توجد أقسام مطابقة" : "No matching departments found")}
            </p>
            {departmentParam ? (
              <button onClick={clearDepartment} className="text-primary text-sm hover:underline mt-2">
                {lang === "ar" ? "عرض كل الأقسام" : "Show all departments"}
              </button>
            ) : categoryParam ? (
              <button onClick={clearCategory} className="text-primary text-sm hover:underline mt-2">
                {lang === "ar" ? "عرض كل المواد" : "Show all subjects"}
              </button>
            ) : null}
          </div>

        )}

        <section className="mt-14 max-w-3xl mx-auto space-y-6">
          <p className="text-sm text-muted-foreground leading-relaxed text-center">{t("subjects_intro")}</p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <Link to="/categories" className="px-3 py-1 rounded-full bg-foreground/5 hover:bg-primary/10 hover:text-primary font-bold transition-colors">{lang === "ar" ? "التصنيفات" : "Categories"}</Link>
            <Link to="/universities" className="px-3 py-1 rounded-full bg-foreground/5 hover:bg-primary/10 hover:text-primary font-bold transition-colors">{lang === "ar" ? "الجامعات" : "Universities"}</Link>
            <Link to="/teachers" className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors">{lang === "ar" ? "المعلمون" : "Tutors"}</Link>
          </div>
          <div>
            <h3 className="text-lg font-extrabold mb-3 text-center">{t("faq_title")}</h3>
            <FaqAccordion items={subjFaq} defaultOpen={0} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Subjects;
