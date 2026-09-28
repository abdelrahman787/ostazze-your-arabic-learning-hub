// Exports the canonical country/university/college/subject paths from src/lib/slugs.ts
// so the sitemap generator uses exactly the same URLs as the app.
import { writeFileSync } from "node:fs";
import { allUniversities } from "../src/data/universities/all";
import {
  countryPath,
  universityPath,
  collegePath,
  isCollegeIndexable,
  isUniversityIndexable,
} from "../src/lib/slugs";
import {
  allSubjectSlugs,
  subjectNameFromSlug,
  isSubjectIndexable,
} from "../src/lib/subjectSlugs";

const paths = new Set<string>();
for (const u of allUniversities) {
  paths.add(countryPath(u.country_code));
  if (!isUniversityIndexable(u)) continue;
  paths.add(universityPath(u));
  u.colleges.forEach(
    (c) => isCollegeIndexable(c) && paths.add(collegePath(u, c)),
  );
}
allSubjectSlugs()
  .filter((s) => isSubjectIndexable(subjectNameFromSlug(s)!))
  .forEach((s) => paths.add(`/subjects/${s}`));
writeFileSync("scripts/.route-slugs.json", JSON.stringify([...paths], null, 0));
console.log(`route slugs exported: ${paths.size}`);
