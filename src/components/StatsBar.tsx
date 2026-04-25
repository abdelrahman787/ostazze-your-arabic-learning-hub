import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Calendar, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { allUniversities } from "@/data/universitiesData";

const StatsBar = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ tutors: 0, subjects: 0, sessions: 0 });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [tutors, sessions, tProfiles] = await Promise.all([
          supabase.from("teacher_profiles").select("id", { count: "exact", head: true }),
          supabase.from("session_requests").select("id", { count: "exact", head: true }).eq("status", "completed"),
          supabase.from("teacher_profiles").select("subjects"),
        ]);
        if (!mounted) return;
        const uniqueSubjects = new Set<string>();
        (tProfiles.data || []).forEach((row: any) => {
          (row?.subjects || []).forEach((s: string) => s && uniqueSubjects.add(s.trim()));
        });
        setStats({
          tutors: tutors.count ?? 0,
          subjects: uniqueSubjects.size,
          sessions: sessions.count ?? 0,
        });
      } catch {
        /* silent */
      }
    })();
    return () => { mounted = false; };
  }, []);

  const items = [
    { icon: GraduationCap, value: stats.tutors, label: t("stats_tutors") },
    { icon: BookOpen, value: stats.subjects, label: t("stats_subjects_held") },
    { icon: Calendar, value: stats.sessions, label: t("stats_sessions_held") },
    { icon: Building2, value: allUniversities.length, label: t("stats_universities") },
  ];

  return (
    <section className="container py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((it, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="card-base p-5 text-center"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
              <it.icon size={20} />
            </div>
            <div className="text-2xl font-extrabold text-foreground">{it.value.toLocaleString()}+</div>
            <div className="text-xs text-muted-foreground mt-1">{it.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StatsBar;
