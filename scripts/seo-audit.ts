// SEO content audit for every URL in public/sitemap.xml.
// Run: npx vite-node scripts/seo-audit.ts   (writes scripts/seo-audit-report.json)
// Checks entity existence, H1/title/description/canonical duplicates, thin content and orphans,
// using the same data + URL rules the pages render from. Reports problems; never hides them.
import { readFileSync, writeFileSync } from "node:fs";
import { allUniversities } from "../src/data/universitiesData";
import {
  countryCodeFromSlug, findUniversityBySlugs, subjectNameFromSlug, countryPath, universityPath,
  collegePath, subjectPath, isSubjectIndexable, isCollegeIndexable, isUniversityIndexable,
  subjectCourses, collegeCourseCount, MIN_INDEXABLE_COURSES,
} from "../src/lib/slugs";

type Row = { path: string; status: "valuable" | "thin" | "not_found" | "protected" | "unchecked"; h1?: string; title?: string; description?: string; units?: number; notes: string[] };

const PROTECTED = /^\/(admin|dashboard|login|register|profile|my-|checkout|messages|lecture)/;
const STATIC_OK = new Set(["/", "/subjects", "/universities", "/teachers", "/categories", "/about", "/contact", "/faq", "/pricing", "/terms", "/privacy", "/refund", "/languages", "/courses", "/become-tutor"]);

const paths = [...readFileSync("public/sitemap.xml", "utf8").matchAll(/<loc>https:\/\/ostaze\.com([^<]*)<\/loc>/g)].map((m) => m[1] || "/");

// Internal link graph from what pages render as <a href>.
const linked = new Set<string>(["/"]);
["/subjects", "/universities", "/teachers", "/categories", "/about", "/contact", "/faq", "/pricing", "/terms", "/privacy", "/refund"].forEach((p) => linked.add(p)); // navbar/footer
["kuwait", "qatar", "saudi-arabia", "uae"].forEach((s) => linked.add(`/universities/${s}`)); // footer hubs
for (const u of allUniversities) {
  linked.add(countryPath(u.country_code));
  linked.add(universityPath(u)); // country hub cards + subject pages
  for (const c of u.colleges) {
    linked.add(collegePath(u, c)); // university page cards
    c.departments.forEach((d) => isSubjectIndexable(d.name_en) && linked.add(subjectPath(d.name_en))); // college page links
  }
}

const rows: Row[] = paths.map((path) => {
  const r: Row = { path, status: "valuable", notes: [] };
  const seg = path.split("/").filter(Boolean);
  if (PROTECTED.test(path)) { r.status = "protected"; r.notes.push("private route in sitemap"); return r; }
  if (seg[0] === "subjects" && seg[1]) {
    const name = subjectNameFromSlug(seg[1]);
    if (!name) { r.status = "not_found"; return r; }
    r.h1 = name; r.title = `${name} Tutoring - Courses & Tutors`;
    r.units = subjectCourses(name);
    r.description = `${r.units} ${name} courses from Gulf universities.`;
    if (!isSubjectIndexable(name)) r.status = "thin";
  } else if (seg[0] === "universities" && seg[1]) {
    const cc = countryCodeFromSlug(seg[1]);
    if (!cc) { r.status = "not_found"; return r; }
    const unis = allUniversities.filter((u) => u.country_code === cc);
    if (seg.length === 2) { r.h1 = `Universities in ${unis[0]?.country_en}`; r.title = r.h1; r.units = unis.length; if (!unis.length) r.status = "thin"; }
    else {
      const u = findUniversityBySlugs(seg[1], seg[2]);
      if (!u) { r.status = "not_found"; return r; }
      if (seg.length === 3) { r.h1 = u.name_en; r.title = `${u.name_en} Tutoring`; r.units = u.colleges.length; if (!isUniversityIndexable(u)) r.status = "thin"; }
      else {
        const c = u.colleges.find((x) => x.id.toLowerCase() === seg[4]);
        if (!c) { r.status = "not_found"; return r; }
        r.h1 = c.name_en; r.title = `${c.name_en} — ${u.name_en}`; r.units = collegeCourseCount(c);
        if (!isCollegeIndexable(c)) r.status = "thin";
      }
    }
  } else if (!STATIC_OK.has(path)) {
    r.status = "unchecked"; r.notes.push("dynamic page (teacher/course) — content comes from the database; check manually");
  }
  if (r.status === "thin") r.notes.push(`fewer than ${MIN_INDEXABLE_COURSES} real courses or a requirement bucket`);
  if (!linked.has(path) && r.status !== "unchecked") r.notes.push("orphan: no internal link found");
  return r;
});

const dupes = (key: "title" | "h1" | "description") => {
  const m = new Map<string, string[]>();
  rows.forEach((r) => r[key] && m.set(r[key]!, [...(m.get(r[key]!) || []), r.path]));
  return [...m.entries()].filter(([, v]) => v.length > 1).map(([value, pages]) => ({ value, pages }));
};

const report = {
  total: rows.length,
  counts: rows.reduce<Record<string, number>>((a, r) => ((a[r.status] = (a[r.status] || 0) + 1), a), {}),
  duplicateTitles: dupes("title"),
  duplicateH1: dupes("h1"),
  duplicateDescriptions: dupes("description"),
  duplicateCanonicals: paths.filter((p, i) => paths.indexOf(p) !== i),
  problems: rows.filter((r) => r.status !== "valuable" || r.notes.length),
};
writeFileSync("scripts/seo-audit-report.json", JSON.stringify(report, null, 2));
console.log(`SEO audit: ${report.total} URLs`, report.counts);
console.log(`duplicate titles: ${report.duplicateTitles.length}, duplicate H1: ${report.duplicateH1.length}, duplicate canonicals: ${report.duplicateCanonicals.length}`);
report.problems.slice(0, 40).forEach((r) => console.log(`  [${r.status}] ${r.path} ${r.notes.join("; ")}`));
if (report.problems.length > 40) console.log(`  …${report.problems.length - 40} more in scripts/seo-audit-report.json`);
