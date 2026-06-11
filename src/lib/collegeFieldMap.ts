import {
  Stethoscope,
  Cog,
  Briefcase,
  FlaskConical,
  Palette,
  Monitor,
  Scale,
  GraduationCap,
  Users,
  Activity,
  BookOpen,
  Building2,
  type LucideIcon,
} from "lucide-react";

export interface CollegeField {
  id: string;
  label_ar: string;
  label_en: string;
  icon: LucideIcon;
  /** Tailwind gradient classes for the card surface */
  gradient: string;
  /** Tailwind text color for accents */
  accent: string;
  /** Tailwind ring color */
  ring: string;
  /** Order priority — lower comes first */
  order: number;
}

export const COLLEGE_FIELDS: Record<string, CollegeField> = {
  health: {
    id: "health",
    label_ar: "الصحة والطب",
    label_en: "Health & Medicine",
    icon: Stethoscope,
    gradient: "from-rose-500/15 via-red-500/10 to-pink-500/5",
    accent: "text-rose-600 dark:text-rose-400",
    ring: "ring-rose-500/30",
    order: 1,
  },
  engineering: {
    id: "engineering",
    label_ar: "الهندسة والتكنولوجيا",
    label_en: "Engineering & Tech",
    icon: Cog,
    gradient: "from-blue-500/15 via-indigo-500/10 to-sky-500/5",
    accent: "text-blue-600 dark:text-blue-400",
    ring: "ring-blue-500/30",
    order: 2,
  },
  it: {
    id: "it",
    label_ar: "الحاسبات والمعلومات",
    label_en: "Computing & IT",
    icon: Monitor,
    gradient: "from-cyan-500/15 via-teal-500/10 to-sky-500/5",
    accent: "text-cyan-600 dark:text-cyan-400",
    ring: "ring-cyan-500/30",
    order: 3,
  },
  business: {
    id: "business",
    label_ar: "الأعمال والإدارة",
    label_en: "Business & Management",
    icon: Briefcase,
    gradient: "from-amber-500/15 via-orange-500/10 to-yellow-500/5",
    accent: "text-amber-600 dark:text-amber-400",
    ring: "ring-amber-500/30",
    order: 4,
  },
  science: {
    id: "science",
    label_ar: "العلوم الأساسية",
    label_en: "Natural Sciences",
    icon: FlaskConical,
    gradient: "from-violet-500/15 via-purple-500/10 to-fuchsia-500/5",
    accent: "text-violet-600 dark:text-violet-400",
    ring: "ring-violet-500/30",
    order: 5,
  },
  arts: {
    id: "arts",
    label_ar: "الآداب والفنون",
    label_en: "Arts & Humanities",
    icon: Palette,
    gradient: "from-pink-500/15 via-rose-500/10 to-fuchsia-500/5",
    accent: "text-pink-600 dark:text-pink-400",
    ring: "ring-pink-500/30",
    order: 6,
  },
  law: {
    id: "law",
    label_ar: "الحقوق والشريعة",
    label_en: "Law & Sharia",
    icon: Scale,
    gradient: "from-slate-500/15 via-zinc-500/10 to-gray-500/5",
    accent: "text-slate-700 dark:text-slate-300",
    ring: "ring-slate-500/30",
    order: 7,
  },
  education: {
    id: "education",
    label_ar: "التربية والتعليم",
    label_en: "Education",
    icon: GraduationCap,
    gradient: "from-emerald-500/15 via-green-500/10 to-teal-500/5",
    accent: "text-emerald-600 dark:text-emerald-400",
    ring: "ring-emerald-500/30",
    order: 8,
  },
  social: {
    id: "social",
    label_ar: "العلوم الاجتماعية والإعلام",
    label_en: "Social Sciences & Media",
    icon: Users,
    gradient: "from-teal-500/15 via-cyan-500/10 to-emerald-500/5",
    accent: "text-teal-600 dark:text-teal-400",
    ring: "ring-teal-500/30",
    order: 9,
  },
  sport: {
    id: "sport",
    label_ar: "الرياضة",
    label_en: "Sport Sciences",
    icon: Activity,
    gradient: "from-orange-500/15 via-amber-500/10 to-red-500/5",
    accent: "text-orange-600 dark:text-orange-400",
    ring: "ring-orange-500/30",
    order: 10,
  },
  islamic: {
    id: "islamic",
    label_ar: "الدراسات الإسلامية",
    label_en: "Islamic Studies",
    icon: BookOpen,
    gradient: "from-green-600/15 via-emerald-500/10 to-teal-500/5",
    accent: "text-green-700 dark:text-green-400",
    ring: "ring-green-500/30",
    order: 11,
  },
  other: {
    id: "other",
    label_ar: "تخصصات أخرى",
    label_en: "Other Fields",
    icon: Building2,
    gradient: "from-primary/15 via-primary/10 to-accent/5",
    accent: "text-primary",
    ring: "ring-primary/30",
    order: 99,
  },
};

/** Match any text (Arabic or English) to a field id. */
export function getFieldId(nameAr: string, nameEn: string): string {
  const text = (nameAr + " " + nameEn).toLowerCase();

  // Order matters: more specific first
  if (
    /(medicine|medical|dental|dentistry|pharmac|nursing|health|veterinar|طب|صحة|تمريض|أسنان|صيدلة|بيطر)/.test(
      text
    )
  )
    return "health";

  if (/(computer|software|informatics|cyber|data\s*science|artificial|حاسب|معلوماتية|سيبراني|برمجيات)/.test(text))
    return "it";
  if (/(information\s*technology|\bit\b|\bcit\b)/.test(text)) return "it";

  if (/(engineer|engineering|architecture|architectural|هندسة|عمارة)/.test(text))
    return "engineering";

  if (
    /(business|commerce|economic|management|administration|marketing|accounting|finance|إدارة|تجارة|اقتصاد|محاسبة|مالية|تسويق)/.test(
      text
    )
  )
    return "business";

  if (
    /(science|physics|chemistry|biology|mathematics|\bmath\b|statistics|علوم|فيزياء|كيمياء|أحياء|رياضيات|إحصاء)/.test(
      text
    )
  )
    return "science";

  if (
    /(arts|humanities|literature|languages|design|fine\s*arts|آداب|فنون|لغات|أدب|تصميم)/.test(
      text
    )
  )
    return "arts";

  if (/(law|legal|sharia|حقوق|قانون|شريعة)/.test(text)) return "law";

  if (/(education|تربية|تعليم|pedagog)/.test(text)) return "education";

  if (
    /(social|sociology|psychology|media|communication|journalism|اجتماع|نفس|إعلام|اتصال)/.test(
      text
    )
  )
    return "social";

  if (/(sport|physical\s*education|رياضة|رياضي)/.test(text)) return "sport";

  if (/(islamic|religious|theology|إسلامية|شرعية|دين)/.test(text))
    return "islamic";

  return "other";
}

export function getCollegeField(nameAr: string, nameEn: string): CollegeField {
  return COLLEGE_FIELDS[getFieldId(nameAr, nameEn)];
}

/** Group an array of items by field, returning ordered list of { field, items }. */
export function groupByField<T>(
  items: T[],
  getName: (item: T) => { ar: string; en: string }
): { field: CollegeField; items: T[] }[] {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const { ar, en } = getName(item);
    const id = getFieldId(ar, en);
    if (!map.has(id)) map.set(id, []);
    map.get(id)!.push(item);
  }
  return Array.from(map.entries())
    .map(([id, list]) => ({ field: COLLEGE_FIELDS[id], items: list }))
    .sort((a, b) => a.field.order - b.field.order);
}
