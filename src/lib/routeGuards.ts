// Server- and client-side route checks: legacy URLs 301 to their clean form, unknown slugs 404.
// Uses only the lightweight generated indexes, so no page downloads the full catalog.
import { notFound, redirect } from "@tanstack/react-router";
import { UNIVERSITY_INDEX } from "@/data/universities/universityIndex.generated";
import { countryCodeFromSlug, findUniversityBySlugs, universityPath } from "@/lib/slugs";
import { subjectNameFromSlug, subjectPath } from "@/lib/subjectSlugs";

export function redirectLegacySubjectQuery(search: Record<string, unknown>) {
  const dept = typeof search["department"] === "string" ? (search["department"] as string) : "";
  if (dept) throw redirect({ href: subjectPath(dept), statusCode: 301 });
}

export function requireSubject(slug: string) {
  if (!subjectNameFromSlug(slug)) throw notFound();
}

export function requireCountry(slug: string) {
  if (!countryCodeFromSlug(slug)) throw notFound();
}

export function requireUniversity(cSlug: string, uSlug: string) {
  if (!findUniversityBySlugs(cSlug, uSlug)) throw notFound();
}

// Legacy /universities/KW-KU/colleges/<id> -> /universities/kuwait/ku/colleges/<id>
export function redirectLegacyCollege(uniId: string, collegeId: string) {
  const uni = UNIVERSITY_INDEX.find((u) => u.id.toLowerCase() === uniId.toLowerCase());
  if (!uni) throw notFound();
  throw redirect({ href: `${universityPath(uni)}/colleges/${collegeId.toLowerCase()}`, statusCode: 301 });
}

export async function requireCollege(cSlug: string, uSlug: string, collegeId: string) {
  const summary = findUniversityBySlugs(cSlug, uSlug);
  if (!summary) throw notFound();
  const { loadCountry } = await import("@/data/universities/loader");
  const unis = await loadCountry(summary.country_code);
  const uni = unis.find((u) => u.id === summary.id);
  if (!uni?.colleges.some((c) => c.id.toLowerCase() === collegeId.toLowerCase())) throw notFound();
}
