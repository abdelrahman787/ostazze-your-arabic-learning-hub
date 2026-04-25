import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Soft ambient color blobs behind the glass */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full blur-[120px] opacity-60"
          style={{ background: "hsl(14 91% 55% / 0.35)" }}
        />
        <div
          className="absolute top-1/3 -right-24 w-[380px] h-[380px] rounded-full blur-[120px] opacity-50"
          style={{ background: "hsl(38 92% 55% / 0.30)" }}
        />
        <div
          className="absolute -bottom-24 left-1/3 w-[360px] h-[360px] rounded-full blur-[120px] opacity-40"
          style={{ background: "hsl(28 95% 55% / 0.25)" }}
        />
      </div>

      <div className="container max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-4xl font-extrabold mb-3 tracking-tight text-foreground">
            {t("home_logos_title")}
          </h3>
          <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
            {t("home_logos_subtitle")}
          </p>
        </div>

        {/* Light glass cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {list.map((u, i) => {
            const name = lang === "ar" ? u.name_ar : u.name_en;
            return (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.03, duration: 0.35 }}
              >
                <Link
                  to={`/teachers?university=${encodeURIComponent(name)}`}
                  title={name}
                  className="group relative flex flex-col items-center justify-center gap-2 h-full min-h-[120px] p-4 rounded-2xl border border-white/30 bg-white/40 backdrop-blur-xl hover:bg-white/55 hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    boxShadow:
                      "inset 0 1px 0 0 rgba(255,255,255,0.6), 0 4px 20px -6px rgba(0,0,0,0.08)",
                  }}
                >
                  {/* subtle top sheen */}
                  <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-2xl pointer-events-none" />

                  <span className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-primary/15 text-primary font-bold text-lg border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {initials(name)}
                  </span>
                  <span className="relative text-[11px] md:text-xs font-semibold text-foreground/80 text-center line-clamp-2 leading-snug">
                    {name}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="flex justify-center mt-10">
          <Link
            to="/universities"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-primary border border-primary/30 bg-white/40 backdrop-blur-md hover:bg-primary hover:text-primary-foreground transition-colors"
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
