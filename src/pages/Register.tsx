import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Eye, EyeOff, User, Mail, Lock, GraduationCap, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const Register = () => {
  const { t } = useLanguage();
  const { register } = useAuth();
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await register(email, password, fullName, role);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="hero-gradient min-h-screen flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-base p-10 w-full max-w-md text-center">
          <motion.div whileHover={{ scale: 1.1, rotate: 10 }} className="w-16 h-16 rounded-2xl bg-success/10 text-success flex items-center justify-center mx-auto mb-4">
            <Mail size={28} />
          </motion.div>
          <h2 className="text-2xl font-extrabold mb-2">{t("register_success_title")}</h2>
          <p className="text-muted-foreground mb-6">{t("register_success_msg")}</p>
          <Link to="/login" className="btn-primary inline-block">{t("register_go_login")}</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="hero-gradient min-h-screen flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-base p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <motion.div whileHover={{ scale: 1.1, rotate: -10 }} className="w-16 h-16 rounded-2xl stats-gradient text-primary-foreground flex items-center justify-center mx-auto mb-4">
            <User size={28} />
          </motion.div>
          <h1 className="text-2xl font-extrabold">{t("register_title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("register_subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1.5">{t("register_name")}</label>
            <div className="relative"><User size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t("register_name")} className="input-base !pr-10" required /></div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1.5">{t("login_email")}</label>
            <div className="relative"><Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="input-base !pr-10" required /></div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1.5">{t("login_password")}</label>
            <div className="relative">
              <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("register_password_hint")} className="input-base !pr-10 !pl-10" required minLength={8} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">{t("register_account_type")}</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "student" as const, icon: GraduationCap, label: t("register_student") },
                { key: "teacher" as const, icon: BookOpen, label: t("register_teacher") },
              ].map((tp) => (
                <motion.button key={tp.key} type="button" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setRole(tp.key)}
                  className={`border-2 rounded-xl p-4 text-center transition-all ${role === tp.key ? "border-primary bg-primary/5" : "border-input hover:border-primary/50"}`}>
                  <motion.div whileHover={{ scale: 1.2, rotate: 10 }} className="mx-auto mb-1">
                    <tp.icon size={24} className={role === tp.key ? "text-primary" : "text-muted-foreground"} />
                  </motion.div>
                  <div className="font-bold text-sm">{tp.label}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {error && <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 text-destructive text-sm">{error}</div>}

          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading && <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />}
            {t("register_submit")}
          </motion.button>
        </form>

        <p className="text-center text-sm mt-6 text-muted-foreground">
          {t("register_has_account")} <Link to="/login" className="text-primary font-semibold hover:underline">{t("register_login")}</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
