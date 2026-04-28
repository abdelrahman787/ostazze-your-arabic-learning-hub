import { useSearchParams, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle, Mail } from "lucide-react";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import NoIndex from "@/components/NoIndex";

export default function CheckoutReturn() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { t, lang } = useLanguage();

  return (
    <>
      <NoIndex title="Checkout" />
      <PaymentTestModeBanner />
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="card-base p-8 max-w-md text-center space-y-4">
          {sessionId ? (
            <>
              <CheckCircle className="mx-auto text-success" size={56} />
              <h1 className="text-2xl font-extrabold">
                {lang === "ar" ? "تم حجز المحاضرة بنجاح ✅" : "Lecture booked successfully ✅"}
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                {lang === "ar"
                  ? "تم استلام الدفع وحجز المحاضرة. ستصلك رسالة على بريدك الإلكتروني بالتفاصيل ورابط المحاضرة فور تأكيد الإدارة وتعيين المدرس المناسب."
                  : "Payment received and your lecture is booked. You'll get an email with the details and meeting link as soon as the admin confirms and assigns a tutor."}
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-secondary/60 rounded-xl py-2.5 px-3">
                <Mail size={14} className="text-primary" />
                {lang === "ar" ? "راجع بريدك الإلكتروني خلال الساعات القادمة" : "Check your email in the next few hours"}
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-extrabold">{t("payment_error_title") || "Something went wrong"}</h1>
              <p className="text-muted-foreground">{t("payment_error_msg") || "No session information found."}</p>
            </>
          )}
          <Link to="/my-bookings" className="btn-primary inline-block mt-4">
            {lang === "ar" ? "حجوزاتي" : "My bookings"}
          </Link>
          <p className="text-[11px] text-muted-foreground mt-4 leading-relaxed">
            {t("checkout_terms_agree")}{" "}
            <Link to="/terms" className="text-primary hover:underline">{t("checkout_terms_link")}</Link>
            {" · "}
            <Link to="/refund" className="text-primary hover:underline">{t("checkout_refund_link")}</Link>
          </p>
        </div>
      </div>
    </>
  );
}
