// Generates public/sitemap.xml before dev and build.
// Static routes + dynamic routes (courses, teacher profiles, university colleges).
import { writeFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const BASE_URL = "https://ostaze.com";

const SUPABASE_URL = "https://dqqfzpghixfvhhpxfgwv.supabase.co";
const SUPABASE_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxcWZ6cGdoaXhmdmhocHhmZ3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwOTMzNjcsImV4cCI6MjA4ODY2OTM2N30.7WsVUn0uoogL7xfQ80Fw_UUncbEHPf10tPYue4DuYSg";

/** @type {{path: string, changefreq?: string, priority?: string}[]} */
const entries = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/teachers", changefreq: "daily", priority: "0.9" },
  { path: "/subjects", changefreq: "weekly", priority: "0.9" },
  { path: "/universities", changefreq: "weekly", priority: "0.8" },
  { path: "/categories", changefreq: "weekly", priority: "0.8" },
  { path: "/courses", changefreq: "daily", priority: "0.9" },
  { path: "/apply-tutor", changefreq: "monthly", priority: "0.7" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "monthly", priority: "0.6" },
  { path: "/faq", changefreq: "monthly", priority: "0.7" },
  { path: "/login", changefreq: "yearly", priority: "0.3" },
  { path: "/register", changefreq: "yearly", priority: "0.4" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/refund", changefreq: "yearly", priority: "0.3" },
];

// --- University / college routes, parsed from the static data module ---
try {
  const src = readFileSync(resolve("src/data/universitiesData.ts"), "utf8");
  const allIds = [...src.matchAll(/id:\s*"([A-Za-z0-9-]+)"/g)].map((m) => m[1]);
  const unis = new Set(allIds.filter((id) => id.split("-").length === 2));
  // College objects are the only ones carrying a `departments:` array.
  const collegeIds = [...src.matchAll(/id:\s*"([A-Za-z0-9-]+)",[\s\S]{0,400}?departments:/g)]
    .map((m) => m[1])
    .filter((id) => !unis.has(id));
  for (const collegeId of [...new Set(collegeIds)]) {
    const parts = collegeId.split("-");
    const uniId = `${parts[0]}-${parts[1]}`;
    if (!unis.has(uniId)) continue;
    entries.push({
      path: `/universities/${uniId}/colleges/${collegeId}`,
      changefreq: "monthly",
      priority: "0.6",
    });
  }

} catch (err) {
  console.warn("sitemap: could not parse universities data —", err.message);
}

// --- Dynamic rows from the backend (best effort; offline builds still work) ---
async function fetchRows(path) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`sitemap: skipping ${path} —`, err.message);
    return [];
  }
}

const courses = await fetchRows("courses?select=id&is_published=eq.true&limit=1000");
for (const c of courses) {
  entries.push({ path: `/courses/${c.id}`, changefreq: "weekly", priority: "0.7" });
}

const teachers = await fetchRows("teacher_profiles?select=id&limit=1000");
for (const t of teachers) {
  entries.push({ path: `/teachers/${t.id}`, changefreq: "weekly", priority: "0.7" });
}

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  ),
  `</urlset>`,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${entries.length} entries)`);
