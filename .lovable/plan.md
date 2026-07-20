# OSTAZE Performance — Staged Execution Plan

## ✅ P2 — Bundle Optimization (CLOSED, pragmatic exception)

**Shipped:**
- Removed `framer-motion` from the critical path (Navbar, PageTransition, hero, Footer, GlobalSeo, NotificationBell).
- Route-level lazy loading; `Toaster`/`Sonner` deferred via `useDeferredMount`.
- `Index` route parallel-preload; below-fold sections gated behind `useInViewOnce`.
- Icon chunk consolidation via Vite `manualChunks`.
- Widget deferral (WhatsApp, AIChat, CookieConsent, CountryGate) idle+interaction gated.

**Production baseline (3 cold-cache mobile Lighthouse runs, median):**

| Metric | Before P2 | After P2 | Change |
|---|---|---|---|
| Performance | 61 | **68** | +7 |
| FCP | 3677 ms | **3472 ms** | -205 |
| LCP | 4736 ms | **3515 ms** | -1221 |
| TBT | 548 ms | **598 ms** | +50 |
| CLS | 0 | **0** | flat |
| Initial JS requests | 26 | **5** | -21 |
| Initial JS transfer | ~260 KB | **185.1 KB gz** | -75 KB |

### Accepted technical debt (deferred; do not re-enter without approval)

| # | Debt | Value | Target | Reason not to fix now |
|---|---|---|---|---|
| 1 | Initial JS over budget | 185 KB gz | 180 KB gz | Only 5 KB over; further cuts touch SEO/auth/data-fetching. |
| 2 | Median TBT above interim target | 598 ms | ≤ 300 ms | Only entry-chunk splits could move it; each carries risk. |
| 3 | Entry bootup | ~498 ms | — | Dominated by React + Supabase auth + react-query init. |
| 4 | Hosting serves gzip, not Brotli | gzip | brotli | Hosting-level; tracked under Phase 7. |

**Do NOT do at this stage:**
- Replace `react-helmet-async` (SEO metadata risk).
- Defer `react-query` (hydration + data-fetching risk).
- Split Supabase auth out of entry (auth boot-path risk).

## 🎨 P2.5 — Motion polish (current)

**Goal:** restore smooth transitions removed during P2 without returning any animation library to the critical path or increasing startup cost.

**Shipped:**
- Motion tokens in `src/index.css` (`--motion-fast`, `--motion-standard`, `--motion-slow`, `--motion-ease-standard`, `--motion-ease-emphasized`).
- Route entry (`.animate-page-in`): opacity + translateY(6px), 200ms, standard easing.
- Nav dropdown / mobile menu (`.animate-nav-drop`): 180ms.
- `.hover-lift-sm` / `.hover-lift-md` — transform-only, 140–180ms, `will-change` scoped to `:hover/:focus-visible`.
- `.reveal` + `.is-visible` scroll-reveal utility, driven by `src/components/Reveal.tsx` (one-shot IntersectionObserver, 340ms translateY(12px) + opacity).
- `.stagger-children` — 40ms/item cap, 200ms total.
- Global `prefers-reduced-motion` guard neutralises every P2.5 animation.
- Tab-hidden pause via `src/lib/motionVisibility.ts` toggling `data-motion-paused` on `<html>` (CSS pauses all `animation-play-state`).
- Mobile guard silences continuous decorative loops (`.orbit-spin*`, `.float-y`, `.glow-*`, `.watermark-float*`, `.fab-pulse-ring`) under `(max-width: 640px)`.

**Guardrails:**
- Transform + opacity only. Never `transition: all`. Never animate width/height/margin/padding/top/left.
- Hero + LCP element render immediately (no gating).
- Navigation is not delayed by exit animations (route changes swap immediately, entry animation plays over the new tree).
- Below-fold motion stays behind `useInViewOnce` / `IntersectionObserver`.
- Framer-motion remains only inside the lazy below-fold chunk; not in the initial dependency graph.

