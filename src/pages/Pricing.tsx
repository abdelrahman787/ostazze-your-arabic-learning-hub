import { Link } from "react-router-dom";
import { Check, Clock, Globe } from "lucide-react";
import PageHelmet from "@/components/PageHelmet";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVisitorCountry } from "@/hooks/useVisitorCountry";
import { CURRENCIES, formatPrice } from "@/lib/pricing";

export default function Pricing() {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const { country, loading } = useVisitorCountry();
  const meta = CURRENCIES[country];

  const features = ar
    ? ["جلسة مباشرة أونلاين لمدة ساعة كاملة", "معلم متخصص في مادتك الجامعية", "اختر الموعد المناسب لك", "دفع آمن ومشفّر"]
    : ["Full one-hour live online session", "Tutor specialised in your university subject", "Pick the time that suits you", "Secure, encrypted payment"];

  return (
    <div className="min-h-screen pb-16">
      <PageHelmet
        title={ar ? "الأسعار — استاذي" : "Pricing — OSTAZE"}
        description={ar ? "سعر الساعة الواحدة مع معلمي استاذي." : "Hourly price for live sessions with OSTAZE tutors."}
      />
      <PageHeader title={ar ? "الأسعار" : "Pricing"} subtitle={ar ? "سعر واضح وبسيط لكل ساعة" : "Simple, clear hourly pricing"} variant="teachers" />

      <div className="container max-w-md mx-auto px-4 mt-10">
        <div className="card-base p-8 text-center border-2 border-primary">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <Clock size={24} />
          </div>
          <h2 className="text-lg font-extrabold">{ar ? "ساعة واحدة" : "One hour"}</h2>
          <div className={`text-4xl font-black text-primary my-4 ${loading ? "opacity-50" : ""}`} aria-live="polite">
            {formatPrice(country, ar ? "ar" : "en")}
          </div>
          <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
            <Globe size={12} /> {meta.flag} {ar ? `السعر بعملة ${meta.ar}` : `Price shown for ${meta.en}`}
          </p>
          <ul className="text-start space-y-3 my-6">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check size={16} className="text-primary mt-0.5 shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <Link to="/teachers" className="btn-primary w-full inline-block">
            {ar ? "احجز جلستك الآن" : "Book your session"}
          </Link>
          {country !== "EG" && (
            <p className="text-[11px] text-muted-foreground mt-4">
              {ar ? "يتم الدفع بالجنيه المصري بما يعادل السعر أعلاه: " : "Charged in Egyptian pounds, equivalent to: "}
              {formatPrice("EG", ar ? "ar" : "en")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
