#!/usr/bin/env node
/**
 * OSTAZE performance budget (TanStack Start / Nitro output).
 *
 * For each representative route, fetches the server-rendered HTML from a running
 * server and measures only that page's first-load assets (scripts, modulepreloads,
 * stylesheets it references), gzip-compressed from the build's public directory.
 * Fails (exit 1) if the homepage's initial client JS exceeds 180 KB gzip.
 *
 * Usage:
 *   BASE=http://localhost:3999 PUBLIC_DIR=.output/public node scripts/perf-budget.mjs
 * Defaults: BASE=http://localhost:3000, PUBLIC_DIR=.output/public (falls back to dist/client).
 * Optional: ROUTES_EXTRA="/teachers/<id>,/courses/<id>" (otherwise discovered from list pages).
 */
import { readFileSync, existsSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const BASE = (process.env.BASE || "http://localhost:3000").replace(/\/$/, "");
const PUBLIC_DIR =
  process.env.PUBLIC_DIR ||
  (existsSync(".output/public") ? ".output/public" : "dist/client");
const HOME_JS_BUDGET_KB = 180;

const gz = (buf) => gzipSync(buf).length;
const kb = (n) => (n / 1024).toFixed(1);

async function html(path) {
  const res = await fetch(BASE + path, { redirect: "manual" });
  return { status: res.status, text: await res.text() };
}

function assetsOf(page) {
  const pick = (re) => [...page.matchAll(re)].map((m) => m[1]);
  const js = new Set([
    ...pick(/<script[^>]+src="([^"]+)"/g),
    ...pick(/<link[^>]+rel="modulepreload"[^>]+href="([^"]+)"/g),
    ...pick(/<link[^>]+href="([^"]+)"[^>]+rel="modulepreload"/g),
  ]);
  // Inline module bootstrap imports (e.g. import("/assets/x.js"))
  for (const m of page.matchAll(/import\(["'](\/assets\/[^"']+\.js)["']\)/g))
    js.add(m[1]);
  const css = new Set([
    ...pick(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g),
    ...pick(/<link[^>]+href="([^"]+)"[^>]+rel="stylesheet"/g),
  ]);
  return { js: [...js], css: [...css] };
}

function sizeOf(list) {
  let total = 0;
  const missing = [];
  for (const href of list) {
    if (!href.startsWith("/")) continue; // external
    const p = join(PUBLIC_DIR, href.split("?")[0]);
    if (!existsSync(p)) {
      missing.push(href);
      continue;
    }
    total += gz(readFileSync(p));
  }
  return { total, missing };
}

async function discover(listPath, prefix) {
  const { text } = await html(listPath);
  const m = text.match(new RegExp(`href="(${prefix}[0-9a-f-]{36})"`));
  return m ? m[1] : null;
}

const routes = [
  "/",
  "/teachers",
  (await discover("/teachers", "/teachers/")) || null,
  "/courses",
  (await discover("/courses", "/courses/")) || null,
  "/subjects/computer-science",
  "/universities",
  "/universities/kuwait/ku",
  "/universities/kuwait/ku/colleges/kw-ku-arts",
  ...(process.env.ROUTES_EXTRA ? process.env.ROUTES_EXTRA.split(",") : []),
].filter(Boolean);

let failed = false;
console.log(`Base ${BASE}, assets from ${PUBLIC_DIR}\n`);
console.log("route".padEnd(48) + "status  HTML gz  CSS gz   JS gz");
for (const r of routes) {
  const { status, text } = await html(r);
  const { js, css } = assetsOf(text);
  const j = sizeOf(js);
  const c = sizeOf(css);
  console.log(
    r.padEnd(48) +
      String(status).padEnd(8) +
      `${kb(gz(Buffer.from(text)))}`.padStart(7) +
      `${kb(c.total)}`.padStart(8) +
      `${kb(j.total)}`.padStart(8) +
      " KB",
  );
  if (j.missing.length || c.missing.length)
    console.log(`  missing assets: ${[...j.missing, ...c.missing].join(", ")}`);
  if (r === "/") {
    if (j.total === 0) {
      console.error("  ✖ no homepage JS found — wrong BASE/PUBLIC_DIR?");
      failed = true;
    } else if (j.total / 1024 > HOME_JS_BUDGET_KB) {
      console.error(
        `  ✖ homepage initial JS ${kb(j.total)} KB > ${HOME_JS_BUDGET_KB} KB budget`,
      );
      failed = true;
    }
  }
  if (status !== 200) {
    console.error(`  ✖ ${r} returned ${status}`);
    failed = true;
  }
}
console.log(
  failed
    ? "\nPerformance budget FAILED."
    : `\nPerformance budget PASSED (homepage JS ≤ ${HOME_JS_BUDGET_KB} KB gzip).`,
);
process.exit(failed ? 1 : 0);
