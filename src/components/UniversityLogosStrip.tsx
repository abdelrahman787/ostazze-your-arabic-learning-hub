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

            {/* ============ VIBRANT GRADIENT CARDS (like reference) ============ */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
              {list.map((u, i) => {
                const name = lang === "ar" ? u.name_ar : u.name_en;
                return (
                  <motion.div
                    key={u.id}
                    initial={{ opacity: 0, y: 24, scale: 0.94 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ delay: i * 0.05, duration: 0.55, ease: "easeOut" }}
                    className="relative"
                  >
                    {/* Outer ambient glow halo (visible behind card) */}
                    <div
                      className="absolute -inset-2 rounded-[1.5rem] opacity-40 group-hover:opacity-70 transition-opacity duration-500 blur-2xl pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(ellipse at 30% 30%, hsl(14 91% 55% / 0.6), transparent 70%)",
                      }}
                    />

                    <Link
                      to={`/teachers?university=${encodeURIComponent(name)}`}
                      title={name}
                      className="group relative block rounded-2xl border border-white/15 px-4 py-5 h-full min-h-[150px] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-white/30"
                      style={{
                        background:
                          "linear-gradient(135deg, hsl(14 91% 65%) 0%, hsl(14 91% 50%) 35%, hsl(14 88% 35%) 70%, hsl(14 80% 22%) 100%)",
                        boxShadow:
                          "inset 0 1px 0 0 rgba(255,255,255,0.35), inset 0 -2px 8px 0 rgba(0,0,0,0.3), 0 12px 40px -8px hsl(14 91% 50% / 0.55), 0 4px 12px -4px rgba(0,0,0,0.4)",
                      }}
                    >
                      {/* Top-left bright highlight (the signature glow from reference) */}
                      <div
                        className="absolute -top-16 -left-16 w-44 h-44 rounded-full pointer-events-none opacity-90"
                        style={{
                          background:
                            "radial-gradient(circle, hsl(28 100% 75% / 0.7) 0%, transparent 60%)",
                          filter: "blur(8px)",
                        }}
                      />

                      {/* Bottom-right deep shadow */}
                      <div
                        className="absolute -bottom-12 -right-12 w-36 h-36 rounded-full pointer-events-none opacity-70"
                        style={{
                          background:
                            "radial-gradient(circle, rgba(0,0,0,0.5) 0%, transparent 70%)",
                          filter: "blur(20px)",
                        }}
                      />

                      {/* Diagonal sheen */}
                      <div
                        className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)",
                        }}
                      />

                      {/* Top sheen edge */}
                      <div className="absolute top-0 inset-x-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-t-2xl" />

                      {/* Content */}
                      <div className="relative flex flex-col items-center justify-center text-center h-full gap-3 min-h-[120px]">
                        {/* Big bold initials */}
                        <span
                          className="font-black text-3xl md:text-4xl tracking-tight text-white leading-none"
                          style={{
                            textShadow:
                              "0 2px 8px rgba(0,0,0,0.35), 0 0 20px rgba(255,255,255,0.2)",
                          }}
                        >
                          {initials(name)}
                        </span>

                        {/* University name */}
                        <span
                          className="text-[11px] md:text-[12px] font-bold leading-snug line-clamp-2 text-white/95 px-1"
                          style={{
                            textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                          }}
                        >
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
