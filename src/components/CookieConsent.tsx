import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const STORAGE_KEY = "ostaze_cookie_consent_v1";

/**
 * Lightweight cookie/storage notice. The platform currently uses only essential
 * client storage (auth session + language). If analytics are added later, this
 * banner should be upgraded to a full preferences UI.
 */
const CookieConsent = () => {
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        // Delay to avoid CLS on first paint
        const t = setTimeout(() => setVisible(true), 800);
        return () => clearTimeout(t);
      }
    } catch {
      /* localStorage may be blocked — silently ignore */
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ essential: true, ts: Date.now() }));
    } catch {
      /* noop */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={lang === "ar" ? "إشعار ملفات تعريف الارتباط" : "Cookie notice"}
      className="fixed bottom-4 inset-x-4 md:inset-x-auto md:end-6 md:bottom-6 md:max-w-md z-[60] card-base p-4 shadow-2xl border border-border/60 backdrop-blur-md bg-background/95"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Cookie size={18} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold mb-1">
            {lang === "ar" ? "نستخدم تخزيناً أساسياً فقط" : "We use essential storage only"}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            {lang === "ar"
              ? "نستخدم تخزيناً ضرورياً فقط لتذكر تسجيل دخولك وتفضيلاتك. لا نستخدم أي أدوات تتبع أو إعلانات."
              : "We only use essential storage to remember your login and preferences. We don't use any tracking or advertising tools."}{" "}
            <Link to="/privacy" className="text-primary font-semibold hover:underline">
              {lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
            </Link>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={accept}
              className="px-4 py-1.5 rounded-full text-xs font-bold bg-primary text-primary-foreground hover:bg-primary-dark transition-colors"
            >
              {lang === "ar" ? "موافق" : "Got it"}
            </button>
          </div>
        </div>
        <button
          onClick={accept}
          aria-label={lang === "ar" ? "إغلاق" : "Close"}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
