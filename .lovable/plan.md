# OSTAZE Performance — Staged Execution Plan

This is a large multi-phase effort. To stay safe (no regressions in booking, auth, pricing, i18n, SEO) I will execute one phase per turn, publish, cold-cache-measure production at https://ostaze.com/, and stop if any guardrail trips. Below is what I will do in each turn so you can approve or redirect.

## Phase 1 — Finish & validate P2 (this turn if approved)

Actions:
1. Re-run production build with `ANALYZE=1`, dump top modules in the entry chunk from `dist/stats.html`.
2. Confirm framer-motion is fully out of the critical path:
   - Already replaced in `PageTransition` + `Navbar`.
   - Audit remaining `framer-motion` imports reachable from `App.tsx` synchronously (Footer, GlobalSeo, NotificationBell, PageHelmet). Any critical-path importer gets CSS-only replacement or lazy boundary.
3. Fix the risky lazy `Index` route:
   - Inspect network waterfall. If entry→Index chunk is sequential, revert to eager `Index` import (keep other routes lazy) OR use `<link rel="modulepreload">` for the Index chunk to parallelize.
   - Prefer splitting below-the-fold Index sections (`OurTeam`, `StatsBar`, `UniversityLogosStrip`, testimonials) via `React.lazy` + `IntersectionObserver` wrapper with reserved height (no CLS).
4. Keep Toasters lazy (already done).
5. Verify no duplicate React/vendor across chunks via visualizer; add `manualChunks` for `react`, `react-dom`, `react-router-dom`, `@supabase/*` if duplication seen.
6. Ensure route chunks for checkout/admin/lecture/booking are not referenced by shared layout — grep for imports from `Navbar`, `Footer`, `App`, `Layout`.

Targets: initial JS < 180 KB gz, mobile TBT < 200ms, no FCP/LCP regression.

Validation: production build succeeds, no chunk duplication warnings, manual homepage + `/teachers` + Arabic mode + direct nav check, then publish + 3 cold Lighthouse runs.

## Phase 2 — P4 fonts (next turn)

- Drop `fonts.googleapis.com` / `gstatic` `<link>` from `index.html`.
- Self-host WOFF2 files under `public/fonts/`:
  - IBM Plex Sans Arabic 400 + 700 (Arabic subset).
  - Inter 400 + 600 (Latin subset) only if used on non-Arabic routes.
- `@font-face` with `font-display: swap`, `unicode-range`, and `size-adjust`/`ascent-override` for metric-compatible fallbacks.
- `<link rel="preload" as="font" type="font/woff2" crossorigin>` for the single above-the-fold hero font only (language-conditional via inline script or duplicate preloads acceptable).
- Verify CLS < 0.1 and no FOIT.

## Phase 3 — P1 build-time prerendering

- Add `vite-plugin-prerender` or `react-snap`/`vite-plugin-ssg` (choice made after checking compatibility with `HelmetProvider`, `BrowserRouter`, `AuthProvider`, `LanguageProvider`).
- Approach: use `vite-plugin-prerender-spa` running headless Chromium at build against `/`, `/teachers`, `/universities`, `/subjects`, `/about`, `/contact`, `/privacy`, `/terms`.
- Gate personalization: `AuthContext`, `CountryGate`, pricing, and Supabase reads must render neutral fallback during prerender (detect `navigator.userAgent === 'ReactSnap'` or use a `PRERENDER` flag) — no user prices or country-dependent copy in HTML.
- Ensure `react-helmet-async` output is serialized per route (title, description, canonical, og, `<html lang dir>`).
- Verify hydration is warning-free; add `<div id="root" style="min-height:100vh">` to reserve space.
- Skip dynamic detail routes for this pass.

Risk callout: prerendering an SPA with heavy providers is delicate. If hydration mismatch or Auth loop appears in preview, I stop and report before publishing.

## Phase 4 — P6 remaining images

- Convert `noura-al-shammari.png`, `abdullah-al-malki.png`, `faisal-al-dosari.png`, `university-logos-grid.png` to AVIF + WebP responsive variants via `sharp` script, upload via lovable-assets, use `<picture>` with `srcset`/`sizes`, explicit width/height, `loading="lazy" decoding="async"` (LCP image excepted).

## Phase 5 — P7 CSS/DOM/animation cleanup

- Audit for duplicated mobile/desktop trees in `Navbar`, home sections.
- Ensure modals (`BookSessionModal`, `BookingFlowModal`) mount only when open.
- Sweep `useEffect` for missing cleanup on timers/observers/listeners.
- Add `@media (prefers-reduced-motion: reduce)` guards to decorative CSS animations; disable orbit animation on `(max-width: 640px)`.
- Verify Tailwind `content` globs are tight in `tailwind.config.ts`.

## Phase 6 — Performance budgets (CI-friendly script)

- Add `scripts/perf-budget.mjs`: builds, reads `dist/` sizes per entry, runs Lighthouse against a preview URL, fails on budget breach. Documented in README (not wired into CI unless requested — Lovable has no CI).

## Phase 7 — P5 hosting recommendation

- Deliver `docs/HOSTING_RECOMMENDATIONS.md` with the exact caching / TTFB asks for Lovable support. No code.

## Reporting cadence

After each phase I publish, run 3 cold-cache mobile Lighthouse runs against https://ostaze.com/, and report medians for score, FCP, LCP, TBT, CLS, initial JS, total transfer, request count, plus a diff of modified files. If any guardrail (worse FCP/LCP, waterfall, blank content, hydration mismatch, country/price/consent/auth/booking regression) trips, I stop before publishing and report.

## Approval needed

Reply "go" to start Phase 1 now. If you want a different order (e.g., fonts first, or prerendering first), say which. Prerendering (Phase 3) is the highest-risk step for this SPA — I recommend keeping it after P2/P4 land cleanly, as planned.
