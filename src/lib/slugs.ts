// Central, deterministic URL slug mapping for subjects, countries, universities and colleges.
// Slugs come only from static English source data (never translated UI text),
// so URLs stay identical in Arabic and English.
import type { University, College } from "@/data/universities/types";
import { UNIVERSITY_INDEX } from "@/data/universities/universityIndex.generated";
import { SUBJECT_INDEX } from "@/data/universities/subjectIndex.generated";
import { slugify } from "@/lib/slugify";

export { slugify };

// ---- Countries ----
export const COUNTRY_SLUGS: Record<string, string> = {
  KW: "kuwait",
  QA: "qatar",
  SA: "saudi-arabia",
  AE: "uae",
  EG: "egypt",
};
const SLUG_TO_COUNTRY = Object.fromEntries(Object.entries(COUNTRY_SLUGS).map(([c, s]) => [s, c]));

export const countrySlug = (code: string) => COUNTRY_SLUGS[code] || code.toLowerCase();
export const countryCodeFromSlug = (slug?: string) => (slug ? SLUG_TO_COUNTRY[slug.toLowerCase()] : undefined);

// ---- Universities: slug = id suffix, e.g. "KW-KU" -> "ku" ----
// Resolves against the lightweight index; load the full record with the country loader.
export const universitySlug = (u: Pick<University, "id">) => u.id.split("-").slice(1).join("-").toLowerCase();
export const findUniversityBySlugs = (cSlug?: string, uSlug?: string) => {
  const code = countryCodeFromSlug(cSlug);
  if (!code || !uSlug) return undefined;
  return UNIVERSITY_INDEX.find((u) => u.country_code === code && universitySlug(u) === uSlug.toLowerCase());
};

// ---- Colleges: slug = lowercased college id ----
export const collegeSlug = (c: Pick<College, "id">) => c.id.toLowerCase();

// ---- Path builders (the only place URLs are built) ----
export const universitiesPath = () => "/universities";
export const countryPath = (code: string) => `/universities/${countrySlug(code)}`;
export const universityPath = (u: Pick<University, "id" | "country_code">) =>
  `${countryPath(u.country_code)}/${universitySlug(u)}`;
export const collegePath = (u: Pick<University, "id" | "country_code">, c: Pick<College, "id">) =>
  `${universityPath(u)}/colleges/${collegeSlug(c)}`;

// ---- Subjects (academic departments), keyed by English department name ----
// Slugs are precomputed in the generated subject index (see src/data/universities/buildIndex.ts).
const subjectSlugByName = new Map(SUBJECT_INDEX.map((x) => [x.name_en, x.slug]));
const subjectNameBySlug = new Map(SUBJECT_INDEX.map((x) => [x.slug, x.name_en]));
const subjectCourseCount = new Map(SUBJECT_INDEX.map((x) => [x.name_en, x.uniqueCourses]));

export const subjectSlug = (nameEn: string) => subjectSlugByName.get(nameEn) || slugify(nameEn);
export const subjectNameFromSlug = (slug?: string) => (slug ? subjectNameBySlug.get(slug.toLowerCase()) : undefined);
export const subjectPath = (nameEn: string) => `/subjects/${subjectSlug(nameEn)}`;
export const allSubjectSlugs = () => [...subjectNameBySlug.keys()];

// ---- Indexability: only pages with real, distinct content go in the sitemap / get indexed ----
export const MIN_INDEXABLE_COURSES = 5;
// Department names that are requirement buckets rather than real subjects.
const BUCKET_NAME = /elective|choose|option|\bcore\b|requirement|free\s|general education|minor|track|concentration/i;

export const subjectCourses = (nameEn: string) => subjectCourseCount.get(nameEn) || 0;
export const isSubjectIndexable = (nameEn: string) =>
  subjectCourses(nameEn) >= MIN_INDEXABLE_COURSES && !BUCKET_NAME.test(nameEn);
export const collegeCourseCount = (c: Pick<College, "departments">) =>
  c.departments.reduce((s, d) => s + d.courses.length, 0);
export const isCollegeIndexable = (c: Pick<College, "departments">) => collegeCourseCount(c) >= MIN_INDEXABLE_COURSES;
export const isUniversityIndexable = (u: Pick<University, "colleges"> | { indexable: boolean }) =>
  "indexable" in u ? u.indexable : u.colleges.some(isCollegeIndexable);
