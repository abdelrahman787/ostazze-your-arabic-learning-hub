import { Link } from "react-router-dom";
import { Star, User, ArrowUpLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBilingual } from "@/hooks/useBilingual";

export interface TeacherData {
  user_id: string;
  full_name: string;
  full_name_en?: string | null;
  bio: string | null;
  bio_en?: string | null;
  avatar_url: string | null;
  subjects: string[];
  subjects_en?: string[];
  university: string | null;
  university_en?: string | null;
  price: number;
  verified: boolean;
}

const TeacherCard = ({ teacher, index = 0 }: { teacher: TeacherData; index?: number }) => {
  const { t } = useLanguage();
  const { b, bArr } = useBilingual();

  const displayName = b(teacher.full_name, teacher.full_name_en, t("the_teacher"));
  const displayUni = b(teacher.university, teacher.university_en);
  const displaySubjects = bArr(teacher.subjects, teacher.subjects_en);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="card-base flex flex-col hover:border-primary/30 hover:shadow-lg transition-all duration-200"
    >
      <div className="p-5 pb-3 flex gap-3">
        <div className="relative shrink-0">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="icon-box-lg bg-primary/10 text-primary"
          >
            <User size={22} />
          </motion.div>
          {teacher.verified && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.3 }}
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-[0.95rem] mb-1">{displayName}</h3>
          {displayUni && (
            <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">{displayUni}</p>
          )}
        </div>
      </div>

      <div className="px-5 pb-4 flex flex-wrap gap-1.5">
        {displaySubjects.slice(0, 3).map((s, i) => (
          <span key={i} className="tag-outline">{s}</span>
        ))}
      </div>

      <div className="flex-1" />

      <div className="px-5 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <motion.div whileHover={{ rotate: 72, scale: 1.3 }} transition={{ type: "spring" }}>
            <Star size={14} className="fill-warning text-warning" />
          </motion.div>
          <span className="font-bold text-sm">-</span>
        </div>
        <div className="text-left">
          <span className="text-lg font-extrabold text-primary">{teacher.price}</span>
          <span className="text-muted-foreground text-xs mr-1">{t("sar")}</span>
          <div className="text-muted-foreground text-[0.65rem]">{t("teacher_per_session")}</div>
        </div>
      </div>

      <div className="px-5 pb-5">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link to={`/teachers/${teacher.user_id}`} className="btn-primary flex items-center justify-center gap-2 text-sm w-full">
            {t("teacher_view_profile")}
            <motion.div whileHover={{ x: -3, y: -3 }}>
              <ArrowUpLeft size={14} />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TeacherCard;
