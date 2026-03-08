import { Link } from "react-router-dom";
import type { Teacher } from "@/data/mockData";
import { Star, BadgeCheck, ArrowUpLeft, Clock } from "lucide-react";
import { motion } from "framer-motion";

const TeacherCard = ({ teacher, index = 0 }: { teacher: Teacher; index?: number }) => {
  const initials = teacher.name.split(" ").map((w) => w[0]).join("").slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="card-base flex flex-col group overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 flex gap-4">
        <motion.div
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="w-14 h-14 rounded-2xl stats-gradient text-primary-foreground flex items-center justify-center text-base font-black shrink-0"
        >
          {initials}
        </motion.div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-bold text-[0.95rem]">{teacher.name}</h3>
            {teacher.verified && (
              <BadgeCheck size={16} className="text-blue-500 dark:text-blue-400 shrink-0" />
            )}
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed mt-1 line-clamp-2">{teacher.title}</p>
        </div>
      </div>

      {/* Subjects */}
      <div className="px-5 pb-4 flex flex-wrap gap-1.5">
        {teacher.subjects.slice(0, 3).map((s) => (
          <span
            key={s}
            className="bg-primary/8 text-primary dark:bg-primary/15 px-2.5 py-1 rounded-lg text-[0.7rem] font-semibold"
          >
            {s}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3.5 border-t bg-secondary/30 flex items-center justify-between mt-auto">
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-extrabold text-primary">{teacher.price}</span>
          <span className="text-muted-foreground text-xs">{teacher.currency} / جلسة</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Star size={14} className="fill-warning text-warning" />
          <span className="font-bold text-sm">{teacher.rating}</span>
          <span className="text-muted-foreground text-xs">({teacher.reviews})</span>
        </div>
      </div>

      {/* CTA */}
      <div className="p-4 pt-3">
        <Link
          to={`/teachers/${teacher.id}`}
          className="btn-primary flex items-center justify-center gap-2 text-sm w-full group-hover:shadow-lg group-hover:shadow-primary/20 transition-all"
        >
          عرض الملف الشخصي
          <ArrowUpLeft size={14} />
        </Link>
      </div>
    </motion.div>
  );
};

export default TeacherCard;
