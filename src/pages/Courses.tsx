import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Clock, PlayCircle, Radio, Layers, BookMarked, Filter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBilingual } from "@/hooks/useBilingual";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/PageHeader";
import PageHelmet from "@/components/PageHelmet";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseCard {
  id: string;
  title: string;
  title_en: string | null;
  short_description: string | null;
  short_description_en: string | null;
  price: number;
  course_type: "recorded" | "live" | "hybrid";
  cover_image_url: string | null;
  total_hours: number;
  category: string | null;
  category_en: string | null;
  instructor_name: string | null;
  instructor_name_en: string | null;
  level: string | null;
  enrollment_count: number;
}

const typeConfig = {
  recorded: { icon: PlayCircle, ar: "مسجّل", en: "Recorded", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  live: { icon: Radio, ar: "لايف", en: "Live", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  hybrid: { icon: Layers, ar: "مختلط", en: "Hybrid", color: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
} as const;

const CourseCardSkeleton = () => (
  <div className="card-base overflow-hidden flex flex-col">
    <Skeleton className="aspect-video w-full bg-muted-foreground/15" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-5 w-3/4 bg-muted-foreground/15" />
      <Skeleton className="h-4 w-full bg-muted-foreground/15" />
      <Skeleton className="h-4 w-2/3 bg-muted-foreground/15" />
      <Skeleton className="h-10 w-full rounded-xl mt-2 bg-muted-foreground/15" />
    </div>
  </div>
);

const Courses = () => {
  const { t, lang } = useLanguage();
  const { b } = useBilingual();
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "recorded" | "live" | "hybrid">("all");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("courses")
        .select("id, title, title_en, short_description, short_description_en, price, course_type, cover_image_url, total_hours, category, category_en, instructor_name, instructor_name_en, level, enrollment_count")
        .eq("is_published", true)
        .order("enrollment_count", { ascending: false });
      setCourses((data as CourseCard[]) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach(c => {
      const cat = b(c.category, c.category_en);
      if (cat) set.add(cat);
    });
    return Array.from(set);
  }, [courses, b]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return courses.filter(c => {
      if (filterType !== "all" && c.course_type !== filterType) return false;
      if (filterCategory && b(c.category, c.category_en) !== filterCategory) return false;
      if (q) {
        const title = b(c.title, c.title_en).toLowerCase();
        const desc = (b(c.short_description, c.short_description_en) || "").toLowerCase();
        const inst = (b(c.instructor_name, c.instructor_name_en) || "").toLowerCase();
        if (!title.includes(q) && !desc.includes(q) && !inst.includes(q)) return false;
      }
      return true;
    });
  }, [courses, search, filterType, filterCategory, b]);

  const tabs: Array<{ key: typeof filterType; label: string; icon?: typeof PlayCircle }> = [
    { key: "all", label: lang === "ar" ? "الكل" : "All", icon: BookMarked },
    { key: "recorded", label: lang === "ar" ? "مسجّلة" : "Recorded", icon: PlayCircle },
    { key: "live", label: lang === "ar" ? "لايف" : "Live", icon: Radio },
    { key: "hybrid", label: lang === "ar" ? "مختلط" : "Hybrid", icon: Layers },
  ];

  return (
    <div>
      <PageHelmet
        title={lang === "ar" ? "كورساتنا التعليمية" : "Our Courses"}
        description={lang === "ar" ? "تصفح كورسات OSTAZE التعليمية المسجلة واللايف في مختلف التخصصات" : "Browse OSTAZE recorded and live courses across various subjects"}
      />
      <PageHeader
        title={lang === "ar" ? "الكورسات" : "Courses"}
        subtitle={lang === "ar" ? "كورسات احترافية مسجلة ولايف بإشراف نخبة من المتخصصين" : "Professional recorded and live courses by top instructors"}
        variant="subjects"
      />

      <div className="container py-8">
        {/* Search + Filters */}
        <div className="card-base p-5 mb-6">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="flex-1 relative">
              <Search size={18} className="absolute top-1/2 -translate-y-1/2 start-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={lang === "ar" ? "ابحث عن كورس، تصنيف، أو مدرّس..." : "Search by course, category, or instructor..."}
                className="input-base !ps-11"
              />
            </div>
            {categories.length > 0 && (
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="input-base !w-auto"
              >
                <option value="">{lang === "ar" ? "كل التصنيفات" : "All categories"}</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {tabs.map((tab) => {
              const active = filterType === tab.key;
              const Icon = tab.icon!;
              return (
                <button
                  key={tab.key}
                  onClick={() => setFilterType(tab.key)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-[0_4px_14px_hsl(14_91%_50%/0.3)]"
                      : "bg-secondary text-foreground/70 hover:bg-secondary/70"
                  }`}
                >
                  <Icon size={15} /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <CourseCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-5">
              <BookMarked size={36} className="text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-extrabold mb-2">
              {lang === "ar" ? "لا توجد كورسات حالياً" : "No courses available"}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {lang === "ar" ? "جرّب تغيير معايير البحث أو ارجع لاحقاً" : "Try changing your search filters or come back later"}
            </p>
          </motion.div>
        ) : (
          <>
            <p className="text-muted-foreground text-sm mb-5 font-medium">
              {filtered.length} {lang === "ar" ? "كورس" : "courses"}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((c, i) => {
                const cfg = typeConfig[c.course_type];
                const TypeIcon = cfg.icon;
                const title = b(c.title, c.title_en);
                const desc = b(c.short_description, c.short_description_en);
                const inst = b(c.instructor_name, c.instructor_name_en);
                const cat = b(c.category, c.category_en);
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                    className="card-base overflow-hidden flex flex-col group hover:shadow-[0_12px_30px_-12px_hsl(14_91%_50%/0.35)] transition-all"
                  >
                    <Link to={`/courses/${c.id}`} className="block relative aspect-video overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                      {c.cover_image_url ? (
                        <img
                          src={c.cover_image_url}
                          alt={title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/40">
                          <BookMarked size={48} />
                        </div>
                      )}
                      <div className={`absolute top-3 start-3 px-2.5 py-1 rounded-full text-[0.7rem] font-bold flex items-center gap-1.5 backdrop-blur-md ${cfg.color}`}>
                        <TypeIcon size={12} /> {lang === "ar" ? cfg.ar : cfg.en}
                      </div>
                    </Link>

                    <div className="p-5 flex flex-col flex-1">
                      {cat && (
                        <span className="text-[0.7rem] font-bold text-primary uppercase tracking-wide mb-1.5">{cat}</span>
                      )}
                      <Link to={`/courses/${c.id}`} className="block">
                        <h3 className="font-bold text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {title}
                        </h3>
                      </Link>
                      {desc && (
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-3">{desc}</p>
                      )}
                      {inst && (
                        <p className="text-xs text-foreground/60 mb-3">
                          {lang === "ar" ? "بإشراف " : "By "}<span className="font-semibold text-foreground/80">{inst}</span>
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                        {c.total_hours > 0 && (
                          <span className="flex items-center gap-1"><Clock size={13} /> {c.total_hours} {lang === "ar" ? "س" : "h"}</span>
                        )}
                        {c.enrollment_count > 0 && (
                          <span>{c.enrollment_count} {lang === "ar" ? "مشترك" : "enrolled"}</span>
                        )}
                      </div>
                      <div className="mt-auto flex items-center justify-between gap-3">
                        <div>
                          <div className="text-2xl font-black text-primary">
                            {c.price === 0 ? (lang === "ar" ? "مجاني" : "Free") : c.price}
                          </div>
                          {c.price > 0 && (
                            <div className="text-[0.65rem] text-muted-foreground -mt-1">{lang === "ar" ? "ر.س" : "SAR"}</div>
                          )}
                        </div>
                        <Link to={`/courses/${c.id}`} className="btn-primary !py-2.5 text-sm">
                          {lang === "ar" ? "عرض التفاصيل" : "View Details"}
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Courses;
