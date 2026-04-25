import { useSearchParams, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle } from "lucide-react";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import NoIndex from "@/components/NoIndex";

export default function CheckoutReturn() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { t } = useLanguage();

  return (
    <>
      <NoIndex title="Checkout" />
      <PaymentTestModeBanner />
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="card-base p-8 max-w-md text-center space-y-4">
          {sessionId ? (
            <>
              <CheckCircle className="mx-auto text-success" size={48} />
              <h1 className="text-2xl font-extrabold">{t("payment_success_title") || "Payment Successful!"}</h1>
              <p className="text-muted-foreground">{t("payment_success_msg") || "Your session has been confirmed. You'll receive a notification with the details."}</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-extrabold">{t("payment_error_title") || "Something went wrong"}</h1>
              <p className="text-muted-foreground">{t("payment_error_msg") || "No session information found."}</p>
            </>
          )}
          <Link to="/dashboard" className="btn-primary inline-block mt-4">
            {t("go_to_dashboard") || "Go to Dashboard"}
          </Link>
        </div>
      </div>
    </>
  );
}
