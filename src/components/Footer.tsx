import { Link } from "react-router-dom";
import { GraduationCap, Facebook, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="cta-gradient text-muted-foreground">
      <div className="container py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="text-2xl font-black text-primary mb-4 block tracking-tight">OSTAZZE</Link>
            <p className="text-sm leading-relaxed opacity-60 mb-5">{t("footer_desc")}</p>
            <div className="flex gap-2">
              {[Facebook, Linkedin, Twitter].map((Icon, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 rounded-lg bg-foreground/5 text-foreground/40 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                >
                  <Icon size={16} />
                </motion.button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-5 text-sm">{t("footer_quick_links")}</h4>
            <div className="flex flex-col gap-3 text-sm">
              {[
                { label: t("nav_universities"), path: "/universities" },
                { label: t("nav_subjects"), path: "/subjects" },
                { label: t("nav_teachers"), path: "/teachers" },
                { label: t("nav_categories"), path: "/categories" },
              ].map((l) => (
                <Link key={l.path} to={l.path} className="opacity-50 hover:opacity-100 hover:text-primary transition-all">{l.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-5 text-sm">{t("footer_about")}</h4>
            <div className="flex flex-col gap-3 text-sm">
              {[t("footer_about"), t("footer_contact"), t("footer_terms"), t("footer_privacy")].map((txt) => (
                <a key={txt} href="#" className="opacity-50 hover:opacity-100 hover:text-primary transition-all">{txt}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-5 text-sm">{t("footer_contact_us")}</h4>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-2.5 opacity-50"><Mail size={14} /><span>info@ostazze.com</span></div>
              <div className="flex items-center gap-2.5 opacity-50"><Phone size={14} /><span dir="ltr">+966 50 000 0000</span></div>
              <div className="flex items-center gap-2.5 opacity-50"><MapPin size={14} /><span>{t("footer_location")}</span></div>
            </div>
          </div>
        </div>
        <div className="border-t border-foreground/10 mt-10 pt-6 text-center text-sm opacity-40">
          {t("footer_rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
