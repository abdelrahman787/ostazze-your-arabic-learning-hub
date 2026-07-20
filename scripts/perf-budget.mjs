#!/usr/bin/env node
/**
 * OSTAZZE performance budget checker.
 *
 * Runs against the production build in `dist/`. Reports actual gzip sizes
 * (Lovable production currently serves gzip, not Brotli). Exits non-zero
 * when a build-size budget fails.
 *
 * Runtime metrics (Performance, FCP, LCP, TBT, CLS) are documented as
 * manual Lighthouse steps in docs/HOSTING_RECOMMENDATIONS.md — Chromium
 * is NOT required for this script and NOT guaranteed in Lovable's
 * production build environment.
 *
 * Usage: node scripts/perf-budget.mjs
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join, extname, basename } from "node:path";

const DIST = "dist";
const INDEX_HTML = join(DIST, "index.html");

// Build-size budgets (compressed / on-the-wire)
const BUDGETS = {
  initialJsGzipKB: 195,
  initialCssGzipKB: 25,
  initialFontsKB: 100,
  initialFontRequests: 2,
  totalInitialTransferKB: 400,
};

// Runtime targets (measured manually via mobile Lighthouse against
// https://ostaze.com/ — see docs/HOSTING_RECOMMENDATIONS.md).
const RUNTIME_TARGETS = {
  performance: 90,
  fcpMs: 2200,
  lcpMs: 2500,
  tbtMs: 300,
  cls: 0.01,
};

function fail(msg) {
  console.error(`\u2716 ${msg}`);
  process.exitCode = 1;
}
function ok(msg) {
  console.log(`\u2714 ${msg}`);
}
function info(msg) {
  console.log(`  ${msg}`);
}

if (!existsSync(INDEX_HTML)) {
  console.error("dist/index.html not found. Run `vite build` first.");
  process.exit(2);
}

const html = readFileSync(INDEX_HTML, "utf8");

// Collect initial resources referenced from index.html
const scriptSrcs = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m => m[1]);
const modulePreloads = [...html.matchAll(/<link[^>]+rel="modulepreload"[^>]+href="([^"]+)"/g)].map(m => m[1]);
const styleHrefs = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map(m => m[1]);
const preloadFonts = [...html.matchAll(/<link[^>]+rel="preload"[^>]+as="font"[^>]+href="([^"]+)"/g)].map(m => m[1]);

// Google Fonts check
const gFontHits = [
  ...[...html.matchAll(/fonts\.googleapis\.com/g)],
  ...[...html.matchAll(/fonts\.gstatic\.com/g)],
];
if (gFontHits.length > 0) fail(`Found ${gFontHits.length} Google Fonts references in index.html`);
else ok("No Google Fonts references in index.html");

const localAsset = (href) => {
  if (!href) return null;
  const clean = href.startsWith("/") ? href.slice(1) : href;
  const p = join(DIST, clean);
  return existsSync(p) ? p : null;
};

function fileGzipBytes(path) {
  const buf = readFileSync(path);
  return gzipSync(buf).length;
}
function fileBytes(path) {
  return statSync(path).size;
}

const initialJs = [...new Set([...scriptSrcs, ...modulePreloads])]
  .map(localAsset).filter(Boolean);
const initialCss = [...new Set(styleHrefs)].map(localAsset).filter(Boolean);
const initialFonts = [...new Set(preloadFonts)].map(localAsset).filter(Boolean);

const jsGzip = initialJs.reduce((a, p) => a + fileGzipBytes(p), 0);
const cssGzip = initialCss.reduce((a, p) => a + fileGzipBytes(p), 0);
const fontBytes = initialFonts.reduce((a, p) => a + fileBytes(p), 0);

// framer-motion must NOT be in the initial graph
let framerInInitial = false;
for (const p of initialJs) {
  const txt = readFileSync(p, "utf8");
  if (/framer-motion|["']framer["']|__FRAMER_MOTION__/.test(txt) && /motion\(|useMotionValue|useSpring|AnimatePresence/.test(txt)) {
    framerInInitial = true;
    console.error(`  framer-motion detected in initial chunk: ${basename(p)}`);
  }
}
if (framerInInitial) fail("framer-motion present in initial graph");
else ok("framer-motion is NOT in initial graph");

const totalInitial = jsGzip + cssGzip + fontBytes;

console.log("\n--- Initial transfer ---");
info(`Initial JS (gzip):     ${(jsGzip/1024).toFixed(1)} KB  (budget ${BUDGETS.initialJsGzipKB} KB)`);
info(`Initial CSS (gzip):    ${(cssGzip/1024).toFixed(1)} KB  (budget ${BUDGETS.initialCssGzipKB} KB)`);
info(`Initial fonts (raw):   ${(fontBytes/1024).toFixed(1)} KB in ${initialFonts.length} file(s)  (budget ${BUDGETS.initialFontsKB} KB / ${BUDGETS.initialFontRequests} req)`);
info(`Total initial:         ${(totalInitial/1024).toFixed(1)} KB  (budget ${BUDGETS.totalInitialTransferKB} KB)`);

if (jsGzip/1024 > BUDGETS.initialJsGzipKB) fail(`Initial JS over budget`);
else ok("Initial JS within budget");
if (cssGzip/1024 > BUDGETS.initialCssGzipKB) fail(`Initial CSS over budget`);
else ok("Initial CSS within budget");
if (fontBytes/1024 > BUDGETS.initialFontsKB) fail(`Initial fonts over byte budget`);
else ok("Initial fonts within byte budget");
if (initialFonts.length > BUDGETS.initialFontRequests) fail(`Too many initial font requests`);
else ok("Initial font request count within budget");
if (totalInitial/1024 > BUDGETS.totalInitialTransferKB) fail(`Total initial transfer over budget`);
else ok("Total initial transfer within budget");

console.log("\n--- Runtime targets (manual Lighthouse) ---");
for (const [k, v] of Object.entries(RUNTIME_TARGETS)) info(`${k}: ${v}`);
console.log("\nMeasure with 3 cold-cache mobile Lighthouse runs against https://ostaze.com/.");

if (process.exitCode) {
  console.error("\nPerformance budget FAILED.");
} else {
  console.log("\nPerformance budget PASSED.");
}
