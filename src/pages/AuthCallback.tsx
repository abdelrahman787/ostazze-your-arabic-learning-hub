import { useEffect, useState } from "react";
import { Link } from "@/lib/router-compat";
import { AlertCircle, Loader2 } from "lucide-react";
import NoIndex from "@/components/NoIndex";
import { getRecoveryAuthClient } from "@/lib/recoveryAuth";
import { completeRecoveryCallback } from "@/lib/passwordRecovery";
import { useLanguage } from "@/contexts/LanguageContext";

type CallbackState = "working" | "invalid" | "mismatch";

const AuthCallback = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [state, setState] = useState<CallbackState>("working");

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(window.location.search);
    const client = getRecoveryAuthClient();
    // supabase-js stores the PKCE verifier under `${storageKey}-code-verifier`.
    const ref = new URL(import.meta.env.VITE_SUPABASE_URL).hostname.split(
      ".",
    )[0];
    const verifierKey = `sb-${ref}-auth-token-code-verifier`;
    void (async () => {
      const verifier = window.localStorage.getItem(verifierKey);
      // Diagnostics only: never logs the code, verifier or tokens.
      console.info(
        "[recovery] callback origin:",
        window.location.origin,
        "verifier present:",
        Boolean(verifier),
      );
      if (!verifier) {
        console.info(
          "[recovery] exchange skipped: no verifier on this origin (request was made on a different origin)",
        );
        window.history.replaceState({}, "", "/auth/callback");
        if (active) setState("mismatch");
        return;
      }
      const result = await completeRecoveryCallback(
        client.auth,
        window.sessionStorage,
        {
          code: params.get("code"),
          next: params.get("next"),
        },
      );
      console.info(
        "[recovery] exchange result:",
        result.ok ? "success" : "failed",
      );
      if (!active) return;
      if (result.ok) {
        window.location.replace(result.next);
        return;
      }
      window.history.replaceState({}, "", "/auth/callback");
      setState("invalid");
    })();
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
              {state === "mismatch"
                ? isAr
                  ? `فُتح الرابط على عنوان مختلف عن الذي طُلب منه (${typeof window !== "undefined" ? window.location.origin : ""}). اطلب رابطًا جديدًا من هذا العنوان نفسه وافتحه في نفس المتصفح.`
                  : `This link opened on a different address than the one it was requested from (${typeof window !== "undefined" ? window.location.origin : ""}). Request a new link from this same address and open it in the same browser.`
                : isAr
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
