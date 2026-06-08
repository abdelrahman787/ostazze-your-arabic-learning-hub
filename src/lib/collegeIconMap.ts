import {
  Stethoscope,
  Pill,
  Cog,
  Briefcase,
  GraduationCap,
  Scale,
  FlaskConical,
  Palette,
  Monitor,
  Leaf,
  Radio,
  Users,
  BookOpen,
  Wrench,
  HardHat,
  Building2,
  type LucideIcon,
} from "lucide-react";

export function getCollegeIcon(nameAr: string, nameEn: string): LucideIcon {
  const ar = nameAr.toLowerCase();
  const en = nameEn.toLowerCase();

  const text = ar + " " + en;

  // Medicine / Health
  if (
    text.includes("medicine") ||
    text.includes("medical") ||
    text.includes("طب") ||
    text.includes("صحة") ||
    text.includes("health") ||
    text.includes(" Nursing ") ||
    text.includes("تمريض")
  ) {
    return Stethoscope;
  }

  // Pharmacy
  if (
    text.includes("pharmacy") ||
    text.includes("pharmaceutical") ||
    text.includes("صيدلة") ||
    text.includes(" farm ")
  ) {
    return Pill;
  }

  // Engineering
  if (
    text.includes("engineering") ||
    text.includes("engineer") ||
    text.includes("هندسة") ||
    text.includes("technolog") ||
    text.includes("تكنولوجيا")
  ) {
    return Cog;
  }

  // Business / Commerce / Economics / Management
  if (
    text.includes("business") ||
    text.includes("commerce") ||
    text.includes("economics") ||
    text.includes("management") ||
    text.includes("administration") ||
    text.includes("marketing") ||
    text.includes("accounting") ||
    text.includes("finance") ||
    text.includes("إدارة") ||
    text.includes("تجارة") ||
    text.includes("اقتصاد") ||
    text.includes("محاسبة") ||
    text.includes("مالية") ||
    text.includes("marketing")
  ) {
    return Briefcase;
  }

  // Education
  if (
    text.includes("education") ||
    text.includes("تربية") ||
    text.includes("تعليم")
  ) {
    return GraduationCap;
  }

  // Law
  if (
    text.includes("law") ||
    text.includes("legal") ||
    text.includes("حقوق") ||
    text.includes("قانون") ||
    text.includes("sharia") ||
    text.includes("شريعة")
  ) {
    return Scale;
  }

  // Science (Physics, Chemistry, Biology, Math, Science faculties)
  if (
    text.includes("science") ||
    text.includes("physics") ||
    text.includes("chemistry") ||
    text.includes("biology") ||
    text.includes("mathematics") ||
    text.includes("math") ||
    text.includes("علوم") ||
    text.includes("فيزياء") ||
    text.includes("كيمياء") ||
    text.includes("أحياء") ||
    text.includes("رياضيات") ||
    text.includes("statistics")
  ) {
    return FlaskConical;
  }

  // Arts / Humanities / Languages / Literature
  if (
    text.includes("arts") ||
    text.includes("humanities") ||
    text.includes("literature") ||
    text.includes("languages") ||
    text.includes("آداب") ||
    text.includes("فنون") ||
    text.includes("لغات") ||
    text.includes("أدب")
  ) {
    return Palette;
  }

  // Computer / IT / Information Systems
  if (
    text.includes("computer") ||
    text.includes("information technology") ||
    text.includes("informatics") ||
    text.includes("حاسبات") ||
    text.includes("معلوماتية")
  ) {
    return Monitor;
  }

  // Agriculture / Environment / Natural Resources
  if (
    text.includes("agriculture") ||
    text.includes("environment") ||
    text.includes("زراعة") ||
    text.includes("بيئة")
  ) {
    return Leaf;
  }

  // Media / Communication / Journalism
  if (
    text.includes("media") ||
    text.includes("communication") ||
    text.includes("journalism") ||
    text.includes("إعلام") ||
    text.includes("اتصال")
  ) {
    return Radio;
  }

  // Social Sciences / Sociology / Psychology
  if (
    text.includes("social") ||
    text.includes("sociology") ||
    text.includes("psychology") ||
    text.includes("اجتماع") ||
    text.includes("نفس")
  ) {
    return Users;
  }

  // Architecture / Design / Urban Planning
  if (
    text.includes("architecture") ||
    text.includes("architectural") ||
    text.includes("design") ||
    text.includes("urban") ||
    text.includes("عمارة") ||
    text.includes("تصميم") ||
    text.includes("تخطيط")
  ) {
    return HardHat;
  }

  // Applied / Technical / Industrial
  if (
    text.includes("applied") ||
    text.includes("technical") ||
    text.includes("industrial") ||
    text.includes("تطبيقية") ||
    text.includes("صناعية")
  ) {
    return Wrench;
  }

  // Islamic / Religious Studies
  if (
    text.includes("islamic") ||
    text.includes("religious") ||
    text.includes("theology") ||
    text.includes("دراسات إسلامية") ||
    text.includes("دين")
  ) {
    return BookOpen;
  }

  // Default fallback
  return Building2;
}
