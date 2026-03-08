import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Moon, Sun, Menu, X, LogOut, Globe } from "lucide-react";

const navLinks = [
  { label: "الرئيسية", path: "/" },
  { label: "المعلمين", path: "/teachers" },
  { label: "التصنيفات", path: "/categories" },
  { label: "المواد", path: "/subjects" },
  { label: "الجامعات", path: "/universities" },
];

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b h-16 flex items-center">
      <div className="container flex items-center justify-between">
        <Link to="/" className="text-2xl font-black text-primary">
          🎓 OSTAZZE
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                location.pathname === l.path
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:bg-primary-light hover:text-primary-dark"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="w-9 h-9 rounded-[10px] border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button className="w-9 h-9 rounded-[10px] border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <Globe size={18} />
          </button>

          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                {user?.name?.charAt(0)}
              </div>
              <Link to={user?.role === "teacher" ? "/dashboard/teacher" : user?.role === "admin" ? "/admin" : "/dashboard"} className="btn-primary text-sm !py-2 !px-4">
                لوحة التحكم
              </Link>
              <button onClick={logout} className="w-9 h-9 rounded-[10px] border flex items-center justify-center text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="btn-outline text-sm !py-2 !px-4">تسجيل الدخول</Link>
              <Link to="/register" className="btn-primary text-sm !py-2 !px-4">إنشاء حساب</Link>
            </div>
          )}

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden w-9 h-9 rounded-[10px] border flex items-center justify-center">
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-16 inset-x-0 bg-card border-b shadow-lg md:hidden animate-fade-in">
          <div className="p-4 flex flex-col gap-2">
            {navLinks.map((l) => (
              <Link key={l.path} to={l.path} onClick={() => setMobileOpen(false)}
                className={`px-4 py-2.5 rounded-[10px] text-sm font-medium transition-colors ${location.pathname === l.path ? "bg-primary text-primary-foreground font-bold" : "hover:bg-secondary"}`}>
                {l.label}
              </Link>
            ))}
            <div className="border-t my-2" />
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="btn-primary text-center text-sm">لوحة التحكم</Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="text-destructive text-sm font-medium py-2">تسجيل الخروج</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline text-center text-sm">تسجيل الدخول</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-center text-sm">إنشاء حساب</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
