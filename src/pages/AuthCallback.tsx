import { useEffect, useState } from "react";
import { Link } from "@/lib/router-compat";
import { AlertCircle, Loader2 } from "lucide-react";
import NoIndex from "@/components/NoIndex";
import { getRecoveryAuthClient } from "@/lib/recoveryAuth";
import { completeRecoveryCallback } from "@/lib/passwordRecovery";
import { useLanguage } from "@/contexts/LanguageContext";

type CallbackState = "working" | "invalid";

const AuthCallback = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [state, setState] = useState<CallbackState>("working");

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(window.location.search);
    void completeRecoveryCallback(
      getRecoveryAuthClient().auth,
      window.sessionStorage,
      { code: params.get("code"), next: params.get("next") },
    ).then((result) => {
      if (!active) return;
      if (result.ok) {
        window.location.replace(result.next);
        return;
      }
      window.history.replaceState({}, "", "/auth/callback");
      setState("invalid");
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="hero-gradient min-h-screen flex items-center justify-center p-4">
      <NoIndex title={isAr ? "استعادة الحساب" : "Account recovery"} />
      <section
        className="card-base p-8 w-full max-w-md text-center"
        aria-live="polite"
      >
        {state === "working" ? (
          <>
            <Loader2
              className="mx-auto mb-4 animate-spin text-primary"
              size={32}
              aria-hidden="true"
            />
            <h1 className="text-2xl font-extrabold">
              {isAr ? "جارٍ التحقق من الرابط" : "Checking your reset link"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isAr ? "يرجى الانتظار لحظة." : "Please wait a moment."}
            </p>
          </>
        ) : (
          <>
            <AlertCircle
              className="mx-auto mb-4 text-destructive"
              size={32}
              aria-hidden="true"
            />
            <h1 className="text-2xl font-extrabold">
              {isAr
                ? "رابط غير صالح أو منتهي"
                : "Invalid or expired reset link"}
            </h1>
            <p className="mt-2 mb-6 text-sm text-muted-foreground">
              {isAr
                ? "رابط إعادة تعيين كلمة المرور غير صالح أو منتهي. اطلب رابطًا جديدًا."
                : "This password reset link is invalid or expired. Request a new link."}
            </p>
            <Link to="/forgot-password" className="btn-primary inline-flex">
              {isAr ? "طلب رابط جديد" : "Request a new link"}
            </Link>
          </>
        )}
      </section>
    </main>
  );
};

export default AuthCallback;
