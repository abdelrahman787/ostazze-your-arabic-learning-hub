// Exports the canonical country/university/college/subject paths from src/lib/slugs.ts
// so the sitemap generator uses exactly the same URLs as the app.
import { writeFileSync } from "node:fs";
import { allUniversities } from "../src/data/universitiesData";
import { allSubjectSlugs, countryPath, universityPath, collegePath } from "../src/lib/slugs";

const paths = new Set<string>();
for (const u of allUniversities) {
  paths.add(countryPath(u.country_code));
  paths.add(universityPath(u));
  u.colleges.forEach((c) => c.departments.length && paths.add(collegePath(u, c)));
}
allSubjectSlugs().forEach((s) => paths.add(`/subjects/${s}`));
writeFileSync("scripts/.route-slugs.json", JSON.stringify([...paths], null, 0));
console.log(`route slugs exported: ${paths.size}`);
