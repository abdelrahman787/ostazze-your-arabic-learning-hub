// Validates public/sitemap.xml. Exits non-zero (failing the build) on any problem.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { BASE_URL, BLOCKED_PREFIXES, fetchRows, TEACHERS_QUERY, COURSES_QUERY } from "./sitemap-shared.mjs";

const xml = readFileSync(resolve("public/sitemap.xml"), "utf8");
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
const errors = [];

if (locs.length === 0) errors.push("sitemap contains no URLs");

const seen = new Set();
for (const loc of locs) {
  if (seen.has(loc)) errors.push(`duplicate URL: ${loc}`);
  seen.add(loc);
  if (!loc.startsWith(BASE_URL + "/")) { errors.push(`URL outside ${BASE_URL}: ${loc}`); continue; }
  const path = loc.slice(BASE_URL.length);
  if (BLOCKED_PREFIXES.some((p) => path === p || path.startsWith(p + "/"))) errors.push(`protected/noindex route included: ${loc}`);
}

const idsOf = (prefix) => locs.map((l) => l.slice(BASE_URL.length)).filter((p) => p.startsWith(prefix)).map((p) => p.slice(prefix.length));
const teacherIds = idsOf("/teachers/");
const courseIds = idsOf("/courses/");

try {
  const [teachers, courses] = await Promise.all([fetchRows(TEACHERS_QUERY), fetchRows(COURSES_QUERY)]);
  const userIds = new Set(teachers.map((t) => t.user_id));
  const profileIds = new Set(teachers.map((t) => t.id));
  const publishedCourses = new Set(courses.map((c) => c.id));
  for (const id of teacherIds) {
    if (userIds.has(id)) continue;
    errors.push(profileIds.has(id)
      ? `teacher URL uses teacher_profiles.id instead of user_id: /teachers/${id}`
      : `teacher does not exist publicly: /teachers/${id}`);
  }
  for (const id of courseIds) if (!publishedCourses.has(id)) errors.push(`course not published/doesn't exist: /courses/${id}`);
} catch (err) {
  console.warn(`sitemap validation: backend unavailable (${err.message}) — skipped live ID checks`);
}

if (errors.length) {
  console.error(`sitemap validation FAILED (${errors.length} problems):\n - ` + errors.join("\n - "));
  process.exit(1);
}
console.log(`sitemap validation passed: ${locs.length} unique URLs (${teacherIds.length} teachers, ${courseIds.length} courses)`);
