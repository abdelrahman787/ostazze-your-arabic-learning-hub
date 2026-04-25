import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GraduationCap, Sparkles } from "lucide-react";
import { allUniversities } from "@/data/universitiesData";
import { useLanguage } from "@/contexts/LanguageContext";

const palette = [
  {
    bg: "from-orange-500/15 via-orange-500/5 to-transparent",
    ring: "hover:ring-orange-500/40 hover:shadow-orange-500/20",
    badge: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    glow: "bg-orange-500/20",
  },
  {
    bg: "from-blue-500/15 via-blue-500/5 to-transparent",
    ring: "hover:ring-blue-500/40 hover:shadow-blue-500/20",
    badge: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    glow: "bg-blue-500/20",
  },
  {
    bg: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    ring: "hover:ring-emerald-500/40 hover:shadow-emerald-500/20",
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    glow: "bg-emerald-500/20",
  },
  {
    bg: "from-purple-500/15 via-purple-500/5 to-transparent",
    ring: "hover:ring-purple-500/40 hover:shadow-purple-500/20",
    badge: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    glow: "bg-purple-500/20",
  },
  {
    bg: "from-amber-500/15 via-amber-500/5 to-transparent",
    ring: "hover:ring-amber-500/40 hover:shadow-amber-500/20",
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    glow: "bg-amber-500/20",
  },
  {
    bg: "from-rose-500/15 via-rose-500/5 to-transparent",
    ring: "hover:ring-rose-500/40 hover:shadow-rose-500/20",
    badge: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    glow: "bg-rose-500/20",
  },
];

const initials = (name: string) =>
  name
    .replace(/^(جامعة|كلية|University of|University|College of|College)\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const UniversityLogosStrip = () => {
  const { t, lang } = useLanguage();
  const list = allUniversities.slice(0, 12);

  return (
    <section className="container py-16 relative">
      {/* Ambient background glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 blur-3xl rounded-full" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t("home_logos_badge") || "موثوق من الأفضل"}</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-extrabold mb-2 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
          {t("home_logos_title")}
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {t("home_logos_subtitle") || "نخدم طلاب أبرز الجامعات في الكويت وقطر"}
        </p>
      </motion.div>

      {/* Logos grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        {list.map((u, i) => {
          const color = palette[i % palette.length];
          const name = lang === "ar" ? u.name_ar : u.name_en;
          return (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.04, duration: 0.4, ease: "easeOut" }}
              whileHover={{ y: -4 }}
            >
              <Link
                to={`/teachers?university=${encodeURIComponent(name)}`}
                title={name}
                className={`group relative flex items-center gap-3 rounded-2xl bg-gradient-to-br ${color.bg} border border-border/50 backdrop-blur-sm px-3.5 py-3 ring-1 ring-transparent ${color.ring} hover:shadow-lg transition-all duration-300 overflow-hidden h-full`}
              >
                {/* Hover glow */}
                <div className={`absolute -top-8 -right-8 w-20 h-20 ${color.glow} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Badge */}
                <div className={`relative shrink-0 w-10 h-10 rounded-xl ${color.badge} border flex items-center justify-center font-extrabold text-xs shadow-inner`}>
                  <GraduationCap className="absolute inset-0 m-auto w-4 h-4 opacity-20" />
                  <span className="relative">{initials(name)}</span>
                </div>

                {/* Name */}
                <span className="relative text-[11px] md:text-xs font-bold leading-tight line-clamp-2 text-foreground/90 group-hover:text-foreground transition-colors">
                  {name}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Footer link */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="text-center mt-8"
      >
        <Link
          to="/universities"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors group"
        >
          <span>{t("home_logos_cta") || "استعرض كل الجامعات"}</span>
          <span className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">←</span>
        </Link>
      </motion.div>
    </section>
  );
};

export default UniversityLogosStrip;
