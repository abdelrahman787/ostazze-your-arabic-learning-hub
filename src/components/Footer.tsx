import { Link } from "react-router-dom";
import { Facebook, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

const Footer = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-gradient-to-b from-[hsl(220,45%,15%)] to-[hsl(222,47%,9%)] text-[hsl(210,20%,78%)] relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="container py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="text-2xl font-black text-primary mb-4 block tracking-tight">🎓 OSTAZZE</Link>
            <p className="text-sm leading-relaxed text-[hsl(210,15%,65%)] mb-5">{t("footer_desc")}</p>
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
                  className="w-9 h-9 rounded-lg bg-white/10 text-[hsl(210,20%,78%)] hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-5 text-sm">{t("footer_quick_links")}</h4>
            <div className="flex flex-col gap-3 text-sm">
              {[
                { label: t("nav_universities"), path: "/universities" },
                { label: t("nav_subjects"), path: "/subjects" },
                { label: t("nav_teachers"), path: "/teachers" },
                { label: t("nav_categories"), path: "/categories" },
              ].map((l) => (
                <Link key={l.path} to={l.path} className="text-[hsl(210,15%,65%)] hover:text-primary transition-all">{l.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-5 text-sm">{t("footer_about")}</h4>
            <div className="flex flex-col gap-3 text-sm">
              {[t("footer_about"), t("footer_contact"), t("footer_terms"), t("footer_privacy")].map((txt) => (
                <a key={txt} href="#" className="text-[hsl(210,15%,65%)] hover:text-primary transition-all">{txt}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-5 text-sm">{t("footer_contact_us")}</h4>
            <div className="flex flex-col gap-3 text-sm mb-6">
              <div className="flex items-center gap-2.5 text-[hsl(210,15%,65%)]"><Mail size={14} /><span>info@ostazze.com</span></div>
              <div className="flex items-center gap-2.5 text-[hsl(210,15%,65%)]"><Phone size={14} /><span dir="ltr">+966 55 900 3498</span></div>
              <div className="flex items-center gap-2.5 text-[hsl(210,15%,65%)]"><MapPin size={14} /><span>{t("footer_location")}</span></div>
            </div>

            {/* Newsletter */}
            <h4 className="font-bold text-white mb-3 text-sm">{t("footer_newsletter_title")}</h4>
            <form onSubmit={(e) => { e.preventDefault(); setEmail(""); }} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("footer_newsletter_placeholder")}
                className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary min-h-[44px]"
              />
              <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-dark transition-colors min-h-[44px]">
                {t("footer_newsletter_btn")}
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 text-center text-sm text-[hsl(210,15%,55%)]">
          © {new Date().getFullYear()} Ostazze. {t("footer_rights").replace(/© \d{4} Ostazze\. ?/, "")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
