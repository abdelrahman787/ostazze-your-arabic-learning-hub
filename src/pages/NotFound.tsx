import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <motion.div whileHover={{ scale: 1.1, rotate: 10 }} className="inline-block mb-4">
          <AlertTriangle size={48} className="text-warning mx-auto" />
        </motion.div>
        <h1 className="mb-4 text-6xl font-black text-foreground">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">{t("not_found_desc")}</p>
        <Link to="/" className="btn-primary inline-block">
          {t("not_found_back")}
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
