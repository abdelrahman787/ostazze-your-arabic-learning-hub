import { useState } from "react";
import { Link } from "react-router-dom";
import TeacherCard from "@/components/TeacherCard";
import { mockTeachers } from "@/data/mockData";
import { Search, SlidersHorizontal } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const Teachers = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("");

  const filtered = mockTeachers.filter((tc) =>
    tc.name.includes(search) || tc.subjects.some((s) => s.includes(search)) || tc.title.includes(search)
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "reviews") return b.reviews - a.reviews;
    return 0;
  });

  return (
    <div>
      <section className="py-16 bg-section-alt">
        <div className="container">
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-extrabold mb-2">{t("teachers_title")}</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-muted-foreground">{t("teachers_choose")}</motion.p>
        </div>
      </section>

      <div className="container py-8">
        <div className="card-base p-6 mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("search_placeholder")} className="input-base !pr-10" />
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowFilters(!showFilters)} className="btn-outline !py-2 flex items-center gap-2">
              <motion.div whileHover={{ rotate: 90 }}><SlidersHorizontal size={16} /></motion.div>
              {t("filter_btn")}
            </motion.button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-3 mt-4 animate-fade-in">
              <select className="input-base !w-auto" onChange={(e) => setSortBy(e.target.value)}>
                <option value="">{t("filter_sort")}</option>
                <option value="rating">{t("filter_rating")}</option>
                <option value="price-low">{t("filter_price_low")}</option>
                <option value="price-high">{t("filter_price_high")}</option>
                <option value="reviews">{t("filter_reviews")}</option>
              </select>
            </div>
          )}
        </div>

        <p className="text-muted-foreground text-sm mb-6">{t("showing_results")} {sorted.length} {t("of_results")} {mockTeachers.length} {t("teacher_word")}</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((tc) => <TeacherCard key={tc.id} teacher={tc} />)}
        </div>
      </div>
    </div>
  );
};

export default Teachers;
