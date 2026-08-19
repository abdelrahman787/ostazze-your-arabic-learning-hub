// Heuristic ranking of how "popular" (in-demand for tutoring) a course is.
// Purely presentational: used to surface the most requested courses at the top
// of each department listing.

interface RankableCourse {
  code: string;
  name_ar: string;
  name_en: string;
  credits?: number;
  year?: number;
  term?: string;
  type?: string;
}

const HIGH_DEMAND = [
  "calculus", "math", "algebra", "statistic", "probability",
  "physics", "chemistry", "biology",
  "programming", "computer", "data structure", "algorithm", "database",
  "circuit", "thermodynamic", "mechanic", "dynamics", "statics",
  "accounting", "economics", "finance",
  "english", "writing",
  "anatomy", "physiology",
];

const HIGH_DEMAND_AR = [
  "تفاضل", "رياض", "جبر", "إحصاء", "احتمال",
  "فيزياء", "كيمياء", "أحياء",
  "برمجة", "حاسب", "بيانات", "خوارزم",
  "دوائر", "ديناميك", "استاتيكا", "حرارية",
  "محاسبة", "اقتصاد", "تمويل",
  "إنجليز", "كتابة",
  "تشريح", "وظائف الأعضاء",
];

export const coursePopularityScore = (c: RankableCourse): number => {
  let score = 0;
  const en = (c.name_en || "").toLowerCase();
  const ar = c.name_ar || "";

  if (HIGH_DEMAND.some((k) => en.includes(k))) score += 6;
  if (HIGH_DEMAND_AR.some((k) => ar.includes(k))) score += 6;

  // Foundational years get requested most
  if (c.year === 1) score += 4;
  else if (c.year === 2) score += 3;
  else if (c.year === 3) score += 1;

  // Required courses are taken by everyone
  if (c.type && !c.type.toLowerCase().includes("elective")) score += 3;

  // Heavier credit courses are harder → more tutoring demand
  if ((c.credits ?? 0) >= 3) score += 1;

  // Intro-level course codes (e.g. MATH 101)
  const num = c.code.match(/(\d{3,4})/)?.[1];
  if (num && Number(num) < 200) score += 2;

  return score;
};

export const getPopularCourses = <T extends RankableCourse>(courses: T[], limit = 6): T[] =>
  [...courses]
    .map((c, i) => ({ c, i, s: coursePopularityScore(c) }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .slice(0, limit)
    .filter((x) => x.s > 0)
    .map((x) => x.c);
