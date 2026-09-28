// Generates public/sitemap.xml before dev and build.
// Static public routes + dynamic routes (courses, teacher profiles, university colleges).
// If the backend is unreachable, the last generated sitemap is kept untouched
// (never overwritten with an incomplete one).
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { BASE_URL, BLOCKED_PREFIXES, fetchRows, TEACHERS_QUERY, COURSES_QUERY } from "./sitemap-shared.mjs";

const OUT = resolve("public/sitemap.xml");

/** @type {{path: string, changefreq?: string, priority?: string, lastmod?: string}[]} */
const entries = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/teachers", changefreq: "daily", priority: "0.9" },
  { path: "/subjects", changefreq: "weekly", priority: "0.9" },
  { path: "/universities", changefreq: "weekly", priority: "0.8" },
  { path: "/categories", changefreq: "weekly", priority: "0.8" },
  { path: "/languages", changefreq: "weekly", priority: "0.8" },
  { path: "/courses", changefreq: "daily", priority: "0.9" },
  { path: "/pricing", changefreq: "monthly", priority: "0.8" },
  { path: "/apply-tutor", changefreq: "monthly", priority: "0.7" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "monthly", priority: "0.6" },
  { path: "/faq", changefreq: "monthly", priority: "0.7" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/refund", changefreq: "yearly", priority: "0.3" },
];

// --- University / college routes, parsed from the static data module ---
try {
  const src = readFileSync(resolve("src/data/universitiesData.ts"), "utf8");
  const allIds = [...src.matchAll(/id:\s*"([A-Za-z0-9-]+)"/g)].map((m) => m[1]);
  const unis = new Set(allIds.filter((id) => id.split("-").length === 2));
  const collegeIds = [...src.matchAll(/id:\s*"([A-Za-z0-9-]+)",[\s\S]{0,400}?departments:/g)]
    .map((m) => m[1])
    .filter((id) => !unis.has(id));
  for (const collegeId of new Set(collegeIds)) {
    const parts = collegeId.split("-");
    const uniId = `${parts[0]}-${parts[1]}`;
    if (!unis.has(uniId)) continue;
    entries.push({ path: `/universities/${uniId}/colleges/${collegeId}`, changefreq: "monthly", priority: "0.6" });
  }
} catch (err) {
  console.warn("sitemap: could not parse universities data —", err.message);
}

// --- Dynamic rows from the backend ---
let courses, teachers;
try {
  [courses, teachers] = await Promise.all([fetchRows(COURSES_QUERY), fetchRows(TEACHERS_QUERY)]);
} catch (err) {
  if (existsSync(OUT)) {
    console.warn(`sitemap: backend unavailable (${err.message}) — keeping the last generated sitemap.xml`);
    process.exit(0);
  }
  console.error(`sitemap: backend unavailable and no previous sitemap exists — ${err.message}`);
  process.exit(1);
}

const toDate = (v) => (v ? new Date(v).toISOString().slice(0, 10) : undefined);
for (const c of courses) {
  entries.push({ path: `/courses/${c.id}`, changefreq: "weekly", priority: "0.7", lastmod: toDate(c.updated_at) });
}
// TeacherProfile loads by user_id, and TeacherCard links to /teachers/:user_id.
for (const t of teachers) {
  entries.push({ path: `/teachers/${t.user_id}`, changefreq: "weekly", priority: "0.7", lastmod: toDate(t.updated_at) });
}

// Dedupe + drop anything private.
const seen = new Set();
const finalEntries = entries.filter((e) => {
  if (BLOCKED_PREFIXES.some((p) => e.path === p || e.path.startsWith(p + "/"))) return false;
  if (seen.has(e.path)) return false;
  seen.add(e.path);
  return true;
});

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...finalEntries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ].filter(Boolean).join("\n"),
  ),
  `</urlset>`,
  "",
].join("\n");

writeFileSync(OUT, xml);
console.log(`sitemap.xml written (${finalEntries.length} URLs: ${courses.length} courses, ${teachers.length} teachers)`);
