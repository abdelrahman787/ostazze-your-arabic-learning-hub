import { Link } from "react-router-dom";
import type { Teacher } from "@/data/mockData";
import { Star, User, ArrowUpLeft } from "lucide-react";
import { motion } from "framer-motion";

const TeacherCard = ({ teacher, index = 0 }: { teacher: Teacher; index?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="card-base flex flex-col hover:border-primary/30 hover:shadow-lg transition-all duration-200"
    >
      {/* Header */}
      <div className="p-5 pb-3 flex gap-3">
        <div className="relative shrink-0">
          <div className="icon-box-lg bg-primary/10 text-primary">
            <User size={22} />
          </div>
          {teacher.verified && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-[0.95rem] mb-1">{teacher.name}</h3>
          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">{teacher.title}</p>
        </div>
      </div>

      {/* Subjects */}
      <div className="px-5 pb-4 flex flex-wrap gap-1.5">
        {teacher.subjects.slice(0, 3).map((s) => (
          <span key={s} className="tag-outline">{s}</span>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Footer */}
      <div className="px-5 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Star size={14} className="fill-warning text-warning" />
          <span className="font-bold text-sm">{teacher.rating}</span>
          <span className="text-muted-foreground text-xs">({teacher.reviews})</span>
        </div>
        <div className="text-left">
          <span className="text-lg font-extrabold text-primary">{teacher.price}</span>
          <span className="text-muted-foreground text-xs mr-1">{teacher.currency}</span>
          <div className="text-muted-foreground text-[0.65rem]">لكل جلسة</div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        <Link
          to={`/teachers/${teacher.id}`}
          className="btn-primary flex items-center justify-center gap-2 text-sm w-full"
        >
          عرض الملف الشخصي
          <ArrowUpLeft size={14} />
        </Link>
      </div>
    </motion.div>
  );
};

export default TeacherCard;
