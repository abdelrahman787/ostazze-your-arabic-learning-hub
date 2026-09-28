// Subject (academic department) URL slugs + indexability. Split from ./slugs so pages that only
// need country/university URLs don't download the subject index.
import { SUBJECT_INDEX } from "@/data/universities/subjectIndex.generated";
import { slugify, MIN_INDEXABLE_COURSES, BUCKET_NAME } from "@/lib/slugs";

// Slugs are precomputed in the generated subject index (see src/data/universities/buildIndex.ts).
const subjectSlugByName = new Map(SUBJECT_INDEX.map((x) => [x.name_en, x.slug]));
const subjectNameBySlug = new Map(SUBJECT_INDEX.map((x) => [x.slug, x.name_en]));
const subjectCourseCount = new Map(SUBJECT_INDEX.map((x) => [x.name_en, x.uniqueCourses]));

export const subjectSlug = (nameEn: string) => subjectSlugByName.get(nameEn) || slugify(nameEn);
export const subjectNameFromSlug = (slug?: string) => (slug ? subjectNameBySlug.get(slug.toLowerCase()) : undefined);
export const subjectPath = (nameEn: string) => `/subjects/${subjectSlug(nameEn)}`;
export const allSubjectSlugs = () => [...subjectNameBySlug.keys()];
export const subjectCourses = (nameEn: string) => subjectCourseCount.get(nameEn) || 0;
export const isSubjectIndexable = (nameEn: string) =>
  subjectCourses(nameEn) >= MIN_INDEXABLE_COURSES && !BUCKET_NAME.test(nameEn);
