import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <div className="hero-gradient min-h-screen flex items-center justify-center p-4">
      <div className="card-base p-10 w-full max-w-md text-center">
        <div className="text-5xl mb-4">🔑</div>
        <h1 className="text-2xl font-extrabold mb-2">نسيت كلمة المرور؟</h1>
        <p className="text-muted-foreground text-sm mb-6">أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين</p>

        {sent ? (
          <div className="animate-fade-in">
            <div className="text-5xl mb-4">📧</div>
            <p className="text-muted-foreground mb-6">تم إرسال رابط إعادة تعيين كلمة المرور إلى <strong className="text-foreground">{email}</strong></p>
            <Link to="/login" className="btn-primary inline-block">العودة لتسجيل الدخول</Link>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4 text-start">
            <div>
              <label className="block text-sm font-bold mb-1.5">البريد الإلكتروني</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="input-base" required />
            </div>
            <button type="submit" className="btn-primary w-full">إرسال رابط إعادة التعيين</button>
            <Link to="/login" className="block text-center text-primary text-sm font-semibold hover:underline">العودة لتسجيل الدخول</Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
