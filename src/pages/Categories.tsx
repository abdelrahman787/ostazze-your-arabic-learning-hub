import { mockCategories } from "@/data/mockData";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import {
  Cog, Stethoscope, Monitor, BarChart3, Globe2,
  FlaskConical, Scale, BookOpen, GraduationCap, Heart, Pill,
  Palette, Wrench, BookText, TrendingUp, Search
} from "lucide-react";
import { Link } from "react-router-dom";
import { allUniversities } from "@/data/universitiesData";
import { useState, useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import PageHelmet from "@/components/PageHelmet";
import FaqAccordion from "@/components/FaqAccordion";
import { breadcrumbJsonLd, collectionPageJsonLd, faqJsonLd } from "@/lib/seo";

const categoryIcons: Record<string, React.ElementType> = {
  "الهندسة والبترول": Cog, "Engineering & Petroleum": Cog,
  "الطب": Stethoscope, "Medicine": Stethoscope,
  "الحوسبة وتقنية المعلومات": Monitor, "Computing & IT": Monitor,
  "العلوم": FlaskConical, "Sciences": FlaskConical,
  "إدارة الأعمال": BarChart3, "Business Administration": BarChart3,
  "الآداب والعلوم الإنسانية": Globe2, "Arts & Humanities": Globe2,
  "الحقوق والقانون": Scale, "Law": Scale,
  "التربية": GraduationCap, "Education": GraduationCap,
  "الصيدلة": Pill, "Pharmacy": Pill,
  "التمريض": Heart, "Nursing": Heart,
  "الشريعة والدراسات الإسلامية": BookText, "Sharia & Islamic Studies": BookText,
  "العلوم الطبية المساندة": Stethoscope, "Allied Health Sciences": Stethoscope,
  "الفنون والتصميم": Palette, "Fine Arts & Design": Palette,
  "العلوم الصحية": Heart, "Health Sciences": Heart,
  "التكنولوجيا": Wrench, "Technology": Wrench,
};

const Categories = () => {
  const { t, d, lang } = useLanguage();
  const [search, setSearch] = useState("");

  const stats = useMemo(() => {
    const totalCourses = allUniversities.reduce((s, u) => s + u.colleges.reduce((s2, c) => s2 + c.departments.reduce((s3, dd) => s3 + dd.courses.length, 0), 0), 0);
    const totalDepts = allUniversities.reduce((s, u) => s + u.colleges.reduce((s2, c) => s2 + c.departments.length, 0), 0);
    return { categories: mockCategories.length, totalDepts, totalCourses };
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return mockCategories;
    const q = search.toLowerCase();
    return mockCategories.filter(c =>
      c.name.ar.toLowerCase().includes(q) || c.name.en.toLowerCase().includes(q)
    );
  }, [search]);

  const catFaq = [
    { q: lang === "ar" ? "كيف أختار التصنيف الأنسب؟" : "How do I pick the right category?", a: lang === "ar" ? "اختر التصنيف الأقرب لتخصصك ثم تابع للمواد، وستظهر لك قائمة المعلمين المتخصصين." : "Pick the category closest to your major, then drill down to subjects to see specialized tutors." },
    { q: lang === "ar" ? "ماذا لو لم أجد تصنيفي؟" : "What if my category isn't listed?", a: lang === "ar" ? "تواصل معنا وسنضيف التصنيف خلال 48 ساعة عمل إن وُجد طلب كافٍ." : "Contact us and we'll add it within 48 business hours if there's enough demand." },
    { q: lang === "ar" ? "هل التصنيفات مرتبطة بجامعة معينة؟" : "Are categories tied to a university?", a: lang === "ar" ? "لا، التصنيفات عامة لكنها ترتبط داخلياً بكليات وأقسام جامعات الكويت وقطر." : "No, categories are general but mapped internally to colleges and departments in Kuwait & Qatar universities." },
  ];

  return (
    <div>
      <PageHelmet
        title={lang === "ar"
          ? "أقسام المواد - أستاذي OSTAZE"
          : "Subject Categories - OSTAZE"}
        description={lang === "ar"
          ? "تصفح أقسام المواد الدراسية المتاحة على منصة أستاذي — قسم الهندسة، الحاسب، اللغات والمزيد."
          : "Browse subject categories on OSTAZE — engineering, computing, languages and more."}
        canonical="https://ostaze.com/categories"
        keywords={lang === "ar" ? "تصنيفات, مواد, جامعات الكويت, جامعات قطر" : "categories, subjects, Kuwait, Qatar universities"}
        jsonLd={[
          collectionPageJsonLd({
            name: t("categories_title"),
            description: t("categories_intro"),
            path: "/categories",
            lang,
          }),
          breadcrumbJsonLd([
            { name: lang === "ar" ? "الرئيسية" : "Home", path: "/" },
            { name: t("categories_title"), path: "/categories" },
          ]),
          faqJsonLd(catFaq),
        ]}
      />
      <PageHeader title={t("categories_title")} subtitle={t("categories_subtitle")} variant="categories" />

      <div className="container py-10">
        {/* Search + stats in one calm row */}
        <div className="max-w-3xl mx-auto mb-10 space-y-5">
          <div className="relative">
            <Search size={18} className="absolute top-1/2 -translate-y-1/2 start-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "ar" ? "ابحث عن تصنيف..." : "Search a category..."}
              className="w-full ps-12 pe-4 py-3.5 rounded-2xl border border-border bg-background text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex items-center justify-center gap-2.5 flex-wrap text-xs">
            {[
              { icon: BookOpen, value: stats.categories, label: lang === "ar" ? "تصنيف" : "categories" },
              { icon: GraduationCap, value: stats.totalDepts, label: lang === "ar" ? "قسم" : "departments" },
              { icon: TrendingUp, value: stats.totalCourses, label: lang === "ar" ? "مادة" : "courses" },
            ].map((s, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 text-muted-foreground">
                <s.icon size={13} className="text-primary" />
                <b className="text-foreground font-extrabold">{s.value}</b> {s.label}
              </span>
            ))}
          </div>
        </div>

        {/* Category list — wide, scannable rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c, i) => {
            const name = d(c.name);
            const Icon = categoryIcons[name] || categoryIcons[c.name.ar] || BookOpen;
            return (
              <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.3) }}>
                <Link
                  to={`/subjects?category=${encodeURIComponent(c.name.en)}`}
                  className="group card-base p-5 flex items-center gap-4 text-start hover:border-primary/40 hover:shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-[0.95rem] leading-snug truncate group-hover:text-primary transition-colors">{name}</h2>
                    <p className="text-muted-foreground text-xs mt-0.5">{d(c.count)}</p>
                  </div>
                  <ChevronLeft size={18} className="text-muted-foreground/50 shrink-0 rtl:rotate-0 ltr:rotate-180 group-hover:text-primary transition-colors" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Search size={38} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground font-medium">
              {lang === "ar" ? "لا توجد تصنيفات مطابقة" : "No matching categories"}
            </p>
            <button onClick={() => setSearch("")} className="text-primary text-sm hover:underline mt-2">
              {lang === "ar" ? "عرض كل التصنيفات" : "Show all categories"}
            </button>
          </div>
        )}


        <section className="mt-14 max-w-3xl mx-auto space-y-6">
          <p className="text-sm text-muted-foreground leading-relaxed text-center">{t("categories_intro")}</p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <Link to="/subjects" className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors">{lang === "ar" ? "كل المواد" : "All subjects"}</Link>
            <Link to="/universities" className="px-3 py-1 rounded-full bg-foreground/5 hover:bg-primary/10 hover:text-primary font-bold transition-colors">{lang === "ar" ? "الجامعات" : "Universities"}</Link>
            <Link to="/teachers" className="px-3 py-1 rounded-full bg-foreground/5 hover:bg-primary/10 hover:text-primary font-bold transition-colors">{lang === "ar" ? "المعلمون" : "Tutors"}</Link>
          </div>
          <div>
            <h3 className="text-lg font-extrabold mb-3 text-center">{t("faq_title")}</h3>
            <FaqAccordion items={catFaq} defaultOpen={0} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Categories;
