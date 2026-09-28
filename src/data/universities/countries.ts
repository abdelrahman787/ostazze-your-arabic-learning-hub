// Country directory built from the lightweight university index (no colleges or courses).
import { UNIVERSITY_INDEX } from "./universityIndex.generated";
import type { UniversitySummary } from "./buildIndex";

export type { UniversitySummary };

export interface CountrySummary {
  code: string;
  name_ar: string;
  name_en: string;
  universities: UniversitySummary[];
}

export const COUNTRY_INDEX: CountrySummary[] = (() => {
  const map = new Map<string, CountrySummary>();
  for (const u of UNIVERSITY_INDEX) {
    if (!map.has(u.country_code)) {
      map.set(u.country_code, {
        code: u.country_code,
        name_ar: u.country_ar,
        name_en: u.country_en,
        universities: [],
      });
    }
    map.get(u.country_code)!.universities.push(u);
  }
  return [...map.values()];
})();

export const findUniversitySummary = (id?: string) =>
  id ? UNIVERSITY_INDEX.find((u) => u.id === id) : undefined;
export { UNIVERSITY_INDEX };
