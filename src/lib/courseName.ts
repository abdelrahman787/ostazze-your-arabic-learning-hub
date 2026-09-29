// Display name for a catalog course. Entries flagged name_status "missing" have no verified
// official name (only a verified code); "ar_only" have only the official Arabic name.
export const UNAVAILABLE_NAME = {
  ar: "الاسم الرسمي للمقرر غير متاح",
  en: "Official course name unavailable",
} as const;

export interface NamedCourse {
  name_en: string;
  name_ar: string;
  name_status?: "missing" | "ar_only";
}

export const hasVerifiedName = (c: NamedCourse) => c.name_status !== "missing";

export function courseDisplayName(c: NamedCourse, lang: string): string {
  if (!hasVerifiedName(c)) return lang === "ar" ? UNAVAILABLE_NAME.ar : UNAVAILABLE_NAME.en;
  if (lang === "ar") return c.name_ar || c.name_en;
  return c.name_en || c.name_ar;
}
