import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Eye, EyeOff, User, Mail, Lock, GraduationCap, Loader2, Globe, BookOpen, Users } from "lucide-react";
import { motion } from "framer-motion";
import { lovable } from "@/integrations/lovable/index";
import PageHelmet from "@/components/PageHelmet";

const TIMEZONES = [
  { value: "Asia/Riyadh", label: { ar: "الرياض (UTC+3)", en: "Riyadh (UTC+3)" } },
  { value: "Asia/Dubai", label: { ar: "دبي (UTC+4)", en: "Dubai (UTC+4)" } },
  { value: "Asia/Kuwait", label: { ar: "الكويت (UTC+3)", en: "Kuwait (UTC+3)" } },
  { value: "Africa/Cairo", label: { ar: "القاهرة (UTC+2)", en: "Cairo (UTC+2)" } },
  { value: "Asia/Amman", label: { ar: "عمّان (UTC+3)", en: "Amman (UTC+3)" } },
  { value: "Asia/Beirut", label: { ar: "بيروت (UTC+2)", en: "Beirut (UTC+2)" } },
  { value: "Asia/Baghdad", label: { ar: "بغداد (UTC+3)", en: "Baghdad (UTC+3)" } },
  { value: "Africa/Casablanca", label: { ar: "الدار البيضاء (UTC+1)", en: "Casablanca (UTC+1)" } },
  { value: "Africa/Tunis", label: { ar: "تونس (UTC+1)", en: "Tunis (UTC+1)" } },
  { value: "Africa/Algiers", label: { ar: "الجزائر (UTC+1)", en: "Algiers (UTC+1)" } },
  { value: "Europe/London", label: { ar: "لندن (UTC+0)", en: "London (UTC+0)" } },
  { value: "Europe/Paris", label: { ar: "باريس (UTC+1)", en: "Paris (UTC+1)" } },
  { value: "America/New_York", label: { ar: "نيويورك (UTC-5)", en: "New York (UTC-5)" } },
  { value: "America/Los_Angeles", label: { ar: "لوس أنجلوس (UTC-8)", en: "Los Angeles (UTC-8)" } },
  { value: "Asia/Karachi", label: { ar: "كراتشي (UTC+5)", en: "Karachi (UTC+5)" } },
  { value: "Asia/Kolkata", label: { ar: "نيودلهي (UTC+5:30)", en: "New Delhi (UTC+5:30)" } },
  { value: "Asia/Kuala_Lumpur", label: { ar: "كوالالمبور (UTC+8)", en: "Kuala Lumpur (UTC+8)" } },
  { value: "Asia/Istanbul", label: { ar: "إسطنبول (UTC+3)", en: "Istanbul (UTC+3)" } },
];

const getPasswordStrength = (pw: string): { level: number; label: string; color: string } => {
  if (pw.length < 6) return { level: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: "register_password_weak", color: "bg-destructive" };
  if (score <= 2) return { level: 2, label: "register_password_medium", color: "bg-amber-500" };
  return { level: 3, label: "register_password_strong", color: "bg-emerald-500" };
};

