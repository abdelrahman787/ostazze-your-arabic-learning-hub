import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { AlertTriangle, Search, GraduationCap, Users, BookOpen, Layers } from "lucide-react";
import NoIndex from "@/components/NoIndex";

const NotFound = () => {
  const location = useLocation();
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState("");

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const quickLinks = [
    { icon: GraduationCap, label: t("nav_universities"), path: "/universities" },
    { icon: Users, label: t("nav_teachers"), path: "/teachers" },
    { icon: BookOpen, label: t("nav_subjects"), path: "/subjects" },
    { icon: Layers, label: t("nav_categories"), path: "/categories" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <NoIndex title="404" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-lg w-full">
        <motion.div whileHover={{ scale: 1.1, rotate: 10 }} className="inline-block mb-4">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <AlertTriangle size={40} />
          </div>
        </motion.div>
        <h1 className="mb-3 text-6xl font-black text-foreground">404</h1>
        <p className="mb-6 text-lg text-muted-foreground">{t("not_found_desc")}</p>

        {/* Search */}
        <div className="relative max-w-sm mx-auto mb-8">
          <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && search.trim()) window.location.href = `/subjects?search=${encodeURIComponent(search)}`; }}
            placeholder={t("not_found_search_placeholder")}
            className="w-full ps-10 pe-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Quick Links */}
        <p className="text-sm text-muted-foreground mb-4">{t("not_found_quick_links")}</p>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {quickLinks.map((link) => (
            <Link key={link.path} to={link.path}
              className="card-base p-4 flex items-center gap-3 hover:border-primary/30 hover:shadow-md transition-all feature-card">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <link.icon size={16} />
              </div>
              <span className="text-sm font-bold">{link.label}</span>
            </Link>
          ))}
        </div>

        <Link to="/" className="btn-primary inline-block">
          {t("not_found_back")}
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
