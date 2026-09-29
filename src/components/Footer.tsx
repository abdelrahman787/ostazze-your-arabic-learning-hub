import { Link } from "@/lib/router-compat";
import { SITE } from "@/config/site";
import { Facebook, Mail, Phone, MapPin, GraduationCap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t, lang } = useLanguage();

  return (
    <footer className="relative overflow-hidden text-foreground/75 mt-16">
      {/* Sun mood — warm sunset gradient with golden glow */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, hsl(45 100% 65% / 0.45) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 100%, hsl(14 91% 55% / 0.35) 0%, transparent 65%), linear-gradient(180deg, hsl(20 75% 18%) 0%, hsl(18 70% 12%) 60%, hsl(20 60% 8%) 100%)",
        }}
      />
      {/* Warm sun rays / dot grid */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, hsl(45 100% 80%) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-[0_0_20px_hsl(14_91%_50%/0.5)]">
                <GraduationCap size={18} className="text-white" />
              </span>
              <span className="text-2xl font-black text-primary tracking-tight">
                Ostaze
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-black/75 dark:text-white/75 mb-5">
              {t("footer_desc")}
            </p>
            <div className="flex gap-2">
              {SITE.social
                .map(({ network, url }) => ({
                  Icon: Facebook,
                  label: network,
                  href: url,
                }))
                .map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={label}
                    className="w-9 h-9 rounded-full bg-black/5 border border-black/10 text-black/70 hover:bg-primary hover:border-primary hover:text-white flex items-center justify-center transition-all dark:bg-white/5 dark:border-white/10 dark:text-white/70"
                  >
                    <Icon size={15} />
                  </a>
                ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-black dark:text-white mb-5 text-sm">
              {t("footer_quick_links")}
            </h4>
            <div className="flex flex-col gap-3 text-sm">
              {[
                { label: t("nav_subjects"), path: "/subjects" },
                { label: t("nav_teachers"), path: "/teachers" },
                { label: t("nav_universities"), path: "/universities" },
                { label: t("nav_categories"), path: "/categories" },
                {
                  label: lang === "ar" ? "الدورات" : "Courses",
                  path: "/courses",
                },
                {
                  label: lang === "ar" ? "اللغات" : "Languages",
                  path: "/languages",
                },
                // Country hubs (static list: keeps the heavy universities data out of every page).
                ...[
                  ["kuwait", "الكويت", "Kuwait"],
                  ["qatar", "قطر", "Qatar"],
                  ["saudi-arabia", "السعودية", "Saudi Arabia"],
                  ["uae", "الإمارات", "UAE"],
                ].map(([slug, ar, en]) => ({
                  label:
                    lang === "ar" ? `جامعات ${ar}` : `Universities in ${en}`,
                  path: `/universities/${slug}`,
                })),
              ].map((l) => (
                <Link
                  key={l.path}
                  to={l.path}
                  className="text-black/60 dark:text-white/60 hover:text-primary transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-black dark:text-white mb-5 text-sm">
              {t("footer_about")}
            </h4>
            <div className="flex flex-col gap-3 text-sm">
              <Link
                to="/about"
                className="text-black/60 dark:text-white/60 hover:text-primary transition-colors"
              >
                {t("footer_about")}
              </Link>
              <Link
                to="/contact"
                className="text-black/60 dark:text-white/60 hover:text-primary transition-colors"
              >
                {t("footer_contact")}
              </Link>
              <Link
                to="/terms"
                className="text-black/60 dark:text-white/60 hover:text-primary transition-colors"
              >
                {t("footer_terms")}
              </Link>
              <Link
                to="/privacy"
                className="text-black/60 dark:text-white/60 hover:text-primary transition-colors"
              >
                {t("footer_privacy")}
              </Link>
              <Link
                to="/refund"
                className="text-black/60 dark:text-white/60 hover:text-primary transition-colors"
              >
                {t("footer_refund")}
              </Link>
              <Link
                to="/faq"
                className="text-black/60 dark:text-white/60 hover:text-primary transition-colors"
              >
                {t("footer_faq")}
              </Link>
              <Link
                to="/pricing"
                className="text-black/60 dark:text-white/60 hover:text-primary transition-colors"
              >
                {lang === "ar" ? "الأسعار" : "Pricing"}
              </Link>
              <Link
                to="/igcse"
                className="text-black/60 dark:text-white/60 hover:text-primary transition-colors"
              >
                {lang === "ar" ? "كورسات IGCSE" : "IGCSE Courses"}
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-black dark:text-white mb-5 text-sm">
              {t("footer_contact_us")}
            </h4>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-2.5 text-black/60 dark:text-white/60">
                <Mail size={14} />
                <a href={`mailto:${SITE.email}`} className="hover:text-primary">
                  {SITE.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-black/60 dark:text-white/60">
                <Phone size={14} />
                <a
                  href={`tel:${SITE.phone}`}
                  dir="ltr"
                  className="hover:text-primary"
                >
                  {SITE.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-black/60 dark:text-white/60">
                <MapPin size={14} />
                <span>
                  {lang === "ar"
                    ? `${SITE.city.ar} - ${SITE.country.ar}`
                    : `${SITE.city.en} - ${SITE.country.en}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-black/10 dark:border-white/10 mt-12 pt-6 text-center text-sm text-black/40 dark:text-white/40">
          © {new Date().getFullYear()} {SITE.name}.{" "}
          {t("footer_rights").replace(/© \d{4} Ostaze\. ?/, "")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
