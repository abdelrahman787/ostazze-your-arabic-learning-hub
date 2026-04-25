import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import TeacherDashboard from "./TeacherDashboard";
import NoIndex from "@/components/NoIndex";

const SmartDashboard = () => {
  const { user, loading } = useAuth();

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

  // Admin goes directly to admin panel
  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (user.role === "teacher") {
    return <><NoIndex title="Teacher Dashboard" /><TeacherDashboard /></>;
  }

  return <><NoIndex title="Dashboard" /><Dashboard /></>;
};

export default SmartDashboard;
