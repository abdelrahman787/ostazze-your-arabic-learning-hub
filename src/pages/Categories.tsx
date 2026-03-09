import { mockCategories } from "@/data/mockData";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Cog, Stethoscope, Monitor, Calculator, BarChart3, Globe2, FlaskConical, Scale, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const categoryIcons: Record<string, React.ElementType> = {
  "الهندسة": Cog, "الطب والصحة": Stethoscope, "علوم الحاسب": Monitor, "الرياضيات": Calculator,
  "إدارة الأعمال": BarChart3, "اللغات": Globe2, "العلوم الأساسية": FlaskConical, "القانون": Scale,
  "Engineering": Cog, "Medicine & Health": Stethoscope, "Computer Science": Monitor, "Mathematics": Calculator,
  "Business Administration": BarChart3, "Languages": Globe2, "Basic Sciences": FlaskConical, "Law": Scale,
};

const Categories = () => {
  const { t, d } = useLanguage();

  return (
    <div>
      <section className="py-16 bg-section-alt">
        <div className="container text-center">
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-extrabold mb-3">{t("categories_title")}</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-muted-foreground">{t("categories_subtitle")}</motion.p>
        </div>
      </section>
      <div className="container py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {mockCategories.map((c, i) => {
            const name = d(c.name);
            const Icon = categoryIcons[name] || categoryIcons[c.name.ar] || BookOpen;
            return (
              <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to="/subjects" className={`card-base p-8 text-center hover:border-primary/30 hover:shadow-lg cursor-pointer block ${i === 0 ? "card-active" : ""}`}>
                  <motion.div whileHover={{ scale: 1.2, rotate: 15 }} transition={{ type: "spring", stiffness: 300 }}
                    className="icon-box-lg bg-primary/10 text-primary mx-auto mb-4">
                    <Icon size={24} />
                  </motion.div>
                  <h3 className={`font-bold text-lg mb-1 ${i === 0 ? "text-primary" : ""}`}>{name}</h3>
                  <p className="text-muted-foreground text-sm">{d(c.count)}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;
