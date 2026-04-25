import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, GraduationCap, BookOpen, Landmark, Building2, Library, School, Flame, Atom } from "lucide-react";
import { allUniversities } from "@/data/universitiesData";
import { useLanguage } from "@/contexts/LanguageContext";

const initials = (name: string) =>
  name
    .replace(/^(جامعة|كلية|University of|University|College of|College)\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const ICONS = [GraduationCap, BookOpen, Flame, GraduationCap, Landmark, School, GraduationCap, Building2, School, GraduationCap, Library, Atom];

const UniversityItem = ({
  name,
  to,
  delay,
  index,
}: {
  name: string;
  to: string;
  delay: number;
  index: number;
}) => {
  const Icon = ICONS[index % ICONS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay, duration: 0.35, ease: "easeOut" }}
      className="relative"
    >
      <Link
        to={to}
        title={name}
        className="group relative flex flex-col items-center justify-start gap-2.5 h-full min-h-[150px] px-4 py-5 transition-all duration-300 hover:-translate-y-0.5"
      >
        {/* Icon */}
        <Icon
          className="w-7 h-7 text-primary transition-transform duration-300 group-hover:scale-110"
          strokeWidth={2}
        />

        {/* Initials chip */}
        <div
          className="px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider"
          style={{
            background: "hsl(var(--foreground) / 0.06)",
            color: "hsl(var(--foreground) / 0.55)",
          }}
        >
          {initials(name)}
        </div>

        {/* Name */}
        <span className="text-[11px] md:text-xs font-medium text-foreground/85 text-center line-clamp-2 leading-snug group-hover:text-foreground transition-colors">
          {name}
        </span>
      </Link>
    </motion.div>
  );
};

const UniversityLogosStrip = () => {
  const { t, lang } = useLanguage();
  const list = allUniversities.slice(0, 12);

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      <div className="container max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight text-foreground">
            {t("home_logos_title")}
          </h3>
          <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
            {t("home_logos_subtitle")}
          </p>
        </div>

        {/* Single unified glass container */}
        <div
          className="relative rounded-3xl overflow-hidden p-2 md:p-3"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--primary) / 0.10) 0%, hsl(290 70% 50% / 0.08) 50%, hsl(270 70% 55% / 0.10) 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid hsl(var(--foreground) / 0.08)",
            boxShadow:
              "inset 0 1px 0 hsl(0 0% 100% / 0.08), 0 10px 40px -15px hsl(var(--primary) / 0.15), 0 10px 40px -15px hsl(270 70% 55% / 0.15)",
          }}
        >
          {/* Top inner sheen */}
          <div
            className="absolute inset-x-0 top-0 h-24 pointer-events-none opacity-50 rounded-t-3xl"
            style={{
              background:
                "linear-gradient(180deg, hsl(0 0% 100% / 0.08) 0%, transparent 100%)",
            }}
          />

          {/* Soft inner color glows */}
          <div
            className="absolute -top-20 -left-20 w-[280px] h-[280px] rounded-full blur-[80px] opacity-50 pointer-events-none glow-pulse-soft"
            style={{
              background:
                "radial-gradient(circle, hsl(var(--primary) / 0.35) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute -bottom-20 -right-20 w-[320px] h-[320px] rounded-full blur-[90px] opacity-50 pointer-events-none glow-pulse-soft"
            style={{
              animationDelay: "-3s",
              background:
                "radial-gradient(circle, hsl(270 70% 55% / 0.35) 0%, transparent 70%)",
            }}
          />

          {/* Grid with thin dividers */}
          <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 divide-divider-glass">
            {list.map((u, i) => {
              const name = lang === "ar" ? u.name_ar : u.name_en;
              return (
                <div
                  key={u.id}
                  className="university-cell"
                  style={
                    {
                      "--cell-index": i,
                    } as React.CSSProperties
                  }
                >
                  <UniversityItem
                    name={name}
                    to={`/teachers?university=${encodeURIComponent(name)}`}
                    delay={i * 0.03}
                    index={i}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="flex justify-center mt-10">
          <Link
            to="/universities"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "hsl(var(--primary) / 0.08)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid hsl(var(--primary) / 0.3)",
              boxShadow: "inset 0 1px 0 hsl(var(--primary) / 0.15)",
            }}
          >
            <span>{t("home_logos_cta")}</span>
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UniversityLogosStrip;
