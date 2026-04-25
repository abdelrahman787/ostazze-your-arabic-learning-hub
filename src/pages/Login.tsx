import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Eye, EyeOff, Mail, Lock, Sparkles, Loader2, GraduationCap, BookOpen, Users } from "lucide-react";
import { motion } from "framer-motion";
import { lovable } from "@/integrations/lovable/index";
import PageHelmet from "@/components/PageHelmet";

const Login = () => {
  const { login, isLoggedIn, user } = useAuth();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [cooldownUntil, setCooldownUntil] = useState(0);

  useEffect(() => {
    if (isLoggedIn && user && user.roleResolved) {
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "teacher") navigate("/dashboard/teacher");
      else navigate("/dashboard");
    }
  }, [isLoggedIn, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Date.now() < cooldownUntil) {
      const secs = Math.ceil((cooldownUntil - Date.now()) / 1000);
      setError(lang === "ar"
        ? `تم تعطيل تسجيل الدخول مؤقتاً. حاول مجدداً بعد ${secs} ثانية.`
        : `Login temporarily disabled. Try again in ${secs}s.`);
      return;
    }
    setLoading(true);
    setError("");
    const result = await login(email, password);
    if (result.error) {
      const next = attempts + 1;
      setAttempts(next);
      if (next >= 5) {
        setCooldownUntil(Date.now() + 60_000);
        setAttempts(0);
      }
      setError(result.error);
    } else {
      setAttempts(0);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
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

  return (
    <div className="hero-gradient min-h-screen flex items-center justify-center p-4">
      <PageHelmet title={t("login_title")} description={t("login_subtitle")} noindex />
      <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-0 lg:gap-0">
        {/* Left side - Illustration */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-10 rounded-s-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-border/50 border-e-0">
          <div className="w-20 h-20 rounded-2xl stats-gradient text-primary-foreground flex items-center justify-center mb-6">
            <GraduationCap size={40} />
          </div>
          <h2 className="text-2xl font-extrabold mb-3 text-center">{t("login_welcome_back")}</h2>
          <p className="text-muted-foreground text-center mb-8 max-w-xs">{t("login_subtitle")}</p>
          <div className="space-y-4 w-full max-w-xs">
            {[
              { icon: BookOpen, text: lang === "ar" ? "جلسات مباشرة مع أفضل المعلمين" : "Live sessions with the best teachers" },
              { icon: Users, text: lang === "ar" ? "آلاف الطلاب يتعلمون معنا" : "Thousands of students learning with us" },
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
          className="card-base p-10 w-full lg:w-1/2 lg:rounded-s-none">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl stats-gradient text-primary-foreground flex items-center justify-center mx-auto mb-4 lg:hidden">
              <Sparkles size={28} />
            </div>
            <h1 className="text-2xl font-extrabold">{t("login_title")}</h1>
            <p className="text-muted-foreground text-sm mt-1">{t("login_subtitle")}</p>
          </div>

          {/* Google Sign-In */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-background border-2 border-input rounded-xl p-3 text-sm font-bold hover:bg-secondary/50 hover:shadow-md transition-all mb-4"
          >
            {googleLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 010-9.18l-7.98-6.19a24.003 24.003 0 000 21.56l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            )}
            {t("login_google")}
          </motion.button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">{t("login_or")}</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1.5">{t("login_email")}</label>
              <div className="relative">
                <Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="input-base !pr-10" required />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-bold">{t("login_password")}</label>
                <Link to="/forgot-password" className="text-primary text-xs font-semibold hover:underline">{t("login_forgot")}</Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="input-base !pr-10 !pl-10" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <div role="alert" aria-live="assertive" className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 text-destructive text-sm">{error}</div>}

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading && <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />}
              {t("login_submit")}
            </motion.button>
          </form>

          <p className="text-center text-sm mt-6 text-muted-foreground">
            {t("login_no_account")} <Link to="/register" className="text-primary font-semibold hover:underline">{t("login_register_now")}</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
