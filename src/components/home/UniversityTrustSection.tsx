import { GraduationCap, Sparkles } from "lucide-react";
import { Link } from "@/lib/router-compat";
import { useLanguage } from "@/contexts/LanguageContext";
import logos from "@/assets/university-logos-grid.webp.asset.json";
import logosSmall from "@/assets/university-logos-grid-960.webp.asset.json";

const UniversityTrustSection = () => {
  const { lang, t } = useLanguage();

  return (
    <section
      id="home-university-trust"
      aria-labelledby="university-trust-title"
      className="bg-background py-16 md:py-24"
    >
      <div className="container max-w-6xl">
        <div className="text-center mb-8 md:mb-10">
          <span className="inline-flex items-center gap-2 text-primary text-xs font-bold mb-4">
            <Sparkles size={16} aria-hidden="true" />
            {lang === "ar" ? "ثقة الطلاب" : "Trusted by Students"}
          </span>
          <h2
            id="university-trust-title"
            className="text-3xl md:text-5xl font-black leading-tight"
          >
            {lang === "ar" ? "طلابنا ملتحقون بـ" : "Our Students Study At"}
            <span className="block text-primary mt-2">
              {lang === "ar" ? "أعرق الجامعات" : "Top-Tier Universities"}
            </span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base mt-4 max-w-2xl mx-auto">
            {lang === "ar"
              ? "طلاب من أبرز الجامعات في السعودية، الإمارات، الكويت وقطر يثقون بـ OSTAZE لرحلتهم الدراسية."
              : "Students from leading universities across Saudi Arabia, UAE, Kuwait and Qatar trust OSTAZE for their academic journey."}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-lg" dir="ltr">
          <img
            src={logos.url}
            srcSet={`${logosSmall.url} 960w, ${logos.url} 1920w`}
            sizes="(max-width: 768px) 100vw, 1152px"
            width={1920}
            height={516}
            alt={lang === "ar" ? "شعارات الجامعات" : "University logos"}
            loading="lazy"
            decoding="async"
            className="block w-full h-auto"
          />
          <div className="absolute inset-y-0 left-0 w-[28%] flex flex-col items-center justify-center gap-2 md:gap-5 text-primary-foreground text-center px-1">
            <div>
              <div className="text-xl sm:text-3xl md:text-4xl font-black leading-none">+12k</div>
              <div className="text-[10px] sm:text-xs md:text-sm font-bold mt-1" dir={lang === "ar" ? "rtl" : "ltr"}>
                {t("stats_students")}
              </div>
            </div>
            <div>
              <div className="text-base sm:text-xl md:text-2xl font-black leading-none">98%</div>
              <div className="text-[10px] sm:text-xs md:text-sm font-semibold mt-1">
                {lang === "ar" ? "رضا الطلاب" : "Student satisfaction"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Link to="/universities" className="btn-primary inline-flex items-center gap-2">
            <GraduationCap size={18} aria-hidden="true" />
            {t("home_logos_cta")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UniversityTrustSection;