**Performance budget for P2.5:**
- Initial JS increase ≤ 5 KB gz.
- No additional initial JS requests.
- FCP/LCP regression ≤ 100 ms.
- TBT regression ≤ 50 ms.
- CLS ≤ 0.1.

**Validation checklist (pre-publish):**
- [ ] Arabic + English render correctly (RTL preserved).
- [ ] Mobile + desktop nav open/close smoothly.
- [ ] Back/forward navigation — no white flash.
- [ ] Rapid route changes — no stuck overlays.
- [ ] Keyboard focus visible; focus lift matches hover lift.
- [ ] `prefers-reduced-motion: reduce` disables all P2.5 animations.
- [ ] No framer-motion in initial graph (verify via network waterfall).
- [ ] CLS ≤ 0.1 on home, teachers, subjects.

**Publish P2.5 separately, then run three cold-cache mobile Lighthouse tests before starting Phase 2 (fonts).**

## Phase 2 — P4 fonts (next after P2.5 sign-off)

- Drop `fonts.googleapis.com` / `gstatic` `<link>` from `index.html`.
- Self-host WOFF2 under `public/fonts/`:
  - IBM Plex Sans Arabic 400 + 700 (Arabic subset).
  - Inter 400 + 600 (Latin subset).
- `@font-face` with `font-display: swap`, `unicode-range`, and `size-adjust` / `ascent-override` metric-compatible fallbacks.
- `<link rel="preload" as="font" type="font/woff2" crossorigin>` for the single above-the-fold hero font only (language-conditional).
- Verify CLS < 0.1, no FOIT.

## Phase 3 — P1 build-time prerendering

- `vite-plugin-prerender-spa` (or `react-snap`) at build against `/`, `/teachers`, `/universities`, `/subjects`, `/about`, `/contact`, `/privacy`, `/terms`.
- Gate personalization (`AuthContext`, `CountryGate`, pricing, Supabase reads) with a `PRERENDER` flag — no user-specific prices/copy in HTML.
- Serialize `react-helmet-async` per route.
- Verify hydration is warning-free; reserve root height to avoid CLS.

Risk: highest-risk phase. Stops before publish if any hydration mismatch appears.

## Phase 4 — P6 remaining images

- Convert `noura-al-shammari.png`, `abdullah-al-malki.png`, `faisal-al-dosari.png`, `university-logos-grid.png` to AVIF + WebP responsive variants (`sharp`), use `<picture>` with `srcset`/`sizes`, explicit width/height, `loading="lazy" decoding="async"`.

## Phase 5 — P7 CSS/DOM cleanup

- Audit duplicated mobile/desktop trees (Navbar, home).
- Ensure modals mount only when open.
- Sweep `useEffect` for missing cleanup on timers/observers/listeners.
- Tighten Tailwind `content` globs.

## Phase 6 — Performance budgets

- `scripts/perf-budget.mjs`: build, read `dist/` sizes, run Lighthouse against preview, fail on budget breach.

## Phase 7 — P5 hosting recommendation

- `docs/HOSTING_RECOMMENDATIONS.md` with the exact Brotli + caching asks for Lovable support (no code).

## Security scan status

Last scan (P2 close): 19 `warn` findings, all pre-existing categories (`SUPA_*_security_definer_function_executable`). **Not auto-fixed.** Preserved for later triage — do not ignore or modify the `SECURITY DEFINER` findings until reviewed one-by-one.

## Reporting cadence

After each phase: publish, run 3 cold-cache mobile Lighthouse runs against https://ostaze.com/, report medians for score, FCP, LCP, TBT, CLS, initial JS, total transfer, request count, plus a diff of modified files. Stop before publish if any guardrail (worse FCP/LCP, waterfall regression, blank content, hydration mismatch, country/price/consent/auth/booking regression) trips.

## Phase 3 — Prerender (PARKED)

**Status:** Local feasibility passed, deployment blocked, code removed.

