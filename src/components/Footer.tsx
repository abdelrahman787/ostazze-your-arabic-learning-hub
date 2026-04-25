import { Link } from "react-router-dom";
import { Facebook, Linkedin, Twitter, Mail, Phone, MapPin, GraduationCap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

const Footer = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");

  return (
    <footer className="relative overflow-hidden text-foreground/75 mt-16">
      {/* Deep dark background with orange radial glow */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, hsl(14 91% 50% / 0.18) 0%, transparent 65%), linear-gradient(180deg, hsl(230 35% 8%), hsl(230 35% 4%))",
        }}
      />
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none -z-10"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }}
      />

      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-[0_0_20px_hsl(14_91%_50%/0.5)]">
                <GraduationCap size={18} className="text-white" />
              </span>
              <span className="text-2xl font-black text-primary tracking-tight">OSTAZE</span>
            </Link>
            <p className="text-sm leading-relaxed text-white/75 mb-5">{t("footer_desc")}</p>
            <div className="flex gap-2">
              {[
                { Icon: Facebook, label: "Facebook", href: "#" },
                { Icon: Linkedin, label: "LinkedIn", href: "#" },
                { Icon: Twitter, label: "Twitter", href: "#" },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-primary hover:border-primary hover:text-white flex items-center justify-center transition-all"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-5 text-sm">{t("footer_quick_links")}</h4>
            <div className="flex flex-col gap-3 text-sm">
              {[
                { label: t("nav_subjects"), path: "/subjects" },
                { label: t("nav_teachers"), path: "/teachers" },
                { label: t("nav_universities"), path: "/universities" },
                { label: t("nav_categories"), path: "/categories" },
              ].map((l) => (
                <Link key={l.path} to={l.path} className="text-white/60 hover:text-primary transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-5 text-sm">{t("footer_about")}</h4>
            <div className="flex flex-col gap-3 text-sm">
              <Link to="/about" className="text-white/60 hover:text-primary transition-colors">{t("footer_about")}</Link>
              <Link to="/contact" className="text-white/60 hover:text-primary transition-colors">{t("footer_contact")}</Link>
              <Link to="/terms" className="text-white/60 hover:text-primary transition-colors">{t("footer_terms")}</Link>
              <Link to="/privacy" className="text-white/60 hover:text-primary transition-colors">{t("footer_privacy")}</Link>
              <Link to="/refund" className="text-white/60 hover:text-primary transition-colors">{t("footer_refund")}</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-5 text-sm">{t("footer_contact_us")}</h4>
            <div className="flex flex-col gap-3 text-sm mb-6">
              <div className="flex items-center gap-2.5 text-white/60"><Mail size={14} /><span>info@ostaze.com</span></div>
              <div className="flex items-center gap-2.5 text-white/60"><Phone size={14} /><span dir="ltr">+966 55 900 3498</span></div>
              <div className="flex items-center gap-2.5 text-white/60"><MapPin size={14} /><span>{t("footer_location")}</span></div>
            </div>

            {/* Newsletter */}
            <h4 className="font-bold text-white mb-3 text-sm">{t("footer_newsletter_title")}</h4>
            <form onSubmit={(e) => { e.preventDefault(); setEmail(""); }} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("footer_newsletter_placeholder")}
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary min-h-[40px]"
              />
              <button type="submit" className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-primary-dark transition-colors min-h-[40px] shadow-[0_4px_14px_hsl(14_91%_50%/0.35)]">
                {t("footer_newsletter_btn")}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 text-center text-sm text-white/40">
          © {new Date().getFullYear()} Ostaze. {t("footer_rights").replace(/© \d{4} Ostaze\. ?/, "")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
