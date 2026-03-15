import { useState, useEffect } from "react";
import TeacherCard from "@/components/TeacherCard";
import type { TeacherData } from "@/components/TeacherCard";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBilingual } from "@/hooks/useBilingual";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const Teachers = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      const { data: tps } = await supabase
        .from("teacher_profiles")
        .select("user_id, subjects, subjects_en, university, university_en, price, verified");

      if (!tps || tps.length === 0) { setLoading(false); return; }

      const userIds = tps.map((tp) => tp.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, full_name_en, bio, bio_en, avatar_url")
        .in("user_id", userIds);

      const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));

      const merged: TeacherData[] = tps.map((tp) => {
        const profile = profileMap.get(tp.user_id);
        return {
          user_id: tp.user_id,
          full_name: profile?.full_name || t("the_teacher"),
          full_name_en: profile?.full_name_en || null,
          bio: profile?.bio || null,
          bio_en: profile?.bio_en || null,
          avatar_url: profile?.avatar_url || null,
          subjects: tp.subjects || [],
          subjects_en: (tp as any).subjects_en || [],
          university: tp.university || null,
          university_en: (tp as any).university_en || null,
          price: tp.price || 0,
          verified: tp.verified || false,
        };
      });

      setTeachers(merged);
      setLoading(false);
    };
    fetchTeachers();
  }, []);

  const filtered = teachers.filter((tc) =>
    tc.full_name.includes(search) ||
    tc.subjects.some((s) => s.includes(search)) ||
    (tc.university && tc.university.includes(search))
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
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
                <option value="price-low">{t("filter_price_low")}</option>
                <option value="price-high">{t("filter_price_high")}</option>
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : (
          <>
            <p className="text-muted-foreground text-sm mb-6">{t("showing_results")} {sorted.length} {t("teacher_word")}</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sorted.map((tc, i) => <TeacherCard key={tc.user_id} teacher={tc} index={i} />)}
            </div>
            {sorted.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">{t("no_teachers_registered")}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Teachers;
