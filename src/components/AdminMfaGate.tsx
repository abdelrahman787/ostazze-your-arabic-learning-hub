import { useCallback, useEffect, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type Stage =
  | { kind: "loading" }
  | { kind: "ok" }
  | { kind: "codes"; codes: string[] }
  | { kind: "enroll"; factorId: string; qr: string; secret: string }
  | { kind: "verify"; factorId: string }
  | { kind: "error"; message: string };

const getClient = () =>
  import("@/integrations/supabase/client").then((m) => m.supabase);

/**
 * Admins must hold a two-step verified (aal2) session. The database and admin
 * functions enforce this too; this screen lets admins enroll or verify.
 */
const AdminMfaGate = ({ children }: { children: React.ReactNode }) => {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const [stage, setStage] = useState<Stage>({ kind: "loading" });
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [recovery, setRecovery] = useState(false);

  // After a verified session, issue recovery codes once if none remain.
  const afterVerified = useCallback(async () => {
    try {
      const m = await import("@/lib/adminRecovery.functions");
      const { remaining } = await m.getRecoveryStatus();
      if (remaining > 0) return setStage({ kind: "ok" });
      const { codes } = await m.generateRecoveryCodes();
      setStage({ kind: "codes", codes });
    } catch {
      setStage({ kind: "ok" });
    }
  }, []);

  const resolve = useCallback(async () => {
    const supabase = await getClient();
    const { data: aal } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal?.currentLevel === "aal2") return void afterVerified();
    const { data: factors, error } = await supabase.auth.mfa.listFactors();
    if (error) return setStage({ kind: "error", message: error.message });
    const verified = factors?.totp?.find((f) => f.status === "verified");
    if (verified) return setStage({ kind: "verify", factorId: verified.id });
    // Clean up abandoned enrollments before starting a new one.
    for (const f of factors?.all ?? []) {
      if (f.status !== "verified")
        await supabase.auth.mfa.unenroll({ factorId: f.id });
    }
    const { data, error: enrollErr } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: `admin-${Date.now()}`,
    });
    if (enrollErr || !data)
      return setStage({
        kind: "error",
        message: enrollErr?.message ?? "Enrollment failed",
      });
    setStage({
      kind: "enroll",
      factorId: data.id,
      qr: data.totp.qr_code,
      secret: data.totp.secret,
    });
  }, [afterVerified]);

  useEffect(() => {
    void resolve();
  }, [resolve]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stage.kind !== "enroll" && stage.kind !== "verify") return;
    setBusy(true);
    setErr("");
    if (recovery) {
      const m = await import("@/lib/adminRecovery.functions");
      const res = await m
        .redeemRecoveryCode({ data: { code } })
        .catch(() => ({ ok: false }) as { ok: boolean; limited?: boolean });
      setBusy(false);
      if (!res.ok) {
        setErr(
          "limited" in res && res.limited
            ? ar
              ? "محاولات كثيرة. انتظر 15 دقيقة."
              : "Too many attempts. Wait 15 minutes."
            : ar
              ? "رمز الاسترداد غير صالح أو مستخدم."
              : "Recovery code is invalid or already used.",
        );
        return;
      }
      setCode("");
      setRecovery(false);
      setStage({ kind: "loading" });
      return void resolve();
    }
    const supabase = await getClient();
    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId: stage.factorId,
      code: code.trim(),
    });
    setBusy(false);
    if (error) {
      setErr(
        ar ? "الرمز غير صحيح، حاول مرة أخرى." : "Invalid code, try again.",
      );
      return;
    }
    setCode("");
    setStage({ kind: "loading" });
    void afterVerified();
  };

  if (stage.kind === "ok") return <>{children}</>;

  return (
    <div className="min-h-screen pt-page flex items-start justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card text-card-foreground border border-border rounded-2xl p-6 sm:p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <span
            className="icon-box bg-primary/10 text-primary shrink-0"
            aria-hidden="true"
          >
            <ShieldCheck size={20} />
          </span>
          <h1 className="text-lg font-extrabold">
            {ar ? "التحقق بخطوتين للمشرفين" : "Admin two-step verification"}
          </h1>
        </div>

        {stage.kind === "loading" && (
          <div className="flex justify-center py-8" role="status">
            <Loader2 className="animate-spin text-primary" size={28} />
            <span className="sr-only">{ar ? "جارٍ التحميل" : "Loading"}</span>
          </div>
        )}

        {stage.kind === "error" && (
          <p role="alert" className="text-sm text-destructive">
            {stage.message}
          </p>
        )}

        {stage.kind === "codes" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {ar
                ? "احفظ رموز الاسترداد هذه في مكان آمن. كل رمز يُستخدم مرة واحدة إذا فقدت تطبيق المصادقة. لن تظهر مرة أخرى."
                : "Save these recovery codes somewhere safe. Each works once if you lose your authenticator. They won't be shown again."}
            </p>
            <ul
              className="grid grid-cols-2 gap-2 rounded-xl bg-background p-3 border border-border font-mono text-sm text-foreground"
              dir="ltr"
            >
              {stage.codes.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setStage({ kind: "ok" })}
              className="btn-primary w-full"
            >
              {ar ? "حفظتها، متابعة" : "I've saved them, continue"}
            </button>
          </div>
        )}

        {(stage.kind === "enroll" || stage.kind === "verify") && (
          <form onSubmit={submit} className="space-y-4">
            {stage.kind === "enroll" ? (
              <>
                <p className="text-sm text-muted-foreground">
                  {ar
                    ? "حساب المشرف يتطلب التحقق بخطوتين. امسح الرمز بتطبيق مصادقة (Google Authenticator أو غيره) ثم أدخل الرمز المكوّن من 6 أرقام."
                    : "Admin accounts require two-step verification. Scan this code with an authenticator app, then enter the 6-digit code."}
                </p>
                <div className="flex justify-center rounded-xl bg-background p-3 border border-border">
                  <img
                    src={stage.qr}
                    alt={ar ? "رمز QR للمصادقة" : "Authenticator QR code"}
                    width={180}
                    height={180}
                  />
                </div>
                <p className="text-xs text-muted-foreground break-all">
                  {ar
                    ? "أو أدخل المفتاح يدويًا:"
                    : "Or enter the key manually:"}{" "}
                  <code className="text-foreground">{stage.secret}</code>
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                {recovery
                  ? ar
                    ? "أدخل أحد رموز الاسترداد. بعدها ستضبط تطبيق مصادقة جديدًا."
                    : "Enter one of your recovery codes. You'll then set up a new authenticator."
                  : ar
                    ? "أدخل الرمز المكوّن من 6 أرقام من تطبيق المصادقة."
                    : "Enter the 6-digit code from your authenticator app."}
              </p>
            )}
            <div>
              <label
                htmlFor="mfa-code"
                className="block text-sm font-bold mb-1.5"
              >
                {ar ? "رمز التحقق" : "Verification code"}
              </label>
              <input
                id="mfa-code"
                inputMode={recovery ? "text" : "numeric"}
                autoComplete="one-time-code"
                pattern={recovery ? undefined : "[0-9]{6}"}
                maxLength={recovery ? 11 : 6}
                required
                value={code}
                onChange={(e) =>
                  setCode(
                    recovery
                      ? e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "")
                      : e.target.value.replace(/\D/g, ""),
                  )
                }
                className="input-base tracking-widest text-center"
                dir="ltr"
              />
              {err && (
                <p role="alert" className="text-sm text-destructive mt-2">
                  {err}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={
                busy || (recovery ? code.length < 10 : code.length !== 6)
              }
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {busy && <Loader2 size={14} className="animate-spin" />}
              {ar ? "تحقق" : "Verify"}
            </button>
            {stage.kind === "verify" && (
              <button
                type="button"
                onClick={() => {
                  setRecovery((r) => !r);
                  setCode("");
                  setErr("");
                }}
                className="w-full text-sm text-primary-dark dark:text-primary underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {recovery
                  ? ar
                    ? "استخدام تطبيق المصادقة"
                    : "Use authenticator app"
                  : ar
                    ? "فقدت تطبيق المصادقة؟ استخدم رمز استرداد"
                    : "Lost your authenticator? Use a recovery code"}
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminMfaGate;
