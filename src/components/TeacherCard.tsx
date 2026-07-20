import { Link } from "react-router-dom";
import { GraduationCap, ArrowUpLeft, BadgeCheck } from "lucide-react";
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

// Basic Arabic → English transliteration fallback for names not stored bilingually.
const AR_MAP: Record<string, string> = {
  "ا": "a", "أ": "a", "إ": "i", "آ": "aa", "ب": "b", "ت": "t", "ث": "th",
  "ج": "j", "ح": "h", "خ": "kh", "د": "d", "ذ": "dh", "ر": "r", "ز": "z",
  "س": "s", "ش": "sh", "ص": "s", "ض": "d", "ط": "t", "ظ": "z", "ع": "a",
  "غ": "gh", "ف": "f", "ق": "q", "ك": "k", "ل": "l", "م": "m", "ن": "n",
  "ه": "h", "و": "w", "ي": "y", "ى": "a", "ة": "h", "ء": "", "ؤ": "o", "ئ": "e",
};

const transliterate = (name: string) => {
  const out = name
    .split("")
    .map((ch) => (AR_MAP[ch] !== undefined ? AR_MAP[ch] : ch))
    .join("");
  return out
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const TeacherCard = ({ teacher, index = 0 }: { teacher: TeacherData; index?: number }) => {
  const { t, lang } = useLanguage();
  const { b } = useBilingual();

  const rawName = b(teacher.full_name, teacher.full_name_en, t("the_teacher"));
  const displayName =
    lang === "en" && !teacher.full_name_en && /[\u0600-\u06FF]/.test(rawName)
      ? transliterate(rawName)
      : rawName;
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
          <span className="absolute top-3 end-3 inline-flex items-center gap-1 rounded-full bg-success/15 text-success text-[10px] font-bold px-2.5 py-1 backdrop-blur-sm">
            <BadgeCheck size={12} />
            {t("teacher_verified")}
          </span>
        )}
      </div>

      {/* Avatar (overlaps header) */}
      <div className="px-5 -mt-10 flex items-end gap-3">
        <div className="relative shrink-0">
          {teacher.avatar_url ? (
            <img
              src={teacher.avatar_url}
              alt={displayName}
              className="w-20 h-20 rounded-2xl object-cover border-4 border-card shadow-md"
              loading="lazy"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl border-4 border-card shadow-md bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center font-extrabold text-xl">
              {initials || <GraduationCap size={26} />}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pt-4 pb-5 flex-1 flex flex-col">
        <h3 className="font-extrabold text-base leading-tight mb-4 line-clamp-1">
          {displayName}
        </h3>


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
