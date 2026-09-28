#!/usr/bin/env node
// Crawls every URL in public/sitemap.xml against a running server (BASE) and checks:
// 200, no redirect, not noindex (meta or header), exactly one <title>, a page-specific
// description, self-referencing canonical, exactly one non-empty <h1>, no private route,
// no duplicates. Writes scripts/sitemap-audit-report.json; exits 1 on any failure.
// Usage: BASE=http://localhost:3999 node scripts/audit-sitemap-live.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { BASE_URL, BLOCKED_PREFIXES } from "./sitemap-shared.mjs";

const BASE = (process.env.BASE || "http://localhost:3000").replace(/\/$/, "");
const xml = readFileSync("public/sitemap.xml", "utf8");
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

const typeOf = (p) => {
  if (p === "/") return "home";
  const parts = p.split("/").filter(Boolean);
  if (parts[0] === "teachers") return parts.length > 1 ? "tutor" : "list";
  if (parts[0] === "courses") return parts.length > 1 ? "course" : "list";
  if (parts[0] === "subjects") return parts.length > 1 ? "subject" : "list";
  if (parts[0] === "universities") {
    if (parts.includes("colleges")) return "college";
    return ["list", "list", "country", "university"][Math.min(parts.length, 3)];
  }
  return "static";
};
const strip = (s) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'");

const seen = new Set();
const descs = new Map();
const results = [];
const queue = [...locs];
async function worker() {
  while (queue.length) {
    const loc = queue.shift();
    const path = loc.slice(BASE_URL.length) || "/";
    const fails = [];
    if (seen.has(loc)) fails.push("duplicate");
    seen.add(loc);
    if (BLOCKED_PREFIXES.some((p) => path === p || path.startsWith(p + "/")))
      fails.push("private route");
    let res,
      html = "";
    try {
      res = await fetch(BASE + path, { redirect: "manual" });
      html = await res.text();
    } catch (e) {
      fails.push(`fetch error ${e.message}`);
    }
    if (res) {
      if (res.status >= 300 && res.status < 400)
        fails.push(`redirect ${res.status} -> ${res.headers.get("location")}`);
      else if (res.status !== 200) fails.push(`status ${res.status}`);
      if (/noindex/i.test(res.headers.get("x-robots-tag") || ""))
        fails.push("X-Robots-Tag noindex");
    }
    const head = html.split("</head>")[0] || "";
    if (/<meta[^>]+name="robots"[^>]+noindex/i.test(html))
      fails.push("meta noindex");
    const titles = [...html.matchAll(/<title[^>]*>([^<]*)<\/title>/g)].map(
      (m) => decode(m[1]).trim(),
    );
    if (titles.length !== 1) fails.push(`${titles.length} titles`);
    const descM = [
      ...html.matchAll(/<meta[^>]+name="description"[^>]+content="([^"]*)"/g),
    ].map((m) => decode(m[1]));
    const desc = descM[0] || "";
    if (descM.length !== 1) fails.push(`${descM.length} descriptions`);
    else if (desc.length < 50) fails.push("description too short");
    const canon = [
      ...html.matchAll(/<link[^>]+rel="canonical"[^>]+href="([^"]*)"/g),
    ].map((m) => m[1]);
    if (canon.length !== 1) fails.push(`${canon.length} canonicals`);
    else if (canon[0].replace(/\/$/, "") !== loc.replace(/\/$/, ""))
      fails.push(`canonical ${canon[0]}`);
    const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) =>
      strip(m[1]),
    );
    if (h1s.length !== 1) fails.push(`${h1s.length} h1`);
    else if (h1s[0].length < 2) fails.push("empty h1");
    if (desc) descs.set(desc, [...(descs.get(desc) || []), loc]);
    results.push({
      loc,
      type: typeOf(path),
      status: res?.status,
      title: titles[0],
      h1: h1s[0],
      fails,
    });
    void head;
  }
}
await Promise.all(Array.from({ length: 6 }, worker));

for (const [d, urls] of descs)
  if (urls.length > 1)
    for (const r of results)
      if (urls.includes(r.loc))
        r.fails.push(`description shared with ${urls.length - 1} other URL(s)`);

const totals = {};
for (const r of results) {
  const t = (totals[r.type] ||= { total: 0, pass: 0, fail: 0 });
  t.total++;
  r.fails.length ? t.fail++ : t.pass++;
}
const failures = results.filter((r) => r.fails.length);
writeFileSync(
  "scripts/sitemap-audit-report.json",
  JSON.stringify({ base: BASE, totals, failures }, null, 2),
);
console.table(totals);
for (const f of failures.slice(0, 40))
  console.log(`✖ ${f.loc}: ${f.fails.join("; ")}`);
if (failures.length > 40)
  console.log(
    `… ${failures.length - 40} more in scripts/sitemap-audit-report.json`,
  );
console.log(
  failures.length
    ? `\nSitemap audit FAILED: ${failures.length}/${results.length}`
    : `\nSitemap audit PASSED: ${results.length} URLs`,
);
process.exit(failures.length ? 1 : 0);
