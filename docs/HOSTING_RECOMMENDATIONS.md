# OSTAZZE Hosting Recommendations

Verified Lovable production hosting limitations discovered during
Phase 2 / P2.5 / Phase 3 performance work, plus asks for the hosting
team. Application code MUST NOT attempt workarounds for platform
limitations listed here.

## Verified limitations (as of July 2026)

1. **Compression** — Production serves `Content-Encoding: gzip` only.
   Brotli is not negotiated even when `Accept-Encoding: br` is sent.
2. **`public/_headers`** — Custom `Cache-Control` and CORS rules are
   NOT applied to font files or other static assets. The file is
   effectively inert for hashed asset headers.
3. **HTML edge caching** — Public HTML edge-cache TTL / stale-while-
   revalidate cannot be controlled from application code, and cache
   purge on deployment is not exposed.
4. **Prerender / SSR** — Chromium is NOT guaranteed to be available
   in Lovable's production build environment, so browser-based
   prerender plugins (Puppeteer / `@prerenderer/*`) cannot be wired
   into the standard build. See Phase 3 in `.lovable/plan.md`.

## Requests for the Lovable hosting team

- Serve **Brotli** for text assets (HTML, JS, CSS, SVG, JSON) with
  gzip fallback.
- Apply **immutable caching** (`Cache-Control: public, max-age=31536000, immutable`)
  to Vite hashed assets under `/assets/` and to self-hosted font
  files under `/fonts/`.
- Apply **safe public HTML caching** for non-personalized routes
  (short `s-maxage`, longer `stale-while-revalidate`) with automatic
  **cache purge on deploy**. Do NOT enable shared caching for
  authenticated or personalized pages.
- Provide an official **prerender / SSG** option (or guarantee
  Chromium in the build environment) so we can revisit Phase 3.
- Target **median TTFB \u2264 300 ms** and **cold TTFB \u2264 600 ms**
  for public HTML.

## Application-side rules

- Do NOT add app-level header workarounds for the limitations above.
- Do NOT cache authenticated or personalized responses at any shared
  layer.
- Keep fonts self-hosted, subset, and preload only the LCP-relevant
  weight (`ibm-plex-sans-arabic-700.woff2`).
- Keep `framer-motion` out of the initial graph — enforced by
  `scripts/perf-budget.mjs`.

## Manual production measurement

Chromium cannot be assumed in Lovable's build sandbox, so runtime
Lighthouse checks are a manual step:

1. Build locally or in CI where Chrome is available.
2. Run 3 cold-cache mobile Lighthouse runs against
   `https://ostaze.com/` (throttled 4G, Moto G4 profile).
3. Report median + range for Performance, FCP, LCP, TBT, CLS,
   initial JS transfer, total transfer, request count, image
   transfer.

Build-time budgets are enforced automatically by:

```
node scripts/perf-budget.mjs
```

after `vite build`.
