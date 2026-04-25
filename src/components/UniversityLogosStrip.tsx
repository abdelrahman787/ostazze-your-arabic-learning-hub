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
    <section className="relative py-16 md:py-20">
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

        {/* Simple clean cards */}
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
                  className="group flex flex-col items-center justify-center gap-2 h-full min-h-[110px] p-4 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all duration-200"
                >
                  <span className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary font-bold text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {initials(name)}
                  </span>
                  <span className="text-[11px] md:text-xs font-medium text-foreground/80 text-center line-clamp-2 leading-snug">
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground transition-colors"
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
