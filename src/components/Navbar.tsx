import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Moon, Sun, Menu, X, LogOut, Globe, User, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { label: "الجامعات", path: "/universities" },
  { label: "المواد", path: "/subjects" },
  { label: "التصنيفات", path: "/categories" },
  { label: "المعلمين", path: "/teachers" },
];

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b h-16 flex items-center">
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-black text-primary tracking-tight">
          OSTAZZE
        </Link>

        {/* Desktop Nav - Center */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className={`text-sm font-medium transition-colors duration-200 ${
                location.pathname === l.path
                  ? "text-primary font-bold"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center text-foreground/50 hover:text-foreground hover:bg-secondary transition-all"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-foreground/50 hover:text-foreground hover:bg-secondary transition-all">
            <Globe size={18} />
          </button>

          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-3">
              <Link
                to={user?.role === "teacher" ? "/dashboard/teacher" : user?.role === "admin" ? "/admin" : "/dashboard"}
                className="flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={16} className="text-primary" />
                </div>
                <span>{user?.name?.split(" ")[0]}...</span>
                <ChevronDown size={14} />
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                تسجيل الدخول
              </Link>
              <Link to="/register" className="btn-primary text-sm !py-2 !px-5">
                إنشاء حساب
              </Link>
            </div>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary"
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
            className="absolute top-16 inset-x-0 bg-card border-b shadow-lg md:hidden"
          >
            <div className="p-4 flex flex-col gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.path}
                  to={l.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === l.path
                      ? "bg-primary text-primary-foreground font-bold"
                      : "text-foreground/70 hover:bg-secondary"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <div className="border-t my-2" />
              {isLoggedIn ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="btn-primary text-center text-sm">لوحة التحكم</Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="text-destructive text-sm font-medium py-2.5 flex items-center justify-center gap-2">
                    <LogOut size={15} />
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="text-center text-sm font-medium py-3 text-foreground/70">تسجيل الدخول</Link>
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
