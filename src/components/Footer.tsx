import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="cta-gradient text-muted-foreground">
    <div className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <Link to="/" className="text-2xl font-black text-primary mb-3 block">🎓 OSTAZZE</Link>
          <p className="text-sm leading-relaxed opacity-80 mb-4">منصة تعليمية متميزة تربطك بأفضل المدرسين الخصوصيين لجلسات مباشرة عبر الإنترنت.</p>
          <div className="flex gap-2">
            {["f", "in", "𝕏"].map((s) => (
              <button key={s} className="w-9 h-9 rounded-lg bg-foreground/10 text-foreground/60 hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-sm font-bold transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-4">روابط سريعة</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/universities" className="hover:text-primary transition-colors">الجامعات</Link>
            <Link to="/subjects" className="hover:text-primary transition-colors">المواد</Link>
            <Link to="/teachers" className="hover:text-primary transition-colors">المعلمين</Link>
            <Link to="/categories" className="hover:text-primary transition-colors">التصنيفات</Link>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-4">من نحن</h4>
          <div className="flex flex-col gap-2 text-sm">
            <a href="#" className="hover:text-primary transition-colors">من نحن</a>
            <a href="#" className="hover:text-primary transition-colors">تواصل معنا</a>
            <a href="#" className="hover:text-primary transition-colors">الشروط والأحكام</a>
            <a href="#" className="hover:text-primary transition-colors">سياسة الخصوصية</a>
          </div>
        </div>
      </div>
      <div className="border-t border-foreground/10 mt-8 pt-6 text-center text-sm opacity-60">
        © 2026 Ostazze. جميع الحقوق محفوظة
      </div>
    </div>
  </footer>
);

export default Footer;
