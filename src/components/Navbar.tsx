import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Moon, Sun, Menu, X, LogOut, User, LayoutDashboard, ChevronDown, GraduationCap, BookOpen, Grid3X3, Users, School } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "الرئيسية", path: "/", icon: null },
  { label: "المعلمين", path: "/teachers", icon: Users },
  { label: "التصنيفات", path: "/categories", icon: Grid3X3 },
  { label: "المواد", path: "/subjects", icon: BookOpen },
  { label: "الجامعات", path: "/universities", icon: School },
];

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass-strong h-16 flex items-center border-b">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <GraduationCap size={20} className="text-primary-foreground" />
          </div>
          <span className="text-xl font-black text-primary tracking-tight">OSTAZZE</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-0.5 bg-secondary/60 rounded-2xl p-1">
          {navLinks.map((l) => {
            const isActive = location.pathname === l.path;
            return (
              <Link
                key={l.path}
                to={l.path}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-card text-primary font-bold shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-200"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to={user?.role === "teacher" ? "/dashboard/teacher" : user?.role === "admin" ? "/admin" : "/dashboard"}
                className="btn-primary text-sm !py-2 !px-4 flex items-center gap-2"
              >
                <LayoutDashboard size={15} />
                لوحة التحكم
              </Link>
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold border-2 border-primary/20">
                {user?.name?.charAt(0)}
              </div>
              <button
                onClick={logout}
                className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="text-sm font-semibold text-muted-foreground hover:text-foreground px-4 py-2 rounded-xl hover:bg-secondary transition-all">تسجيل الدخول</Link>
              <Link to="/register" className="btn-primary text-sm !py-2.5 !px-5 flex items-center gap-1.5">
                <User size={14} />
                إنشاء حساب
              </Link>
            </div>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 rounded-xl bg-secondary flex items-center justify-center"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 inset-x-0 glass-strong shadow-card-hover md:hidden"
          >
            <div className="p-4 flex flex-col gap-1">
              {navLinks.map((l) => {
                const Icon = l.icon;
                return (
                  <Link
                    key={l.path}
                    to={l.path}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                      location.pathname === l.path
                        ? "bg-primary text-primary-foreground font-bold"
                        : "hover:bg-secondary text-muted-foreground"
                    }`}
                  >
                    {Icon && <Icon size={16} />}
                    {l.label}
                  </Link>
                );
              })}
              <div className="border-t my-2" />
              {isLoggedIn ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="btn-primary text-center text-sm flex items-center justify-center gap-2">
                    <LayoutDashboard size={15} />
                    لوحة التحكم
                  </Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="text-destructive text-sm font-medium py-2.5 flex items-center justify-center gap-2">
                    <LogOut size={15} />
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline text-center text-sm">تسجيل الدخول</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-center text-sm">إنشاء حساب</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
