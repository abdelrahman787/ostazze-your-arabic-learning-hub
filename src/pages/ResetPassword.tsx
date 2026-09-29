import { FormEvent, useEffect, useState } from "react";
import { Link } from "@/lib/router-compat";
import { AlertCircle, KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import NoIndex from "@/components/NoIndex";
import { getRecoveryAuthClient } from "@/lib/recoveryAuth";
import { clearRecoveryMarker, hasValidRecoveryMarker } from "@/lib/passwordRecovery";

type RecoveryState = "checking" | "valid" | "invalid";

const ResetPassword = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [saving, setSaving] = useState(false);
  const [recoveryState, setRecoveryState] = useState<RecoveryState>("checking");

  useEffect(() => {
    let active = true;
    const auth = getRecoveryAuthClient().auth;
    void auth.getUser().then(({ data, error }) => {
      if (!active) return;
      const userId = data.user?.id;
      setRecoveryState(
        !error && typeof userId === "string" && hasValidRecoveryMarker(window.sessionStorage, userId)
          ? "valid"
          : "invalid",
      );
    });
    return () => {
      active = false;
    };
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (saving || recoveryState !== "valid") return;
    if (password.length < 8)
      return toast.error(
        isAr
          ? "كلمة المرور يجب ألا تقل عن ٨ أحرف"
          : "Password must be at least 8 characters",
      );
    if (password !== confirmation)
      return toast.error(
        isAr ? "كلمتا المرور غير متطابقتين" : "Passwords do not match",
      );
    setSaving(true);
    const auth = getRecoveryAuthClient().auth;
    const { error } = await auth.updateUser({ password });
    if (error) {
      setSaving(false);
      toast.error(isAr ? "تعذر تحديث كلمة المرور. اطلب رابطًا جديدًا." : "We couldn't update your password. Request a new reset link.");
      return;
    }
    clearRecoveryMarker(window.sessionStorage);
    await auth.signOut({ scope: "global" });
    toast.success(isAr ? "تم تعيين كلمة المرور. سجّل الدخول من جديد." : "Password updated. Sign in again.");
    window.location.replace("/login");
  };

  if (recoveryState !== "valid") {
    return (
      <main className="hero-gradient min-h-screen flex items-center justify-center p-4">
        <NoIndex title={isAr ? "إعادة تعيين كلمة المرور" : "Reset Password"} />
        <section className="card-base p-8 w-full max-w-md text-center" aria-live="polite">
          {recoveryState === "checking" ? (
            <>
              <Loader2 className="mx-auto mb-4 animate-spin text-primary" size={32} aria-hidden="true" />
              <h1 className="text-2xl font-extrabold">{isAr ? "جارٍ التحقق من الجلسة" : "Checking your recovery session"}</h1>
            </>
          ) : (
            <>
              <AlertCircle className="mx-auto mb-4 text-destructive" size={32} aria-hidden="true" />
              <h1 className="text-2xl font-extrabold">{isAr ? "الرابط غير صالح أو منتهي" : "Invalid or expired reset link"}</h1>
              <p className="mt-2 mb-6 text-sm text-muted-foreground">
                {isAr ? "رابط إعادة تعيين كلمة المرور غير صالح أو منتهي. اطلب رابطًا جديدًا." : "This password reset link is invalid or expired. Request a new link."}
              </p>
              <Link to="/forgot-password" className="btn-primary inline-flex">{isAr ? "طلب رابط جديد" : "Request a new link"}</Link>
            </>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="hero-gradient min-h-screen flex items-center justify-center p-4">
      <NoIndex title={isAr ? "إعادة تعيين كلمة المرور" : "Reset Password"} />
      <form
        onSubmit={submit}
        className="card-base p-8 w-full max-w-md space-y-5"
      >
        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <KeyRound size={26} />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-extrabold">
            {isAr ? "تعيين كلمة مرور جديدة" : "Set a new password"}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {isAr
              ? "اكتب كلمة المرور التي ستستخدمها للدخول إلى حسابك."
              : "Choose the password you will use to access your account."}
          </p>
        </div>
        <input
          className="input-base"
          type="password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isAr ? "كلمة المرور الجديدة" : "New password"}
          required
        />
        <input
          className="input-base"
          type="password"
          minLength={8}
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          placeholder={isAr ? "تأكيد كلمة المرور" : "Confirm password"}
          required
        />
        <button
          className="btn-primary w-full flex items-center justify-center gap-2"
          disabled={saving}
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {isAr ? "حفظ كلمة المرور" : "Save password"}
        </button>
      </form>
    </main>
  );
};

export default ResetPassword;
