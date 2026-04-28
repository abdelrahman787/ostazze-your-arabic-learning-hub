import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useRef, useEffect, useCallback } from "react";
import { Moon, Sun, Menu, X, LogOut, Globe, User, ChevronDown, Shield, LayoutDashboard, ArrowRight, GraduationCap, Calendar } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import NotificationBell from "@/components/NotificationBell";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, user, logout } = useAuth();
  const { t, toggleLang, lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // Publish actual navbar height as a CSS variable so other pages
  // can offset their layout without hardcoded magic numbers.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const apply = () => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--navbar-h", `${Math.ceil(h)}px`);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    window.addEventListener("resize", apply);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, []);

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
    <header ref={headerRef} className="sticky top-0 z-50 px-4 pt-4 pointer-events-none">
      <nav className="nav-pill mx-auto max-w-5xl h-14 flex items-center px-3 sm:px-5 pointer-events-auto">
        <div className="flex-1 flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="w-8 h-8 rounded-full flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition-colors"
                aria-label={lang === "ar" ? "رجوع" : "Go back"}
              >
                <ArrowRight size={16} />
              </button>
            )}
            <Link to="/" className="flex items-center gap-1.5 shrink-0">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-[0_0_18px_hsl(14_91%_50%/0.5)]">
                <GraduationCap size={18} className="text-white" />
              </span>
              <span className="text-lg font-black text-primary tracking-tight hidden sm:inline">OSTAZE</span>
            </Link>
          </div>

          {/* Center nav */}
          <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((l) => {
              const isActive = location.pathname === l.path;
              return (
                <Link
                  key={l.path}
                  to={l.path}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive ? "text-primary font-bold" : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition-colors"
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              onClick={toggleLang}
              className="w-8 h-8 rounded-full flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition-colors"
              aria-label={lang === "ar" ? "Switch to English" : "التبديل للعربية"}
            >
              <Globe size={16} />
            </button>

            {isLoggedIn && <NotificationBell />}

            {isLoggedIn ? (
              <div className="hidden md:block relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-full text-sm font-medium text-foreground/80 hover:bg-foreground/10 transition-colors"
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                    <User size={14} className="text-primary" />
                  </div>
                  <ChevronDown size={12} className={`transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute end-0 top-full mt-2 w-56 bg-card rounded-2xl border shadow-2xl overflow-hidden z-50"
                      role="menu"
                    >
                      <div className="p-3 border-b">
                        <div className="font-bold text-sm">{user?.name}</div>
                        <div className="text-muted-foreground text-xs">{user?.email}</div>
                        {user?.role === "admin" && (
                          <span className="text-[0.6rem] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-semibold mt-1 inline-block">{t("admin_title")}</span>
                        )}
                      </div>
                      <div className="p-1.5">
                        <Link to={dashboardPath} onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm hover:bg-secondary transition-colors" role="menuitem">
                          <LayoutDashboard size={15} className="text-muted-foreground" /> {t("nav_dashboard")}
                        </Link>
                        <Link to="/my-bookings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm hover:bg-secondary transition-colors" role="menuitem">
                          <Calendar size={15} className="text-muted-foreground" /> {lang === "ar" ? "حجوزاتي" : "My Bookings"}
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
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary-dark transition-colors shadow-[0_4px_14px_hsl(14_91%_50%/0.35)]"
                >
                  {t("nav_login")}
                </Link>
              </div>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden w-8 h-8 rounded-full flex items-center justify-center hover:bg-foreground/10" aria-label="Menu">
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mx-auto max-w-5xl mt-2 nav-pill !rounded-3xl p-3"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.path}
                  to={l.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium hover:bg-foreground/10 min-h-[44px] flex items-center ${
                    location.pathname === l.path ? "text-primary font-bold bg-primary/10" : "text-foreground/80"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <div className="h-px bg-foreground/10 my-1" />
              {isLoggedIn ? (
                <>
                  <Link to={dashboardPath} onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium hover:bg-foreground/10 flex items-center gap-2 min-h-[44px]">
                    <LayoutDashboard size={16} /> {t("nav_dashboard")}
                  </Link>
                  <Link to="/my-bookings" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium hover:bg-foreground/10 flex items-center gap-2 min-h-[44px]">
                    <Calendar size={16} /> {lang === "ar" ? "حجوزاتي" : "My Bookings"}
                  </Link>
                  {user?.role === "admin" && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium hover:bg-foreground/10 flex items-center gap-2 min-h-[44px]">
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
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="bg-primary text-primary-foreground rounded-full text-center text-sm min-h-[44px] flex items-center justify-center font-bold">{t("nav_register")}</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
