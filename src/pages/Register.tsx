import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  if (success) {
    return (
      <div className="hero-gradient min-h-screen flex items-center justify-center p-4">
        <div className="card-base p-10 w-full max-w-md text-center animate-fade-in">
          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-2xl font-extrabold mb-2">تم إنشاء الحساب!</h2>
          <p className="text-muted-foreground mb-6">تم إرسال رسالة تأكيد إلى بريدك الإلكتروني. يرجى التحقق منه لتفعيل حسابك.</p>
          <Link to="/login" className="btn-primary inline-block">الذهاب إلى تسجيل الدخول</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-gradient min-h-screen flex items-center justify-center p-4">
      <div className="card-base p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl stats-gradient text-primary-foreground flex items-center justify-center text-3xl mx-auto mb-4">👤</div>
          <h1 className="text-2xl font-extrabold">إنشاء حساب جديد</h1>
          <p className="text-muted-foreground text-sm mt-1">أنشئ حسابك وابدأ رحلة التعلم</p>
        </div>

        <button className="w-full border-2 rounded-[10px] p-3 flex items-center justify-center gap-3 font-bold text-sm hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors mb-6">
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          التسجيل بجوجل
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-border" /><span className="text-muted-foreground text-sm">أو</span><div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1.5">الاسم الكامل</label>
            <div className="relative"><span className="absolute right-3 top-1/2 -translate-y-1/2">👤</span><input type="text" placeholder="الاسم الكامل" className="input-base !pr-10" required /></div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1.5">البريد الإلكتروني</label>
            <div className="relative"><span className="absolute right-3 top-1/2 -translate-y-1/2">📧</span><input type="email" placeholder="email@example.com" className="input-base !pr-10" required /></div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1.5">كلمة المرور</label>
            <div className="relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2">🔒</span>
              <input type={showPass ? "text" : "password"} placeholder="8 أحرف على الأقل" className="input-base !pr-10 !pl-10" required minLength={8} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1.5">تأكيد كلمة المرور</label>
            <div className="relative"><span className="absolute right-3 top-1/2 -translate-y-1/2">🔒</span><input type="password" placeholder="أعد إدخال كلمة المرور" className="input-base !pr-10" required /></div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">نوع الحساب</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "student" as const, icon: "🎓", label: "طالب" },
                { key: "teacher" as const, icon: "📖", label: "معلم" },
              ].map((t) => (
                <button key={t.key} type="button" onClick={() => setRole(t.key)}
                  className={`border-2 rounded-[10px] p-4 text-center transition-all ${role === t.key ? "border-primary bg-primary-light" : "border-input hover:border-primary/50"}`}>
                  <div className="text-2xl mb-1">{t.icon}</div>
                  <div className="font-bold text-sm">{t.label}</div>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading && <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />}
            إنشاء حساب
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-muted-foreground">
          لديك حساب بالفعل؟ <Link to="/login" className="text-primary font-semibold hover:underline">سجل دخولك</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
