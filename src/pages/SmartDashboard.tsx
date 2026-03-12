import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import Dashboard from "./Dashboard";
import TeacherDashboard from "./TeacherDashboard";

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

  if (user.role === "teacher") {
    return <TeacherDashboard />;
  }

  return <Dashboard />;
};

export default SmartDashboard;
