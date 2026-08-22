import { Link } from "react-router-dom";
import { GraduationCap, ArrowUpLeft, BadgeCheck, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBilingual } from "@/hooks/useBilingual";
import { getTeacherMajor } from "@/lib/teacherMajors";
import { getTeacherAvatar } from "@/lib/teacherAvatars";
import { resolveDisplayName } from "@/lib/teacherNameTranslate";

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
  major?: string | null;
  major_en?: string | null;
  price: number;
  verified: boolean;
}

const TeacherCard = ({ teacher, index = 0 }: { teacher: TeacherData; index?: number }) => {
  const { t, lang } = useLanguage();
  const { b } = useBilingual();

  const displayName = resolveDisplayName(
    lang === "en" ? "en" : "ar",
    teacher.full_name,
    teacher.full_name_en,
    t("the_teacher")
  );
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary/40 transition-all duration-300 flex flex-col"
    >
      {/* Decorative gradient header */}
      <div className="relative h-24 bg-gradient-to-br from-primary/25 via-primary/10 to-transparent">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.35),transparent_60%)]" />
        {teacher.verified && (
          <span className="absolute top-3 end-3 inline-flex items-center gap-1 rounded-full bg-success/15 text-success text-[10px] font-bold px-2.5 py-1">
            <BadgeCheck size={12} />
            {t("teacher_verified")}
          </span>
        )}
      </div>

      {/* Avatar (overlaps header) */}
      <div className="px-5 -mt-10 flex items-end gap-3">
        <div className="relative shrink-0">
          <img
            src={teacher.avatar_url || getTeacherAvatar(teacher.user_id, teacher.full_name)}
            alt={displayName}
            className="w-20 h-20 rounded-2xl object-cover border-4 border-card shadow-md"
            loading="lazy"
            decoding="async"
            width={80}
            height={80}
          />
        </div>

      </div>

      {/* Body */}
      <div className="px-5 pt-4 pb-5 flex-1 flex flex-col">
        <h3 className="font-extrabold text-base leading-tight mb-1 line-clamp-1">
          {displayName}
        </h3>
        <div className="flex items-center gap-1.5 mb-4 text-primary">
          <BookOpen size={13} />
          <span className="text-xs font-semibold">
            {b(teacher.major, teacher.major_en) ||
              getTeacherMajor(teacher.user_id, lang === "en" ? "en" : "ar")}
          </span>
        </div>



        <div className="mt-auto">
          <Link
            to={`/teachers/${teacher.user_id}`}
            className="btn-primary flex items-center justify-center gap-2 text-sm w-full group-hover:gap-3 transition-all"
          >
            {t("teacher_view_profile")}
            <ArrowUpLeft size={14} className="rtl:rotate-90" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default TeacherCard;
