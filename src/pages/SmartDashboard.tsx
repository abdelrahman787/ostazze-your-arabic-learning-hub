import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ShieldAlert } from "lucide-react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Dashboard from "./Dashboard";
import TeacherDashboard from "./TeacherDashboard";
import NoIndex from "@/components/NoIndex";
import { useLanguage } from "@/contexts/LanguageContext";
import { logAccessDenied, logRoleRedirect } from "@/lib/accessLog";

const SmartDashboard = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { lang } = useLanguage();
  const ar = lang === "ar";

  if (loading || !user) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  // Wait until role is resolved to avoid flash of wrong dashboard
  if (!user.roleResolved) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const isTeacherRoute = location.pathname === "/dashboard/teacher";

  // Admin → always lands in /admin, regardless of which dashboard URL was used
  if (user.role === "admin") {
    logRoleRedirect("SmartDashboard", location.pathname, "/admin", "admin");
    return <Navigate to="/admin" replace />;
  }

  // Teacher route: must be a teacher (admin is already redirected above).
  if (isTeacherRoute && user.role !== "teacher") {
    return <RoleDeniedScreen
      ar={ar}
      route="/dashboard/teacher"
      requiredRole="teacher"
      actualRole={user.role}
    />;
  }

  if (user.role === "teacher") {
    return <><NoIndex title="Teacher Dashboard" /><TeacherDashboard /></>;
  }

  return <><NoIndex title="Dashboard" /><Dashboard /></>;
};

interface RoleDeniedProps {
  ar: boolean;
  route: string;
  requiredRole: string;
  actualRole: string;
}

const RoleDeniedScreen = ({ ar, route, requiredRole, actualRole }: RoleDeniedProps) => {
  // Log once on mount to avoid spamming on re-renders
  useEffect(() => {
    logAccessDenied("SmartDashboard", requiredRole, actualRole, route);
  }, [route, requiredRole, actualRole]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <NoIndex title="Access Denied" />
      <div className="max-w-md w-full text-center bg-card border border-border rounded-2xl p-8 shadow-lg">
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <ShieldAlert className="text-destructive" size={32} />
        </div>
        <h1 className="text-2xl font-extrabold mb-2">
          {ar ? "هذه اللوحة للمعلمين فقط" : "Teacher Dashboard Only"}
        </h1>
        <p className="text-muted-foreground mb-6">
          {ar
            ? "لوحة المعلم محجوزة لأصحاب حساب معلم. يمكنك العودة إلى لوحتك الخاصة."
            : "This dashboard is reserved for teacher accounts. You can return to your own dashboard."}
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
};

export default SmartDashboard;
