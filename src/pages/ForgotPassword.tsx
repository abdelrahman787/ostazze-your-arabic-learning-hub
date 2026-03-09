import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { KeyRound, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const ForgotPassword = () => {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="hero-gradient min-h-screen flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-base p-10 w-full max-w-md text-center">
        <motion.div whileHover={{ scale: 1.1, rotate: 15 }} className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
          <KeyRound size={28} />
        </motion.div>
        <h1 className="text-2xl font-extrabold mb-2">{t("forgot_title")}</h1>
        <p className="text-muted-foreground text-sm mb-6">{t("forgot_subtitle")}</p>

        {sent ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div whileHover={{ scale: 1.1 }} className="w-16 h-16 rounded-2xl bg-success/10 text-success flex items-center justify-center mx-auto mb-4">
              <Mail size={28} />
            </motion.div>
            <p className="text-muted-foreground mb-6">{t("forgot_sent")} <strong className="text-foreground">{email}</strong></p>
            <Link to="/login" className="btn-primary inline-block">{t("forgot_back")}</Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-start">
            <div>
              <label className="block text-sm font-bold mb-1.5">{t("login_email")}</label>
              <div className="relative">
                <Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="input-base !pr-10" required />
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading && <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />}
              {t("forgot_submit")}
            </motion.button>
            <Link to="/login" className="block text-center text-primary text-sm font-semibold hover:underline">{t("forgot_back")}</Link>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
