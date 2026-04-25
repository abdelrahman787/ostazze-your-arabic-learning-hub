import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { allUniversities } from "@/data/universitiesData";
import { useLanguage } from "@/contexts/LanguageContext";

const palette = [
  "from-orange-500/20 to-red-500/10 text-orange-600 dark:text-orange-400",
  "from-blue-500/20 to-cyan-500/10 text-blue-600 dark:text-blue-400",
  "from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400",
  "from-purple-500/20 to-pink-500/10 text-purple-600 dark:text-purple-400",
  "from-amber-500/20 to-yellow-500/10 text-amber-600 dark:text-amber-400",
  "from-rose-500/20 to-red-500/10 text-rose-600 dark:text-rose-400",
];

const initials = (name: string) =>
  name
    .replace(/^(جامعة|University of|University)\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const UniversityLogosStrip = () => {
  const { t, lang } = useLanguage();
  const list = allUniversities.slice(0, 12);

  return (
    <section className="container py-10">
      <h3 className="text-center text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6">
        {t("home_logos_title")}
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {list.map((u, i) => (
          <motion.div
            key={u.id}
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03 }}
          >
            <Link
              to={`/teachers?university=${encodeURIComponent(lang === "ar" ? u.name_ar : u.name_en)}`}
              title={lang === "ar" ? u.name_ar : u.name_en}
              className={`group flex items-center gap-2 rounded-xl bg-gradient-to-br ${palette[i % palette.length]} border border-border/40 px-3 py-2.5 hover:scale-[1.03] transition-transform`}
            >
              <span className="w-8 h-8 rounded-lg bg-background/80 flex items-center justify-center font-extrabold text-xs">
                {initials(lang === "ar" ? u.name_ar : u.name_en)}
              </span>
              <span className="text-[11px] font-bold leading-tight line-clamp-2">
                {lang === "ar" ? u.name_ar : u.name_en}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default UniversityLogosStrip;
