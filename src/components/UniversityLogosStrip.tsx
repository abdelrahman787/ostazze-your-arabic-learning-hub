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

const UniversityCard = ({
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
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
    >
      <Link
        to={to}
        title={name}
        className="group relative flex flex-col items-center justify-center gap-3 h-full min-h-[170px] p-5 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--primary) / 0.08) 0%, hsl(270 70% 55% / 0.08) 100%)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid hsl(var(--primary) / 0.15)",
          boxShadow:
            "inset 0 1px 0 hsl(var(--primary) / 0.15), 0 4px 20px -8px hsl(var(--primary) / 0.15)",
        }}
      >
        {/* Top sheen */}
        <div
          className="absolute inset-x-0 top-0 h-1/2 pointer-events-none opacity-60"
          style={{
            background:
              "linear-gradient(180deg, hsl(0 0% 100% / 0.12) 0%, transparent 100%)",
          }}
        />

        {/* Ambient glow */}
        <div
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 glow-pulse-soft"
          style={{
            animationDelay: `${(index % 6) * -1.2}s`,
            background:
              index % 2 === 0
                ? "radial-gradient(circle, hsl(var(--primary) / 0.5) 0%, transparent 70%)"
                : "radial-gradient(circle, hsl(270 70% 60% / 0.5) 0%, transparent 70%)",
          }}
        />

        {/* Icon */}
        <div
          className="relative z-10 flex items-center justify-center w-14 h-14 rounded-xl transition-transform duration-300 group-hover:scale-110"
          style={{
            background:
              index % 2 === 0
                ? "linear-gradient(135deg, hsl(var(--primary) / 0.18), hsl(var(--primary) / 0.05))"
                : "linear-gradient(135deg, hsl(270 70% 55% / 0.18), hsl(270 70% 55% / 0.05))",
            border:
              index % 2 === 0
                ? "1px solid hsl(var(--primary) / 0.25)"
                : "1px solid hsl(270 70% 55% / 0.25)",
            boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.15)",
          }}
        >
          <Icon
            className="w-7 h-7"
            strokeWidth={1.5}
            style={{
              color:
                index % 2 === 0 ? "hsl(var(--primary))" : "hsl(270 70% 60%)",
            }}
          />
        </div>

        {/* Initials chip */}
        <div
          className="relative z-10 px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider"
          style={{
            background: "hsl(var(--foreground) / 0.06)",
            color: "hsl(var(--foreground) / 0.6)",
          }}
        >
          {initials(name)}
        </div>

        {/* Name */}
        <span className="relative z-10 text-xs md:text-sm font-medium text-foreground/85 text-center line-clamp-2 leading-snug group-hover:text-foreground transition-colors">
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
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight text-foreground">
            {t("home_logos_title")}
          </h3>
          <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
            {t("home_logos_subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {list.map((u, i) => {
            const name = lang === "ar" ? u.name_ar : u.name_en;
            return (
              <UniversityCard
                key={u.id}
                name={name}
                to={`/teachers?university=${encodeURIComponent(name)}`}
                delay={i * 0.04}
                index={i}
              />
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="flex justify-center mt-12">
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
