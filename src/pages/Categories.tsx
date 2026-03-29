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

  return (
    <div>
      <PageHeader title={t("categories_title")} subtitle={t("categories_subtitle")} variant="categories" />

      {/* Stats Bar */}
      <div className="bg-primary/5 border-b border-border/50">
        <div className="container py-4">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {[
              { icon: BookOpen, value: stats.categories, label: lang === "ar" ? "تصنيف دراسي" : "Categories" },
              { icon: GraduationCap, value: stats.totalDepts, label: lang === "ar" ? "قسم أكاديمي" : "Departments" },
              { icon: TrendingUp, value: stats.totalCourses, label: lang === "ar" ? "مادة دراسية" : "Courses" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <s.icon size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-black text-lg text-primary leading-none">{s.value}</p>
                  <p className="text-[0.7rem] text-muted-foreground">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-10">
        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search size={16} className="absolute top-1/2 -translate-y-1/2 start-3 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "ar" ? "ابحث في التصنيفات..." : "Search categories..."}
              className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((c, i) => {
            const name = d(c.name);
            const Icon = categoryIcons[name] || categoryIcons[c.name.ar] || BookOpen;
            return (
              <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/subjects?category=${encodeURIComponent(c.name.en)}`} className={`card-base p-8 text-center hover:border-primary/30 hover:shadow-lg cursor-pointer block ${i === 0 ? "card-active" : ""}`}>
                  <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}
                    className="icon-box-lg bg-primary/10 text-primary mx-auto mb-4">
                    <Icon size={24} />
                  </motion.div>
                  <h3 className={`font-bold text-lg mb-1 ${i === 0 ? "text-primary" : ""}`}>{name}</h3>
                  <p className="text-muted-foreground text-sm">{d(c.count)}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {lang === "ar" ? "لا توجد تصنيفات مطابقة" : "No matching categories"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