const Register = () => {
  const { t, lang } = useLanguage();
  const { register } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timezone, setTimezone] = useState("Asia/Riyadh");
  const [agreedTerms, setAgreedTerms] = useState(false);
  // Honeypot — bots fill this; real users never see it.
  const [website, setWebsite] = useState("");

  const pwStrength = useMemo(() => getPasswordStrength(password), [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (website) {
      // Silent reject for bots
      setSuccess(true);
      return;
    }
    if (password !== confirmPassword) {
      setError(t("password_mismatch"));
      return;
    }
    if (pwStrength.level < 2) {
      setError(lang === "ar"
        ? "كلمة المرور ضعيفة. استخدم 8+ أحرف مع أرقام وحروف كبيرة."
        : "Password too weak. Use 8+ chars with numbers and uppercase letters.");
      return;
    }
    if (!agreedTerms) {
      setError(lang === "ar" ? "يجب الموافقة على الشروط والأحكام" : "You must agree to the terms and conditions");
      return;
    }
    setLoading(true);
    setError("");
    const result = await register(email, password, fullName, "student", timezone);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (error) setError(error.message || t("login_error"));
    } catch (err: any) {
      setError(err.message || t("login_error"));
    }
    setGoogleLoading(false);
  };

  if (success) {
    return (
      <div className="hero-gradient min-h-screen flex items-center justify-center p-4">
        <PageHelmet title={t("register_success_title")} noindex />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-base p-10 w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-4">
            <Mail size={28} />
          </div>
          <h2 className="text-2xl font-extrabold mb-2">{t("register_success_title")}</h2>
          <p className="text-muted-foreground mb-6">{t("register_success_msg")}</p>
          <Link to="/login" className="btn-primary inline-block">{t("register_go_login")}</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="hero-gradient min-h-screen flex items-center justify-center p-4">
      <PageHelmet title={t("register_title")} description={t("register_subtitle")} noindex />
      <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-0">
        {/* Left side - Illustration */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex lg:w-5/12 flex-col justify-center items-center p-10 rounded-s-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-border/50 border-e-0">
          <div className="w-20 h-20 rounded-2xl stats-gradient text-primary-foreground flex items-center justify-center mb-6">
            <GraduationCap size={40} />
          </div>
          <h2 className="text-2xl font-extrabold mb-3 text-center">
            {lang === "ar" ? "ابدأ رحلتك التعليمية 🚀" : "Start Your Learning Journey 🚀"}
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-xs">{t("register_subtitle")}</p>
          <div className="space-y-4 w-full max-w-xs">
            {[
              { icon: BookOpen, text: lang === "ar" ? "وصول فوري لأفضل المعلمين" : "Instant access to the best teachers" },
              { icon: Users, text: lang === "ar" ? "انضم لمجتمع من آلاف الطلاب" : "Join a community of thousands" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <item.icon size={16} />
                </div>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right side - Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="card-base p-10 w-full lg:w-7/12 lg:rounded-s-none">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl stats-gradient text-primary-foreground flex items-center justify-center mx-auto mb-4 lg:hidden">
              <GraduationCap size={28} />
            </div>
            <h1 className="text-2xl font-extrabold">{t("register_title")}</h1>
            <p className="text-muted-foreground text-sm mt-1">{t("register_subtitle")}</p>
          </div>

          {/* Google Sign-Up */}
          <button
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-background border-2 border-input rounded-xl p-3 text-sm font-bold hover:bg-secondary/50 hover:shadow-md transition-all mb-4"
          >
            {googleLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 010-9.18l-7.98-6.19a24.003 24.003 0 000 21.56l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            )}
            {t("register_google")}
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">{t("login_or")}</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1.5">{t("register_name")}</label>
              <div className="relative"><User size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t("register_name")} className="input-base !pr-10" required maxLength={100} /></div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5">{t("login_email")}</label>
              <div className="relative"><Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="input-base !pr-10" required maxLength={255} /></div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5">{t("login_password")}</label>
              <div className="relative">
                <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("register_password_hint")} className="input-base !pr-10 !pl-10" required minLength={8} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label={showPass ? "Hide password" : "Show password"}>{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
              {/* Password strength */}
              {password.length >= 6 && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= pwStrength.level ? pwStrength.color : "bg-muted"}`} />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${pwStrength.level === 1 ? "text-destructive" : pwStrength.level === 2 ? "text-amber-500" : "text-emerald-500"}`}>
                    {t(pwStrength.label as any)}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold mb-1.5">{t("register_confirm")}</label>
              <div className="relative">
                <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type={showPass ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={t("register_confirm")} className="input-base !pr-10" required minLength={8} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1.5 flex items-center gap-1.5">
                <Globe size={14} /> {t("register_timezone")}
              </label>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="input-base">
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>{tz.label[lang]}</option>
                ))}
              </select>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={agreedTerms} onChange={e => setAgreedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-border accent-primary" />
              <span className="text-sm text-muted-foreground">
                {t("register_terms_agree")}{" "}
                <Link to="/terms" className="text-primary font-semibold hover:underline">{t("footer_terms")}</Link>
                {" "}{t("register_and")}{" "}
                <Link to="/privacy" className="text-primary font-semibold hover:underline">{t("footer_privacy")}</Link>
              </span>
            </label>

            {error && <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 text-destructive text-sm">{error}</div>}

            <button type="submit" disabled={loading || !agreedTerms} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading && <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />}
              {t("register_submit")}
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-muted-foreground">
            {t("register_has_account")} <Link to="/login" className="text-primary font-semibold hover:underline">{t("register_login")}</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
