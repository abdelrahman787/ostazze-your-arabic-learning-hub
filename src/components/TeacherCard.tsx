import { Link } from "react-router-dom";
import type { Teacher } from "@/data/mockData";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const TeacherCard = ({ teacher, index = 0 }: { teacher: Teacher; index?: number }) => {
  const initials = teacher.name.split(" ").map((w) => w[0]).join("").slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      className="card-base flex flex-col"
    >
      <div className="p-6 flex gap-4">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-16 h-16 rounded-full stats-gradient text-primary-foreground flex items-center justify-center text-lg font-black shrink-0"
        >
          {initials}
        </motion.div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-extrabold">{teacher.name}</h3>
            {teacher.verified && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.3 + index * 0.1 }}
                className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full font-semibold"
              >
                ✓ موثق
              </motion.span>
            )}
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed mt-1 line-clamp-2">{teacher.title}</p>
        </div>
      </div>

      <div className="px-6 pb-4 flex flex-wrap gap-2">
        {teacher.subjects.slice(0, 3).map((s, i) => (
          <motion.span
            key={s}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.08 }}
            className="badge-brand text-xs"
          >
            {s}
          </motion.span>
        ))}
      </div>

      <div className="px-6 py-3 border-t bg-secondary/50 flex items-center justify-between">
        <div>
          <span className="text-lg font-extrabold text-primary">{teacher.price} {teacher.currency}</span>
          <span className="text-muted-foreground text-xs mr-1">/ جلسة</span>
        </div>
        <div className="flex items-center gap-1">
          <motion.div whileHover={{ rotate: 72, scale: 1.3 }} transition={{ type: "spring" }}>
            <Star size={16} className="fill-warning text-warning" />
          </motion.div>
          <span className="font-bold text-sm">{teacher.rating}</span>
          <span className="text-muted-foreground text-xs">({teacher.reviews})</span>
        </div>
      </div>

      <div className="p-4 pt-3">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link to={`/teachers/${teacher.id}`} className="btn-primary block text-center text-sm w-full">
            عرض الملف الشخصي ↗
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TeacherCard;
