import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";
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

const UniversityLogosStrip = () => {
  const { t, lang } = useLanguage();
  const list = allUniversities.slice(0, 12);

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="container max-w-7xl relative">
        {/* ============ AMBIENT ORANGE GLOWS BEHIND THE GLASS ============ */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Right side — primary brand glow */}
          <div
            className="absolute -top-20 -right-32 w-[500px] h-[500px] rounded-full blur-[140px] animate-pulse-slow"
            style={{ background: "hsl(14 91% 55% / 0.45)" }}
          />
          <div
            className="absolute top-1/3 -right-40 w-[380px] h-[380px] rounded-full blur-[120px]"
            style={{ background: "hsl(28 95% 55% / 0.30)" }}
          />
          <div
            className="absolute -bottom-24 right-1/4 w-[340px] h-[340px] rounded-full blur-[130px]"
            style={{ background: "hsl(14 91% 55% / 0.25)" }}
          />

          {/* Left side — warm amber accents */}
          <div
            className="absolute -top-20 -left-32 w-[500px] h-[500px] rounded-full blur-[140px] animate-pulse-slow"
            style={{ background: "hsl(38 92% 55% / 0.35)", animationDelay: "1.5s" }}
          />
          <div
            className="absolute top-1/3 -left-40 w-[380px] h-[380px] rounded-full blur-[120px]"
            style={{ background: "hsl(14 91% 55% / 0.30)" }}
          />
          <div
            className="absolute -bottom-24 left-1/4 w-[340px] h-[340px] rounded-full blur-[130px]"
            style={{ background: "hsl(28 95% 50% / 0.25)" }}
          />

          {/* Faint center */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full blur-[160px]"
            style={{ background: "hsl(14 91% 55% / 0.10)" }}
          />
        </div>

        {/* ============ FROSTED GLASS CONTAINER ============ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-[2rem] border border-white/10 bg-[hsl(230_35%_8%/0.55)] backdrop-blur-2xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.08)]"
        >
          {/* Glass top highlight */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          {/* Glass top sheen */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
          {/* Bottom edge */}
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

          <div className="relative p-8 md:p-14">
            {/* ============ HEADER ============ */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 backdrop-blur-md mb-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_4px_20px_-4px_hsl(14_91%_55%/0.4)]"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-primary">
                  {t("home_logos_badge")}
                </span>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 }}
                className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-white drop-shadow-[0_2px_30px_rgba(255,255,255,0.1)]"
              >
                {t("home_logos_title")}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-sm md:text-base text-white/60 max-w-md mx-auto leading-relaxed"
              >
                {t("home_logos_subtitle")}
              </motion.p>
            </div>

            {/* ============ BRAND-COLORED 3D GLASS TILES ============ */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
              {list.map((u, i) => {
                const name = lang === "ar" ? u.name_ar : u.name_en;
                return (
                  <motion.div
                    key={u.id}
                    initial={{ opacity: 0, y: 20, rotateX: -10 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ delay: i * 0.04, duration: 0.5, ease: "easeOut" }}
                    style={{ transformStyle: "preserve-3d", perspective: 800 }}
                  >
                    <Link
                      to={`/teachers?university=${encodeURIComponent(name)}`}
                      title={name}
                      className="group relative block rounded-2xl border border-white/10 px-3.5 py-3.5 h-full min-h-[88px] overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/40"
                      style={{
                        background:
                          "linear-gradient(135deg, hsl(230 30% 12% / 0.95) 0%, hsl(230 35% 8% / 0.95) 60%, hsl(14 91% 35% / 0.35) 100%)",
                        boxShadow:
                          "inset 0 1px 0 0 rgba(255,255,255,0.1), inset 0 -1px 0 0 rgba(0,0,0,0.3), 0 8px 24px -8px rgba(0,0,0,0.5)",
                      }}
                    >
                      {/* Bottom-right brand glow corner (like Card-Y reference) */}
                      <div
                        className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                        style={{
                          background:
                            "radial-gradient(circle, hsl(14 91% 55% / 0.5) 0%, transparent 70%)",
                          filter: "blur(20px)",
                        }}
                      />

                      {/* Top-left subtle warm highlight */}
                      <div
                        className="absolute -top-8 -left-8 w-24 h-24 rounded-full opacity-30 pointer-events-none"
                        style={{
                          background:
                            "radial-gradient(circle, hsl(38 92% 60% / 0.3) 0%, transparent 70%)",
                          filter: "blur(20px)",
                        }}
                      />

                      {/* Inner glass top sheen */}
                      <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none rounded-t-2xl" />

                      {/* Hover ring */}
                      <div className="absolute inset-0 rounded-2xl ring-1 ring-primary/0 group-hover:ring-primary/30 transition-all duration-500 pointer-events-none" />

                      <div className="relative flex items-center gap-2.5 h-full">
                        {/* 3D Brand Monogram */}
                        <div
                          className="relative shrink-0 w-11 h-11 rounded-xl flex items-center justify-center font-black text-[12px] text-white border border-primary/40"
                          style={{
                            background:
                              "linear-gradient(135deg, hsl(14 91% 60%) 0%, hsl(14 91% 45%) 50%, hsl(28 95% 50%) 100%)",
                            boxShadow:
                              "inset 0 1px 0 0 rgba(255,255,255,0.4), inset 0 -2px 4px 0 rgba(0,0,0,0.25), 0 4px 14px -2px hsl(14 91% 55% / 0.5)",
                          }}
                        >
                          <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                            {initials(name)}
                          </span>
                          {/* Glass highlight */}
                          <span className="absolute top-0.5 left-0.5 right-0.5 h-1/3 rounded-t-lg bg-white/35 blur-[1px]" />
                        </div>

                        {/* Name */}
                        <span className="relative text-[10.5px] md:text-[11.5px] font-bold leading-tight line-clamp-2 text-white/90 group-hover:text-white transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] flex-1">
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
              className="flex items-center justify-between mt-12 pt-6 border-t border-white/8"
            >
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/45 font-bold">
                {lang === "ar" ? "الكويت · قطر" : "Kuwait · Qatar"}
              </div>
              <Link
                to="/universities"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white transition-all duration-300 group border border-primary/40 hover:border-primary/60 hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(14 91% 55%) 0%, hsl(14 88% 45%) 100%)",
                  boxShadow:
                    "inset 0 1px 0 0 rgba(255,255,255,0.25), 0 6px 20px -4px hsl(14 91% 55% / 0.5)",
                }}
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
          50% { opacity: 0.75; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 7s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default UniversityLogosStrip;
