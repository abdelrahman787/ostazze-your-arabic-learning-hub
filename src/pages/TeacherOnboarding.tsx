import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, User, Landmark, CheckCircle2, Loader2, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import PageHelmet from "@/components/PageHelmet";
import NoIndex from "@/components/NoIndex";

const STEPS = 3;

const TeacherOnboarding = () => {
  const { user, loading } = useAuth();
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  // Step 1 — password
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  // Step 2 — profile
  const [profile, setProfile] = useState({ full_name: "", phone: "", bio: "", university: "", price: "" });

  // Step 3 — bank
  const [bank, setBank] = useState({
    account_holder: "",
    bank_name: "",
    country: "",
    iban: "",
    account_number: "",
    swift: "",
  });
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    if (!loading && !user) navigate("/login", { replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: p }, { data: tp }, { data: ba }] = await Promise.all([
        supabase.from("profiles").select("full_name, phone, bio").eq("user_id", user.id).maybeSingle(),
        supabase.from("teacher_profiles").select("university, price").eq("user_id", user.id).maybeSingle(),
        supabase.from("teacher_bank_accounts").select("*").eq("user_id", user.id).maybeSingle(),
      ]);
      setProfile({
        full_name: p?.full_name || user.name || "",
        phone: p?.phone || "",
        bio: p?.bio || "",
        university: tp?.university || "",
        price: tp?.price != null ? String(tp.price) : "",
      });
      if (ba) {
        setBank({
          account_holder: ba.account_holder || "",
          bank_name: ba.bank_name || "",
          country: ba.country || "",
          iban: ba.iban || "",
          account_number: ba.account_number || "",
          swift: ba.swift || "",
        });
        setBalance(Number(ba.balance || 0));
      }
    })();
  }, [user]);

  const T = (ar: string, en: string) => (isAr ? ar : en);

  const savePassword = async () => {
    if (pw.length < 8) return toast.error(T("كلمة المرور يجب ألا تقل عن ٨ أحرف", "Password must be at least 8 characters"));
    if (pw !== pw2) return toast.error(T("كلمتا المرور غير متطابقتين", "Passwords do not match"));
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(T("تم تعيين كلمة المرور", "Password updated"));
    setStep(2);
  };

  const saveProfile = async () => {
    if (!user) return;
    if (!profile.full_name.trim()) return toast.error(T("الاسم مطلوب", "Name is required"));
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: profile.full_name, phone: profile.phone || null, bio: profile.bio || null })
      .eq("user_id", user.id);
    if (!error) {
      const { data: existing } = await supabase
        .from("teacher_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      const payload = {
        university: profile.university || null,
        price: profile.price ? Number(profile.price) : 0,
      };
      if (existing) await supabase.from("teacher_profiles").update(payload).eq("user_id", user.id);
      else await supabase.from("teacher_profiles").insert({ user_id: user.id, verified: true, ...payload });
    }
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(T("تم حفظ الملف الشخصي", "Profile saved"));
    setStep(3);
  };

  const saveBank = async () => {
    if (!user) return;
    if (!bank.account_holder.trim() || !bank.bank_name.trim())
      return toast.error(T("اسم صاحب الحساب واسم البنك مطلوبان", "Account holder and bank name are required"));
    if (!bank.iban.trim() && !bank.account_number.trim())
      return toast.error(T("أدخل رقم الآيبان أو رقم الحساب", "Enter an IBAN or an account number"));
    setSaving(true);
    const { error } = await supabase.from("teacher_bank_accounts").upsert(
      {
        user_id: user.id,
        account_holder: bank.account_holder,
        bank_name: bank.bank_name,
        country: bank.country || null,
        iban: bank.iban || null,
        account_number: bank.account_number || null,
        swift: bank.swift || null,
      },
      { onConflict: "user_id" }
    );
    if (!error) await supabase.from("profiles").update({ onboarding_completed: true }).eq("user_id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(T("تم حفظ بيانات الحساب البنكي", "Payout details saved"));
    setDone(true);
  };

  const stepMeta = [
    { icon: Lock, label: T("كلمة المرور", "Password") },
    { icon: User, label: T("الملف الشخصي", "Profile") },
    { icon: Landmark, label: T("الحساب البنكي", "Bank account") },
  ];

  const input = "input-base w-full";
  const lbl = "block text-sm font-bold mb-1.5";

  return (
    <div>
      <NoIndex />
      <PageHelmet
        title={T("إكمال حساب المعلم - أستاذي", "Complete your teacher account - Ostaze")}
        description={T("أكمل خطوات تفعيل حسابك كمعلم في أستاذي.", "Finish activating your Ostaze teacher account.")}
      />

      <header className="pt-page bg-gradient-to-b from-primary/10 via-background to-background border-b border-border">
        <div className="container py-10 max-w-3xl">
          <span className="inline-block text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-primary/15 text-primary">
            {T("تم قبولك 🎉", "You're accepted 🎉")}
          </span>
          <h1 className="mt-4 text-3xl font-bold">{T("أكمل تفعيل حسابك كمعلم", "Complete your teacher setup")}</h1>
          <p className="mt-2 text-muted-foreground">
            {T(
              "ثلاث خطوات بسيطة: كلمة المرور، الملف الشخصي، ثم بيانات الحساب البنكي لاستلام أرباحك.",
              "Three quick steps: set your password, complete your profile, then add your bank details to receive payouts."
            )}
          </p>
        </div>
      </header>

      <div className="container py-10 max-w-3xl space-y-6">
        {/* Stepper */}
        <div className="flex items-center gap-3">
          {stepMeta.map((s, i) => {
            const n = i + 1;
            const active = done || step >= n;
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex items-center gap-3 flex-1">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon size={18} />
                </div>
                <span className={`text-sm font-bold ${active ? "" : "text-muted-foreground"}`}>{s.label}</span>
                {n < STEPS && <div className="h-px flex-1 bg-border" />}
              </div>
            );
          })}
        </div>

        {done ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-base p-10 text-center space-y-4">
            <CheckCircle2 size={44} className="mx-auto text-primary" />
            <h2 className="text-2xl font-black">{T("تم تفعيل حسابك", "Your account is ready")}</h2>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary font-bold">
              <Wallet size={16} /> {T("رصيدك الحالي", "Current balance")}: {balance.toFixed(2)}
            </div>
            <div>
              <button onClick={() => navigate("/dashboard")} className="btn-primary mt-2">
                {T("الذهاب إلى لوحة التحكم", "Go to dashboard")}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-base p-6 md:p-8 space-y-5">
            {step === 1 && (
              <>
                <h2 className="text-lg font-black">{T("تعيين كلمة مرور جديدة", "Set a new password")}</h2>
                <div>
                  <label className={lbl} htmlFor="pw">{T("كلمة المرور الجديدة", "New password")}</label>
                  <input id="pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} className={input} autoComplete="new-password" />
                </div>
                <div>
                  <label className={lbl} htmlFor="pw2">{T("تأكيد كلمة المرور", "Confirm password")}</label>
                  <input id="pw2" type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} className={input} autoComplete="new-password" />
                </div>
                <button onClick={savePassword} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
                  {saving && <Loader2 size={16} className="animate-spin" />} {T("حفظ ومتابعة", "Save and continue")}
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-lg font-black">{T("بيانات ملفك الشخصي", "Your profile")}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={lbl} htmlFor="fn">{T("الاسم الكامل", "Full name")}</label>
                    <input id="fn" value={profile.full_name} onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))} className={input} />
                  </div>
                  <div>
                    <label className={lbl} htmlFor="ph">{T("رقم الجوال", "Phone")}</label>
                    <input id="ph" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} className={input} />
                  </div>
                  <div>
                    <label className={lbl} htmlFor="uni">{T("الجامعة", "University")}</label>
                    <input id="uni" value={profile.university} onChange={(e) => setProfile((p) => ({ ...p, university: e.target.value }))} className={input} />
                  </div>
                  <div>
                    <label className={lbl} htmlFor="price">{T("سعر الساعة", "Hourly rate")}</label>
                    <input id="price" type="number" min="0" value={profile.price} onChange={(e) => setProfile((p) => ({ ...p, price: e.target.value }))} className={input} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={lbl} htmlFor="bio">{T("نبذة عنك", "Short bio")}</label>
                    <textarea id="bio" rows={4} value={profile.bio} onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))} className={`${input} resize-none`} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-ghost px-5">{T("رجوع", "Back")}</button>
                  <button onClick={saveProfile} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    {saving && <Loader2 size={16} className="animate-spin" />} {T("حفظ ومتابعة", "Save and continue")}
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-lg font-black">{T("بيانات الحساب البنكي", "Bank / payout details")}</h2>
                <p className="text-sm text-muted-foreground">
                  {T(
                    "تُستخدم هذه البيانات لتحويل أرباحك من الحصص. يمكنك تعديلها لاحقاً من لوحة التحكم.",
                    "We use these details to transfer your session earnings. You can update them later from your dashboard."
                  )}
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={lbl} htmlFor="ah">{T("اسم صاحب الحساب", "Account holder")}</label>
                    <input id="ah" value={bank.account_holder} onChange={(e) => setBank((b) => ({ ...b, account_holder: e.target.value }))} className={input} />
                  </div>
                  <div>
                    <label className={lbl} htmlFor="bn">{T("اسم البنك", "Bank name")}</label>
                    <input id="bn" value={bank.bank_name} onChange={(e) => setBank((b) => ({ ...b, bank_name: e.target.value }))} className={input} />
                  </div>
                  <div>
                    <label className={lbl} htmlFor="bc">{T("دولة البنك", "Bank country")}</label>
                    <input id="bc" value={bank.country} onChange={(e) => setBank((b) => ({ ...b, country: e.target.value }))} className={input} />
                  </div>
                  <div>
                    <label className={lbl} htmlFor="sw">{T("سويفت / BIC (اختياري)", "SWIFT / BIC (optional)")}</label>
                    <input id="sw" value={bank.swift} onChange={(e) => setBank((b) => ({ ...b, swift: e.target.value }))} className={input} />
                  </div>
                  <div>
                    <label className={lbl} htmlFor="ib">IBAN</label>
                    <input id="ib" value={bank.iban} onChange={(e) => setBank((b) => ({ ...b, iban: e.target.value }))} className={input} />
                  </div>
                  <div>
                    <label className={lbl} htmlFor="an">{T("رقم الحساب", "Account number")}</label>
                    <input id="an" value={bank.account_number} onChange={(e) => setBank((b) => ({ ...b, account_number: e.target.value }))} className={input} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm p-3 rounded-xl bg-muted">
                  <Wallet size={16} className="text-primary" />
                  <span className="font-bold">{T("رصيدك الحالي", "Current balance")}: {balance.toFixed(2)}</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-ghost px-5">{T("رجوع", "Back")}</button>
                  <button onClick={saveBank} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    {saving && <Loader2 size={16} className="animate-spin" />} {T("إنهاء التفعيل", "Finish setup")}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TeacherOnboarding;
