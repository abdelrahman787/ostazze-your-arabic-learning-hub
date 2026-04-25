import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
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

const getDomain = (website: string) => {
  try {
    return new URL(website).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

const UniversityCard = ({
  name,
  website,
  to,
  delay,
}: {
  name: string;
  website: string;
  to: string;
  delay: number;
}) => {
  const [logoFailed, setLogoFailed] = useState(false);
  const domain = getDomain(website);
  const logoUrl = domain
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay, duration: 0.3 }}
    >
      <Link
        to={to}
        title={name}
        className="group flex flex-col items-center justify-center gap-3 h-full min-h-[130px] p-4 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all duration-200"
      >
        {/* Logo container */}
        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-muted/50 border border-border/50 overflow-hidden">
          {!logoFailed && logoUrl ? (
            <img
              src={logoUrl}
              alt={`${name} logo`}
              loading="lazy"
              className="w-9 h-9 object-contain"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span className="font-bold text-sm text-foreground/70">
              {initials(name)}
            </span>
          )}
        </div>

        <span className="text-[11px] md:text-xs font-medium text-foreground/80 text-center line-clamp-2 leading-snug group-hover:text-primary transition-colors">
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
    <section className="py-16 md:py-20 bg-background">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
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
                website={u.website}
                to={`/teachers?university=${encodeURIComponent(name)}`}
                delay={i * 0.025}
              />
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
