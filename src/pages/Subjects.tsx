import { mockSubjects } from "@/data/mockData";
import { BookOpen, Users, ArrowUpLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const Subjects = () => {
  const { t } = useLanguage();

  return (
    <div>
      <section className="py-16 bg-section-alt">
        <div className="container text-center">
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-extrabold mb-3">{t("subjects_title")}</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-muted-foreground">{t("subjects_subtitle")}</motion.p>
        </div>
      </section>
      <div className="container py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {mockSubjects.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`card-base p-6 hover:border-primary/30 hover:shadow-lg transition-all ${i === 0 ? "card-active" : ""}`}>
              <motion.div whileHover={{ scale: 1.15, rotate: -10 }} transition={{ type: "spring", stiffness: 300 }} className="icon-box-lg bg-primary/10 mb-5">
                <BookOpen size={22} className="text-primary" />
              </motion.div>
              <h3 className={`font-bold text-base mb-2 ${i === 0 ? "text-primary" : ""}`}>{s.name}</h3>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-5">
                <Users size={14} />
                <span>{s.teacherCount} {t("subjects_teacher_count")}</span>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link to="/teachers" className="btn-dark flex items-center justify-center gap-2 w-full">
                  {t("subjects_view_teachers")}
                  <motion.div whileHover={{ x: -2, y: -2 }}><ArrowUpLeft size={14} /></motion.div>
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subjects;
