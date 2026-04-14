import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useRef, useEffect, useCallback } from "react";
import { Moon, Sun, Menu, X, LogOut, Globe, User, ChevronDown, Shield, LayoutDashboard, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, user, logout } = useAuth();
  const { t, toggleLang, lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setProfileOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const navLinks = [
    { label: t("nav_universities"), path: "/universities" },
    { label: t("nav_subjects"), path: "/subjects" },
    { label: t("nav_categories"), path: "/categories" },
    { label: t("nav_teachers"), path: "/teachers" },
  ];

  const dashboardPath = "/dashboard";
  const showBackButton = location.pathname !== "/";

  const handleBack = useCallback(() => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b shadow-sm h-16 flex items-center">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button
              onClick={handleBack}
              className="w-9 h-9 rounded-full flex items-center justify-center text-foreground/50 hover:text-foreground hover:bg-secondary transition-colors"
              aria-label={lang === "ar" ? "رجوع" : "Go back"}
            >
              <ArrowRight size={18} />
            </button>
          )}
          <Link to="/" className="text-2xl font-black text-primary tracking-tight">
            OSTAZZE
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className={`text-base font-medium transition-colors duration-200 relative pb-1 ${
                location.pathname === l.path
                  ? "text-primary font-bold after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-primary after:rounded-full"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center text-foreground/50 hover:text-foreground hover:bg-secondary transition-colors"
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            onClick={toggleLang}
            className="w-9 h-9 rounded-full flex items-center justify-center text-foreground/50 hover:text-foreground hover:bg-secondary transition-colors"
            aria-label={lang === "ar" ? "Switch to English" : "التبديل للعربية"}
          >
            <Globe size={18} />
          </button>

          {isLoggedIn ? (
            <div className="hidden md:block relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={16} className="text-primary" />
                </div>
                <span>{user?.name?.split(" ")[0]}...</span>
                <ChevronDown size={14} className={`transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 w-56 bg-card rounded-xl border shadow-lg overflow-hidden z-50"
                    role="menu"
                  >
                    <div className="p-3 border-b">
                      <div className="font-bold text-sm">{user?.name}</div>
                      <div className="text-muted-foreground text-xs">{user?.email}</div>
                      {user?.role === "admin" && (
                        <span className="text-[0.6rem] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold mt-1 inline-block">{t("admin_title")}</span>
                      )}
                    </div>
                    <div className="p-1.5">
                      <Link to={dashboardPath} onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm hover:bg-secondary transition-colors" role="menuitem">
                        <LayoutDashboard size={15} className="text-muted-foreground" /> {t("nav_dashboard")}
                      </Link>
                      {user?.role === "admin" && (
                        <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm hover:bg-secondary transition-colors" role="menuitem">
                          <Shield size={15} className="text-primary" /> {t("admin_title")}
                        </Link>
                      )}
                      <button onClick={() => { logout(); setProfileOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors" role="menuitem">
                        <LogOut size={15} /> {t("nav_logout")}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">{t("nav_login")}</Link>
              <Link to="/register" className="btn-primary text-sm !py-2 !px-5">{t("nav_register")}</Link>
            </div>
          )}

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary" aria-label="Menu">
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

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
                <Link key={l.path} to={l.path} onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all min-h-[44px] flex items-center ${location.pathname === l.path ? "bg-primary text-primary-foreground font-bold" : "text-foreground/70 hover:bg-secondary"}`}
                >{l.label}</Link>
              ))}
              <div className="border-t my-2" />
              {isLoggedIn ? (
                <>
                  <Link to={dashboardPath} onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium hover:bg-secondary flex items-center gap-2 min-h-[44px]">
                    <LayoutDashboard size={16} /> {t("nav_dashboard")}
                  </Link>
                  {user?.role === "admin" && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium hover:bg-secondary flex items-center gap-2 min-h-[44px]">
                      <Shield size={16} className="text-primary" /> {t("admin_title")}
                    </Link>
                  )}
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="text-destructive text-sm font-medium py-2.5 flex items-center justify-center gap-2 min-h-[44px]">
                    <LogOut size={15} />{t("nav_logout")}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="text-center text-sm font-medium py-3 text-foreground/70 min-h-[44px] flex items-center justify-center">{t("nav_login")}</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-center text-sm min-h-[44px] flex items-center justify-center">{t("nav_register")}</Link>
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
