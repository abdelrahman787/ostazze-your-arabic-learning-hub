// College -> category classification. Pure logic, shared by the catalog index generator and the UI.
export const collegeToCategory: Record<
  string,
  { ar: string; en: string; icon: string }
> = {
  engineering: {
    ar: "الهندسة والبترول",
    en: "Engineering & Petroleum",
    icon: "⚙️",
  },
  science: { ar: "العلوم", en: "Sciences", icon: "🔬" },
  arts: { ar: "الآداب والعلوم الإنسانية", en: "Arts & Humanities", icon: "📚" },
  medicine: { ar: "الطب", en: "Medicine", icon: "🏥" },
  business: { ar: "إدارة الأعمال", en: "Business Administration", icon: "📊" },
  law: { ar: "الحقوق والقانون", en: "Law", icon: "⚖️" },
  education: { ar: "التربية", en: "Education", icon: "🎓" },
  pharmacy: { ar: "الصيدلة", en: "Pharmacy", icon: "💊" },
  nursing: { ar: "التمريض", en: "Nursing", icon: "🩺" },
  sharia: {
    ar: "الشريعة والدراسات الإسلامية",
    en: "Sharia & Islamic Studies",
    icon: "📖",
  },
  allied: {
    ar: "العلوم الطبية المساندة",
    en: "Allied Health Sciences",
    icon: "🧬",
  },
  computing: {
    ar: "الحوسبة وتقنية المعلومات",
    en: "Computing & IT",
    icon: "💻",
  },
  design: { ar: "الفنون والتصميم", en: "Fine Arts & Design", icon: "🎨" },
  health: { ar: "العلوم الصحية", en: "Health Sciences", icon: "❤️" },
  technology: { ar: "التكنولوجيا", en: "Technology", icon: "🔧" },
};

export function classifyCollege(nameEn: string): string {
  const lower = nameEn.toLowerCase();
  if (lower.includes("engineering") || lower.includes("petroleum"))
    return "engineering";
  if (
    lower.includes("computer") ||
    lower.includes("computing") ||
    lower.includes("information technology")
  )
    return "computing";
  if (lower.includes("medicine") || lower.includes("medical"))
    return "medicine";
  if (
    lower.includes("business") ||
    lower.includes("management") ||
    lower.includes("economics")
  )
    return "business";
  if (lower.includes("law")) return "law";
  if (lower.includes("education")) return "education";
  if (lower.includes("pharmacy")) return "pharmacy";
  if (lower.includes("nursing")) return "nursing";
  if (lower.includes("sharia") || lower.includes("islamic")) return "sharia";
  if (lower.includes("allied") || lower.includes("health science"))
    return "allied";
  if (lower.includes("science") && !lower.includes("art")) return "science";
  if (
    lower.includes("art") ||
    lower.includes("humanities") ||
    lower.includes("social")
  )
    return "arts";
  if (lower.includes("fine art") || lower.includes("design")) return "design";
  if (lower.includes("technology") || lower.includes("udst"))
    return "technology";
  if (lower.includes("health")) return "health";
  return "arts";
}
