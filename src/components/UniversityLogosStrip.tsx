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

// Brand colors per university (HSL strings: "H S% L%")
const brandByUniId: Record<string, string> = {
  "KW-KU": "215 75% 25%",       // Kuwait University - navy
  "KW-GUST": "210 80% 45%",     // GUST - blue
  "KW-AUK": "0 75% 45%",        // American Univ Kuwait - red
  "KW-ACK": "215 70% 35%",      // ACM - blue
  "KW-AAUM": "200 70% 40%",     // Arab Open Univ - teal blue
  "QA-QU": "340 80% 35%",       // Qatar University - maroon
  "QA-UDST": "210 60% 30%",     // UDST - dark blue
  "QA-HBKU": "260 50% 35%",     // HBKU - purple/maroon
  "QA-LU": "350 70% 35%",       // Lusail - maroon
  "QA-CCQ": "215 70% 30%",      // Community College Qatar - blue
  "QA-CMUQ": "0 70% 35%",       // Carnegie Mellon - red
  "QA-GUQ": "215 75% 25%",      // Georgetown - navy
  "QA-NUQ": "270 60% 30%",      // Northwestern - purple
  "QA-VCUQ": "0 80% 40%",       // VCU - red
  "QA-WCMQ": "0 75% 35%",       // Weill Cornell - red
};

const getDomain = (website: string) => {
  try {
    return new URL(website).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

const UniversityCard = ({
  uniId,
  name,
  website,
  to,
  delay,
}: {
  uniId: string;
  name: string;
  website: string;
  to: string;
  delay: number;
}) => {
  const [logoFailed, setLogoFailed] = useState(false);
  const domain = getDomain(website);
  const brand = brandByUniId[uniId] ?? "14 91% 55%";
  const logoUrl = domain
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay, duration: 0.35 }}
      className="relative"
    >
      {/* Soft brand glow behind the card */}
      <div
        className="absolute -inset-2 rounded-3xl blur-2xl opacity-50 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, hsl(${brand} / 0.45), transparent 70%)` }}
      />

      <Link
        to={to}
        title={name}
        className="group relative flex flex-col items-center justify-center gap-2.5 h-full min-h-[130px] p-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5"
        style={{
          background: `linear-gradient(135deg, hsl(${brand} / 0.18) 0%, hsl(${brand} / 0.08) 100%)`,
          borderColor: `hsl(${brand} / 0.30)`,
          boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.5), 0 6px 24px -8px hsl(${brand} / 0.35)`,
        }}
      >
        {/* top sheen */}
        <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent rounded-t-2xl pointer-events-none" />

        {/* Logo bubble */}
        <div
          className="relative flex items-center justify-center w-14 h-14 rounded-xl bg-white/85 backdrop-blur-sm border overflow-hidden shadow-sm"
          style={{ borderColor: `hsl(${brand} / 0.25)` }}
        >
          {!logoFailed && logoUrl ? (
            <img
              src={logoUrl}
              alt={`${name} logo`}
              loading="lazy"
              className="w-9 h-9 object-contain"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span
              className="font-bold text-base"
              style={{ color: `hsl(${brand})` }}
            >
              {initials(name)}
            </span>
          )}
        </div>

        <span className="relative text-[11px] md:text-xs font-semibold text-foreground/85 text-center line-clamp-2 leading-snug">
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
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Soft ambient color blobs behind the glass */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full blur-[120px] opacity-60"
          style={{ background: "hsl(14 91% 55% / 0.30)" }}
        />
        <div
          className="absolute top-1/3 -right-24 w-[380px] h-[380px] rounded-full blur-[120px] opacity-50"
          style={{ background: "hsl(38 92% 55% / 0.25)" }}
        />
        <div
          className="absolute -bottom-24 left-1/3 w-[360px] h-[360px] rounded-full blur-[120px] opacity-40"
          style={{ background: "hsl(28 95% 55% / 0.22)" }}
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {list.map((u, i) => {
            const name = lang === "ar" ? u.name_ar : u.name_en;
            return (
              <UniversityCard
                key={u.id}
                uniId={u.id}
                name={name}
                website={u.website}
                to={`/teachers?university=${encodeURIComponent(name)}`}
                delay={i * 0.03}
              />
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
