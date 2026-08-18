import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

const ResetPassword = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const isAr = lang === "ar";
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (password.length < 8) return toast.error(isAr ? "كلمة المرور يجب ألا تقل عن ٨ أحرف" : "Password must be at least 8 characters");
    if (password !== confirmation) return toast.error(isAr ? "كلمتا المرور غير متطابقتين" : "Passwords do not match");
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(isAr ? "تم تعيين كلمة المرور بنجاح" : "Password updated successfully");
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="hero-gradient min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="card-base p-8 w-full max-w-md space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <KeyRound size={26} />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-extrabold">{isAr ? "تعيين كلمة مرور جديدة" : "Set a new password"}</h1>
          <p className="text-sm text-muted-foreground mt-2">{isAr ? "اكتب كلمة المرور التي ستستخدمها للدخول إلى حسابك." : "Choose the password you will use to access your account."}</p>
        </div>
        <input className="input-base" type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={isAr ? "كلمة المرور الجديدة" : "New password"} required />
        <input className="input-base" type="password" minLength={8} value={confirmation} onChange={(e) => setConfirmation(e.target.value)} placeholder={isAr ? "تأكيد كلمة المرور" : "Confirm password"} required />
        <button className="btn-primary w-full flex items-center justify-center gap-2" disabled={saving}>
          {saving && <Loader2 size={16} className="animate-spin" />}
          {isAr ? "حفظ كلمة المرور" : "Save password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
