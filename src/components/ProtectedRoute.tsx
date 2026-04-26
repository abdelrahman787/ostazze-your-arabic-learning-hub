import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  children: React.ReactNode;
  adminOnly?: boolean;
  teacherOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false, teacherOnly = false }: Props) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { lang } = useLanguage();
  const ar = lang === "ar";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Wait for role to resolve before deciding on access
  if ((adminOnly || teacherOnly) && !user.roleResolved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const denied =
    (adminOnly && user.role !== "admin") ||
    (teacherOnly && user.role !== "teacher" && user.role !== "admin");

  if (denied) {
    // Show explicit 403 instead of silent fallback to homepage
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-md w-full text-center bg-card border border-border rounded-2xl p-8 shadow-lg">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <ShieldAlert className="text-destructive" size={32} />
          </div>
          <h1 className="text-2xl font-extrabold mb-2">
            {ar ? "غير مصرّح بالوصول" : "Access Denied"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {ar
              ? "هذه الصفحة محجوزة لدور محدد لا تملكه. تواصل مع المدير إذا كنت تظن أن هذا خطأ."
              : "This page is restricted to a specific role you don't have. Contact an admin if you believe this is a mistake."}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90 transition"
            >
              {ar ? "لوحتي" : "My Dashboard"}
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-bold hover:opacity-90 transition"
            >
              {ar ? "الرئيسية" : "Home"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