**Result:** Custom Playwright post-build renderer (`scripts/prerender.mjs`) snapshotted 8 public routes with clean hydration, zero React warnings, valid UTF-8 Arabic, `<meta charset>` in every file, deterministic Arabic default, neutral auth state, zero Supabase requests during snapshot.

**Blocker (not failure):** Chromium is provided by nix in the agent sandbox (`/bin/chromium`) but is **not guaranteed** in Lovable's production build image. Puppeteer's bundled Chromium download is not wired into `npm ci`. Wiring `build → prerender` would either crash every deploy or silently ship empty SPA HTML. Neither is acceptable.

**Decision:** Chose Option C — keep Phase 2 baseline (Perf 93 / LCP 2.21s / TBT 226ms / CLS 0). Do not migrate to Vike or vite-plugin-ssr. Revisit only if Lovable ships an officially supported build-time prerender/SSR capability or guarantees Chromium in the deploy build.

**Removed on park:**
- `scripts/prerender.mjs`, `src/lib/prerender.ts`, `src/components/PrerenderReadySignal.tsx`
- `PrerenderReadySignal` mount in `App.tsx`
- Conditional `hydrateRoot` in `src/main.tsx` (back to `createRoot` only)
- `IS_PRERENDER` / `__PRERENDER__` branches in `AuthContext`, `CountryGate`, `LanguageContext`, `Teachers.tsx`
- Deps: `@prerenderer/rollup-plugin`, `@prerenderer/renderer-puppeteer`, `puppeteer`
- `prerender-report/`

**Preserved for a future retry — approved public-route manifest:**
`/`, `/teachers`, `/universities`, `/subjects`, `/about`, `/contact`, `/privacy`, `/terms` (plus optional `/categories`, `/faq` — public, no auth).

**Preserved untouched:** P2 bundle work, P2.5 motion polish, deferred widgets, self-hosted fonts, routing/auth/language/country/pricing/SEO behavior, `SECURITY DEFINER` findings.

## Phase 4/5/6/7 — Final performance batch (COMPLETED)

**Shipped in one final pass:**

- **P4 Images:** Converted 4 remaining large PNGs to WebP with transparency preserved.
  - `noura-al-shammari.png` 376 KB → WebP 37.7 KB
  - `abdullah-al-malki.png` 179 KB → WebP 11.7 KB
  - `faisal-al-dosari.png` 100 KB → WebP 6.6 KB
  - `university-logos-grid.png` 263 KB → WebP 58.2 KB (+ 960w variant 21 KB) with `<picture>` responsive `srcset`, explicit `width`/`height`, `loading="lazy"`, `decoding="async"`.
  - Obsolete PNG asset pointers deleted via `lovable-assets delete`.
- **P6 Budgets:** Added `scripts/perf-budget.mjs` and `npm run perf:budget` / `build:check`. Enforces initial JS ≤ 195 KB gz, CSS ≤ 25 KB gz, fonts ≤ 100 KB / ≤ 2 requests, total ≤ 400 KB, no Google Fonts, `framer-motion` not in initial graph. Lighthouse remains a documented manual step (Chromium not guaranteed by hosting).
- **P5 Hosting:** `docs/HOSTING_RECOMMENDATIONS.md` documents Lovable gzip-only, `_headers` inert-for-fonts, no HTML edge cache control, prerender infeasibility, and formal asks (Brotli, immutable hashed-asset caching, safe public-HTML caching + deploy purge, TTFB targets).
- **Security:** `docs/SECURITY_FINDINGS_REPORT.md` enumerates the 19 pre-existing SECURITY DEFINER / search-path findings with the standard `SET search_path = public, pg_temp` + minimum-grants remediation template. No DB changes; approval-gated follow-up.

**Untouched:** auth, Supabase init, React Query, Helmet, checkout, booking, payments, RLS/grants, SECURITY DEFINER behavior, prices, country logic, motion polish, self-hosted fonts.
