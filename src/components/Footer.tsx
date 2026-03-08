import { Link } from "react-router-dom";
import { GraduationCap, Facebook, Linkedin, Twitter, ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="cta-gradient text-muted-foreground">
    <div className="container py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <GraduationCap size={20} className="text-primary-foreground" />
            </div>
            <span className="text-xl font-black text-primary">OSTAZZE</span>
          </Link>
          <p className="text-sm leading-relaxed opacity-70 mb-5">منصة تعليمية متميزة تربطك بأفضل المدرسين الخصوصيين لجلسات مباشرة عبر الإنترنت.</p>
          <div className="flex gap-2">
            {[
              { icon: Facebook, label: "Facebook" },
              { icon: Linkedin, label: "LinkedIn" },
              { icon: Twitter, label: "X" },
            ].map((s) => (
              <button key={s.label} className="w-9 h-9 rounded-xl bg-foreground/5 text-foreground/50 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-200">
                <s.icon size={16} />
              </button>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-foreground mb-5 text-sm">روابط سريعة</h4>
          <div className="flex flex-col gap-3 text-sm">
            {[
              { label: "الجامعات", path: "/universities" },
              { label: "المواد", path: "/subjects" },
              { label: "المعلمين", path: "/teachers" },
              { label: "التصنيفات", path: "/categories" },
            ].map((l) => (
              <Link key={l.path} to={l.path} className="opacity-60 hover:opacity-100 hover:text-primary transition-all flex items-center gap-1.5 group">
                <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* About */}
        <div>
          <h4 className="font-bold text-foreground mb-5 text-sm">من نحن</h4>
          <div className="flex flex-col gap-3 text-sm">
            {["من نحن", "تواصل معنا", "الشروط والأحكام", "سياسة الخصوصية"].map((t) => (
              <a key={t} href="#" className="opacity-60 hover:opacity-100 hover:text-primary transition-all flex items-center gap-1.5 group">
                <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                {t}
              </a>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-foreground mb-5 text-sm">تواصل معنا</h4>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2.5 opacity-60">
              <Mail size={14} />
              <span>info@ostazze.com</span>
            </div>
            <div className="flex items-center gap-2.5 opacity-60">
              <Phone size={14} />
              <span dir="ltr">+966 50 000 0000</span>
            </div>
            <div className="flex items-center gap-2.5 opacity-60">
              <MapPin size={14} />
              <span>الرياض، المملكة العربية السعودية</span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-foreground/10 mt-10 pt-6 text-center text-sm opacity-40">
        © 2026 Ostazze. جميع الحقوق محفوظة
      </div>
    </div>
  </footer>
);

export default Footer;
