import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GraduationCap, ShieldCheck, ArrowLeft } from "lucide-react";
import { allUniversities } from "@/data/universitiesData";
import { useLanguage } from "@/contexts/LanguageContext";

const accents = [
  { dot: "bg-orange-400", text: "text-orange-300", glow: "shadow-orange-500/10" },
  { dot: "bg-sky-400", text: "text-sky-300", glow: "shadow-sky-500/10" },
  { dot: "bg-emerald-400", text: "text-emerald-300", glow: "shadow-emerald-500/10" },
  { dot: "bg-violet-400", text: "text-violet-300", glow: "shadow-violet-500/10" },
  { dot: "bg-amber-400", text: "text-amber-300", glow: "shadow-amber-500/10" },
  { dot: "bg-rose-400", text: "text-rose-300", glow: "shadow-rose-500/10" },
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
    <section className="relative py-16 md:py-20 overflow-hidden">
      {/* Editorial backdrop */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-primary/[0.06] blur-3xl rounded-full" />
      </div>

      <div className="container max-w-6xl">
        {/* Editorial header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-10 bg-border" />
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase text-primary">
              <ShieldCheck className="w-3 h-3" />
              <span>{t("home_logos_badge")}</span>
            </div>
            <span className="h-px w-10 bg-border" />
          </div>

          <h3 className="text-2xl md:text-[28px] font-extrabold mb-2 tracking-tight">
            {t("home_logos_title")}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            {t("home_logos_subtitle")}
          </p>
        </motion.div>

        {/* Premium card-grid with hairline dividers */}
        <div className="relative rounded-2xl border border-border/60 bg-card/30 backdrop-blur-sm overflow-hidden shadow-[0_8px_40px_-12px_hsl(var(--background)/0.8)]">
          {/* Subtle inner glow */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-foreground/[0.02] to-transparent" />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 divide-x divide-y divide-border/50 [&>*]:border-border/50">
            {list.map((u, i) => {
              const accent = accents[i % accents.length];
              const name = lang === "ar" ? u.name_ar : u.name_en;
              return (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.025, duration: 0.4 }}
                >
                  <Link
                    to={`/teachers?university=${encodeURIComponent(name)}`}
                    title={name}
                    className="group relative flex items-center gap-3 px-4 py-4 h-full transition-all duration-300 hover:bg-foreground/[0.03]"
                  >
                    {/* Top accent line on hover */}
                    <span
                      className={`absolute top-0 left-0 right-0 h-[2px] ${accent.dot} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    />

                    {/* Monogram */}
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-lg bg-background border border-border/80 flex items-center justify-center font-black text-[12px] tracking-tight text-foreground shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5 transition-all duration-300">
                        <GraduationCap className="absolute inset-0 m-auto w-4 h-4 text-foreground/[0.06]" />
                        <span className={`relative ${accent.text}`}>
                          {initials(name)}
                        </span>
                      </div>
                      {/* Status dot */}
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ${accent.dot} ring-2 ring-card`} />
                    </div>

                    {/* Name + meta */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[11.5px] font-bold leading-tight line-clamp-2 text-foreground/90 group-hover:text-foreground transition-colors">
                        {name}
                      </div>
                      <div className="text-[9.5px] uppercase tracking-wider text-muted-foreground/60 mt-1 font-semibold">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer meta — magazine style */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mt-6 px-1"
        >
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70 font-semibold">
            {lang === "ar" ? "الكويت · قطر" : "Kuwait · Qatar"}
          </div>
          <Link
            to="/universities"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-primary transition-colors group"
          >
            <span>{t("home_logos_cta")}</span>
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 rtl:rotate-180 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default UniversityLogosStrip;
