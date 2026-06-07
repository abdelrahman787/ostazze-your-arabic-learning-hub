import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, ArrowLeft, Loader2, Calendar, Clock, BookOpen, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { getDisplayPrice, getCheckoutAmountEGP, formatPrice, type Country } from "@/lib/pricing";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import PageHelmet from "@/components/PageHelmet";
import { toast } from "sonner";

interface CheckoutState {
  teacherId: string;
  teacherName: string;
  subject?: string;
  date: string;
  time: string;
  notes?: string;
}

export default function Checkout() {
  const { state } = useLocation() as { state: CheckoutState | null };
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { t, lang } = useLanguage();

  const [country, setCountry] = useState<Country | null>(null);
  const [loadingCountry, setLoadingCountry] = useState(true);
  const [payNow, setPayNow] = useState(false);

  useEffect(() => {
    if (!state || !isLoggedIn) return;
    supabase
      .from("profiles")
      .select("country")
      .eq("user_id", user!.id)
      .maybeSingle()
      .then(({ data }) => {
        setCountry((data?.country as Country) ?? "EG");
        setLoadingCountry(false);
      });
  }, [state, isLoggedIn, user?.id]);

  // No booking data → redirect
  if (!state) {
    return (
      <div className="min-h-screen pt-page flex items-center justify-center p-4">
        <PageHelmet title="Checkout" noindex />
        <div className="card-base p-8 max-w-md text-center space-y-3">
          <h1 className="text-xl font-extrabold">
            {lang === "ar" ? "لا توجد بيانات حجز" : "No booking data"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {lang === "ar"
              ? "من فضلك ابدأ الحجز من صفحة المعلم."
              : "Please start your booking from a teacher's page."}
          </p>
          <Link to="/teachers" className="btn-primary inline-block">
            {lang === "ar" ? "تصفح المعلمين" : "Browse teachers"}
          </Link>
        </div>
      </div>
    );
  }

  const display = getDisplayPrice(country);
  const egpAmount = getCheckoutAmountEGP(country);
  const amountInCents = Math.round(egpAmount * 100);

  return (
    <div className="min-h-screen pt-page pb-12 bg-gradient-to-b from-background to-secondary/30">
      <PageHelmet
        title={lang === "ar" ? "إتمام الدفع — أستازي" : "Checkout — OSTAZE"}
        description={lang === "ar" ? "إتمام دفع الجلسة" : "Complete your session payment"}
        noindex
      />

      <div className="container max-w-5xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> {lang === "ar" ? "رجوع" : "Back"}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
          {/* LEFT — Payment area */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-base p-6 lg:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                <CreditCard size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold">
                  {lang === "ar" ? "إتمام الدفع" : "Complete payment"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {lang === "ar"
                    ? "اختر طريقة الدفع المناسبة"
                    : "Choose your payment method"}
                </p>
              </div>
            </div>

            {!payNow ? (
              <div className="space-y-4">
                <div className="rounded-2xl border-2 border-dashed border-border p-6 text-center bg-secondary/40">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {lang === "ar"
                      ? "بوابة الدفع قيد التجهيز. "
                      : "Payment gateway is being set up. You can proceed with the Stripe test integration for now — it will be replaced with the final gateway later."}
                  </p>
                  <button
                    onClick={() => setPayNow(true)}
                    disabled={loadingCountry}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    {loadingCountry && <Loader2 size={16} className="animate-spin" />}
                    {lang === "ar" ? "ادفع الآن" : "Pay now"}
                  </button>
                </div>

                <div className="text-[12px] text-muted-foreground text-center whitespace-pre-line">
                  {lang === "ar" ? "\n" : "🔒 Secure & encrypted payment"}
                </div>
              </div>
            ) : (
              <StripeEmbeddedCheckout
                amountInCents={amountInCents}
                currency="egp"
                teacherName={state.teacherName}
                subject={state.subject}
                customerEmail={user?.email || undefined}
                userId={user?.id}
                returnUrl={`${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`}
              />
            )}
          </motion.div>

          {/* RIGHT — Order summary */}
          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="card-base p-6 h-fit lg:sticky lg:top-24"
          >
            <h2 className="text-lg font-extrabold mb-4">
              {lang === "ar" ? "ملخص الطلب" : "Order summary"}
            </h2>

            <div className="space-y-3 text-sm">
              <Row icon={<User size={14} />} label={lang === "ar" ? "المعلم" : "Teacher"} value={state.teacherName} />
              {state.subject && (
                <Row icon={<BookOpen size={14} />} label={lang === "ar" ? "المادة" : "Subject"} value={state.subject} />
              )}
              <Row icon={<Calendar size={14} />} label={lang === "ar" ? "التاريخ" : "Date"} value={state.date} />
              <Row icon={<Clock size={14} />} label={lang === "ar" ? "الوقت" : "Time"} value={state.time} />
            </div>

            <div className="border-t border-border my-5" />

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {lang === "ar" ? "سعر الجلسة" : "Session price"}
                </span>
                <span className="font-bold">
                  {egpAmount.toFixed(2)} {lang === "ar" ? "ج.م" : "EGP"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-border">
                <span className="font-extrabold">{lang === "ar" ? "الإجمالي" : "Total"}</span>
                <span className="text-xl font-extrabold text-primary">
                  {egpAmount.toFixed(2)} {lang === "ar" ? "ج.م" : "EGP"}
                </span>
              </div>
            </div>


            <p className="text-[11px] text-muted-foreground mt-5 leading-relaxed">
              {t("checkout_terms_agree")}{" "}
              <Link to="/terms" className="text-primary hover:underline">{t("checkout_terms_link")}</Link>
              {" · "}
              <Link to="/refund" className="text-primary hover:underline">{t("checkout_refund_link")}</Link>
            </p>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">{icon} {label}</span>
      <span className="font-semibold text-end">{value}</span>
    </div>
  );
}
