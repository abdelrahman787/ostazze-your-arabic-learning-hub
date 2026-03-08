import { Link } from "react-router-dom";
import type { Teacher } from "@/data/mockData";
import { Star } from "lucide-react";

const TeacherCard = ({ teacher }: { teacher: Teacher }) => {
  const initials = teacher.name.split(" ").map((w) => w[0]).join("").slice(0, 2);

  return (
    <div className="card-base card-hover flex flex-col">
      <div className="p-6 flex gap-4">
        <div className="w-16 h-16 rounded-full stats-gradient text-primary-foreground flex items-center justify-center text-lg font-black shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-extrabold">{teacher.name}</h3>
            {teacher.verified && (
              <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full font-semibold">✓ موثق</span>
            )}
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed mt-1 line-clamp-2">{teacher.title}</p>
        </div>
      </div>

      <div className="px-6 pb-4 flex flex-wrap gap-2">
        {teacher.subjects.slice(0, 3).map((s) => (
          <span key={s} className="badge-brand text-xs">{s}</span>
        ))}
      </div>

      <div className="px-6 py-3 border-t bg-secondary/50 flex items-center justify-between">
        <div>
          <span className="text-lg font-extrabold text-primary">{teacher.price} {teacher.currency}</span>
          <span className="text-muted-foreground text-xs mr-1">/ جلسة</span>
        </div>
        <div className="flex items-center gap-1">
          <Star size={16} className="fill-warning text-warning" />
          <span className="font-bold text-sm">{teacher.rating}</span>
          <span className="text-muted-foreground text-xs">({teacher.reviews})</span>
        </div>
      </div>

      <div className="p-4 pt-3">
        <Link to={`/teachers/${teacher.id}`} className="btn-primary block text-center text-sm w-full">
          عرض الملف الشخصي ↗
        </Link>
      </div>
    </div>
  );
};

export default TeacherCard;
