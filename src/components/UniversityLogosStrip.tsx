import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";
import { allUniversities } from "@/data/universitiesData";
import { useLanguage } from "@/contexts/LanguageContext";

// Each university gets its own glass color tint
const tints = [
  { from: "from-orange-500/40", to: "to-amber-500/10", border: "border-orange-300/30", text: "text-orange-100", shadow: "shadow-orange-500/30", inner: "from-orange-400/60 to-orange-600/20" },
  { from: "from-sky-500/40", to: "to-blue-500/10", border: "border-sky-300/30", text: "text-sky-100", shadow: "shadow-sky-500/30", inner: "from-sky-400/60 to-blue-600/20" },
  { from: "from-emerald-500/40", to: "to-teal-500/10", border: "border-emerald-300/30", text: "text-emerald-100", shadow: "shadow-emerald-500/30", inner: "from-emerald-400/60 to-teal-600/20" },
  { from: "from-violet-500/40", to: "to-purple-500/10", border: "border-violet-300/30", text: "text-violet-100", shadow: "shadow-violet-500/30", inner: "from-violet-400/60 to-purple-600/20" },
  { from: "from-amber-500/40", to: "to-yellow-500/10", border: "border-amber-300/30", text: "text-amber-100", shadow: "shadow-amber-500/30", inner: "from-amber-400/60 to-yellow-600/20" },
  { from: "from-rose-500/40", to: "to-pink-500/10", border: "border-rose-300/30", text: "text-rose-100", shadow: "shadow-rose-500/30", inner: "from-rose-400/60 to-pink-600/20" },
  { from: "from-cyan-500/40", to: "to-teal-500/10", border: "border-cyan-300/30", text: "text-cyan-100", shadow: "shadow-cyan-500/30", inner: "from-cyan-400/60 to-teal-600/20" },
  { from: "from-fuchsia-500/40", to: "to-pink-500/10", border: "border-fuchsia-300/30", text: "text-fuchsia-100", shadow: "shadow-fuchsia-500/30", inner: "from-fuchsia-400/60 to-pink-600/20" },
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
    <section className="relative py-20 md:py-24 overflow-hidden">
      <div className="container max-w-7xl relative">
        {/* ============ COLORFUL ORBS BEHIND THE GLASS ============ */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Right side orbs */}
          <div className="absolute -top-10 -right-20 w-[420px] h-[420px] bg-orange-500/40 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute top-1/3 -right-32 w-[320px] h-[320px] bg-pink-500/30 rounded-full blur-[100px]" />
          <div className="absolute -bottom-20 right-1/4 w-[300px] h-[300px] bg-amber-500/25 rounded-full blur-[110px]" />

          {/* Left side orbs */}
          <div className="absolute -top-10 -left-20 w-[420px] h-[420px] bg-sky-500/40 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-1/3 -left-32 w-[320px] h-[320px] bg-violet-500/35 rounded-full blur-[100px]" />
          <div className="absolute -bottom-20 left-1/4 w-[300px] h-[300px] bg-emerald-500/25 rounded-full blur-[110px]" />

          {/* Center accent */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-fuchsia-500/15 rounded-full blur-[140px]" />
        </div>

        {/* ============ FROSTED GLASS BAR (CRYSTAL CONTAINER) ============ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-[2rem] border border-white/15 bg-white/[0.03] backdrop-blur-2xl overflow-hidden shadow-[0_20px_80px_-20px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.15)]"
        >
          {/* Glass top highlight */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          {/* Glass top sheen */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />
          {/* Glass bottom edge */}
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="relative p-8 md:p-12">
            {/* ============ HEADER ============ */}
            <div className="text-center mb-10 md:mb-12">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-white/90">
                  {t("home_logos_badge")}
                </span>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 }}
                className="text-2xl md:text-4xl font-extrabold mb-3 tracking-tight text-white drop-shadow-[0_2px_20px_rgba(255,255,255,0.15)]"
              >
                {t("home_logos_title")}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-sm md:text-base text-white/65 max-w-md mx-auto leading-relaxed"
              >
                {t("home_logos_subtitle")}
              </motion.p>
            </div>

            {/* ============ 3D COLORED GLASS TILES ============ */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
              {list.map((u, i) => {
                const tint = tints[i % tints.length];
                const name = lang === "ar" ? u.name_ar : u.name_en;
                return (
                  <motion.div
                    key={u.id}
                    initial={{ opacity: 0, y: 20, rotateX: -15 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ delay: i * 0.04, duration: 0.5, ease: "easeOut" }}
                    style={{ transformStyle: "preserve-3d", perspective: 800 }}
                  >
                    <Link
                      to={`/teachers?university=${encodeURIComponent(name)}`}
                      title={name}
                      className={`group relative block rounded-2xl border ${tint.border} bg-gradient-to-br ${tint.from} ${tint.to} backdrop-blur-xl px-3.5 py-3.5 h-full min-h-[80px] overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl ${tint.shadow} shadow-lg`}
                      style={{
                        boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.25), inset 0 -1px 0 0 rgba(0,0,0,0.15), 0 8px 24px -8px rgba(0,0,0,0.4)`,
                      }}
                    >
                      {/* Inner glass top sheen */}
                      <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
                      {/* Bottom shadow */}
                      <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                      {/* Hover glow ring */}
                      <div className={`absolute inset-0 rounded-2xl ring-1 ring-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      {/* Light reflection blob */}
                      <div className="absolute -top-6 -right-6 w-16 h-16 bg-white/30 rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />

                      <div className="relative flex items-center gap-2.5 h-full">
                        {/* 3D Monogram */}
                        <div
                          className={`relative shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${tint.inner} flex items-center justify-center font-black text-[12px] ${tint.text} border border-white/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),inset_0_-2px_4px_0_rgba(0,0,0,0.2),0_4px_10px_-2px_rgba(0,0,0,0.3)]`}
                        >
                          <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                            {initials(name)}
                          </span>
                          {/* Tiny glass highlight on monogram */}
                          <span className="absolute top-0.5 left-0.5 right-0.5 h-1/3 rounded-t-lg bg-white/30 blur-[1px]" />
                        </div>

                        {/* Name */}
                        <span className="relative text-[10.5px] md:text-[11.5px] font-bold leading-tight line-clamp-2 text-white/95 group-hover:text-white transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] flex-1">
                          {name}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* ============ FOOTER ============ */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between mt-10 pt-6 border-t border-white/10"
            >
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">
                {lang === "ar" ? "الكويت · قطر" : "Kuwait · Qatar"}
              </div>
              <Link
                to="/universities"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md text-xs font-bold text-white transition-all duration-300 group shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]"
              >
                <span>{t("home_logos_cta")}</span>
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 rtl:rotate-180 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Slow pulse animation */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default UniversityLogosStrip;
