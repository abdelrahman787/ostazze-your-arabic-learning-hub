# Ostaze.com Audit & Refactor Plan

This plan groups the work into the four areas you asked for. Frontend changes are applied directly. Backend-only items (HTTP response headers, CSP, server-side rate limiting) are clearly marked because Lovable hosting does not allow custom server headers from the app codebase — we'll implement what we can via `<meta http-equiv>` and document the rest as TODOs.

---

## A) Routing & Indexability

**Findings**
- `src/pages/Courses.tsx` and `src/pages/CourseDetail.tsx` exist but are **not registered in `src/App.tsx`**. So `/courses` and `/courses/:id` resolve to `NotFound` — but sitemap, footer, and `MyCourses` link there. This is the "404-like page" you saw.
- `/teachers` shows mock empty state but is in primary nav even when DB is empty.
- `/login` and `/register` lack `noindex`.
- Footer links to `/refund`, route exists — OK.

**Changes**
1. **Wire `/courses` and `/courses/:id`** into `App.tsx` (lazy-imported) so the sitemap entry is honored. Adds the missing index + detail routes.
2. **Strengthen `/teachers` empty state** — when `teachers.length === 0` and not loading, show a "coming soon / be the first to register as a tutor" experience with two CTAs (تسجيل كمعلم → `/register`, تواصل → WhatsApp).
3. **Add `noindex,nofollow`** via `<Helmet>` on `/login`, `/register`, `/forgot-password`, `/dashboard*`, `/admin`, `/checkout/return`, `/lectures/*`.
4. **Sitemap cleanup** — keep `/courses` (now real), drop `/categories` only if not user-facing (it is — keep). Add lastmod dates and remove `/login` priority entry to discourage indexing.
5. **404 page** — ensure `<NotFound>` adds `<meta name="robots" content="noindex">` and a clear "back to home / search" CTA (already partial — verify).

---

## B) SEO Foundation

**Findings**
- `PageHelmet` only sets `title` + `description`. No canonical, OG, Twitter, or JSON-LD on most pages.
- Homepage has good JSON-LD but missing `WebSite` + `SearchAction`.
- Many pages use generic `<h1>` text from translations — fine, but no per-page OG image.

**Changes**
1. **Upgrade `PageHelmet`** to accept `canonical`, `ogImage`, `ogType`, `noindex`, `jsonLd` props and render OG + Twitter tags + canonical automatically. Default canonical = `https://ostaze.com${pathname}`.
2. **Add a shared `siteJsonLd.ts`** helper exporting:
   - `Organization` (logo, sameAs, contactPoint)
   - `WebSite` with `SearchAction` pointing to `/teachers?q={search_term_string}`
   - `breadcrumbList(items)` builder
   - `itemList(items)` builder
3. **Inject Organization + WebSite JSON-LD globally** via a new `<GlobalSeo>` component mounted in `App.tsx`.
4. **Per-page upgrades** — pass `canonical`, `ogType`, and JSON-LD where relevant: Index (kept + WebSite), Teachers (ItemList of teachers + Breadcrumb), TeacherProfile (Person/EducationalOccupationalProgram), Subjects/Categories/Universities (ItemList + Breadcrumb), Courses (ItemList of courses), CourseDetail (Course schema), About/Contact/Terms/Privacy/Refund (WebPage + Breadcrumb).
5. **Unique titles per route** — convert `<title>{t("page")} | OSTAZE</title>` to a meaningful pattern and ensure every page has one H1.

---

## C) Security Hardening

**Findings**
- No CSP, Permissions-Policy, COOP, X-Frame-Options anywhere.
- Auth: Supabase handles password hashing + rate limit; we do not enforce client-side throttling on login/register submit, easy to spam.
- Password policy in Register is decent (8+, strength meter), but does not block weak passwords or check HIBP.
- `/refund` and `Contact` form has no abuse protection (honeypot, throttle).

**Changes (frontend & meta-level — what's enforceable from a Vite SPA)**
1. **Add `<meta http-equiv>` security headers in `index.html`** (Lovable hosting injects standard ones, we add app-level reinforcement):
   - `Content-Security-Policy` with strict defaults: `default-src 'self'; img-src 'self' data: https://*.supabase.co https://storage.googleapis.com https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com; frame-src https://js.stripe.com https://docs.google.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `X-Content-Type-Options: nosniff`
   - `Permissions-Policy: camera=(), microphone=(self), geolocation=(), payment=(self), interest-cohort=()`  (microphone allowed because chat has voice messages; payment for Stripe)
   - Note in plan: `X-Frame-Options`, HSTS, COOP, CORP must be set as **HTTP response headers** at the hosting layer — `<meta http-equiv>` is ignored for these. **Backend TODO**: configure on Lovable hosting / custom domain edge.
2. **Enable Lovable Cloud "Leaked Password Protection" (HIBP)** — call `configure_auth({ password_hibp_enabled: true })` during implementation.
3. **Client-side abuse mitigation**:
   - Add cooldown / max-attempts state to `Login` and `Register` submit buttons (e.g. disable for 30s after 5 failed attempts within 2min).
   - Add a hidden honeypot field (`website`) to `Register` and `Contact` forms; reject submit if filled.
   - Increase Register min length to 8 (already), require at least medium strength to enable submit.
4. **Logout & session** — verify `signOut` clears local storage Supabase keys (already handled by SDK; confirm).
5. **Cookie review** — Supabase JS uses `localStorage` by default (not cookies). No app-set cookies to harden. Document this.

**Backend TODOs (cannot fix from app code on Lovable hosting):**
- Set `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` at edge.
- Set `X-Frame-Options: DENY` at edge (CSP `frame-ancestors 'none'` covers modern browsers).
- Set `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Resource-Policy: same-site` at edge.
- Configure Supabase Auth rate limits in Cloud → Users → Auth Settings.

---

## D) Legal & Trust

**Findings**
- `Privacy.tsx` & `Terms.tsx` render 5–6 generic translated sections — missing GDPR-style detail (lawful basis, retention, processors, minors, transfers, DSR contact).
- `Contact.tsx` has email/phone/whatsapp but no business entity, hours, SLA, or FAQ links.
- No cookie consent banner.

**Changes**
1. **Expand `Privacy`** translation keys + render new sections:
   - Data we collect (account, usage, payment via Stripe, video sessions via Zoom/Daily, AI chat logs)
   - Lawful basis (contract, consent, legitimate interest)
   - Retention periods (account 5y after last activity, recordings 90d, support emails 2y)
   - Third-party processors (Supabase, Stripe, Zoom, Lovable AI / Google Gemini, WhatsApp Business)
   - User rights (access, rectification, deletion, portability, objection) + DSR email `privacy@ostaze.com`
   - Children & minors (under-13 prohibited; 13–18 needs guardian consent)
   - International transfers (servers location, SCC reference)
   - Cookies (essential session storage, no analytics by default)
   - Contact for privacy queries
   - Last updated date driven by constant
2. **Expand `Terms`**:
   - Account types & responsibilities (student vs tutor)
   - Tutor verification & content ownership / IP
   - Session conduct, recording consent, no-show/late policy
   - Cancellations & refunds (cross-link `/refund`)
   - Payment terms (Stripe sandbox/live, currency, taxes)
   - Liability limits & disclaimer
   - Account suspension/termination
   - Dispute resolution & governing law (Saudi Arabia, jurisdiction)
   - Changes to terms / notification
3. **Improve `Contact`**:
   - Trust card with legal entity placeholder ("OSTAZE Educational Services" — TODO confirm), CR/registration line, address.
   - Working hours (Sun–Thu, 09:00–18:00 AST) + response SLA ("نرد خلال 24 ساعة عمل").
   - "Quick help" section linking About, Refund, Privacy, Terms, FAQ in About if present.
   - Honeypot + simple client throttle on form.
4. **Cookie consent banner** — lightweight in-house component (no library) shown on first visit, persisted in `localStorage`. Since we currently use only essential storage, banner offers an info acknowledgement; if analytics added later, expand to preferences.

---

## E) UX / Conversion Improvements

1. **Homepage trust signals** — add a "Featured tutors" row that uses `featuredTeachers` from DB, falls back to a polished "Coming soon — handpicked verified tutors" card if empty (no fake placeholders). Add a "Verified by Ostaze", "Pay-per-session", "Cancel anytime" 3-badge strip below hero.
2. **Reduce empty space** — tighten section paddings on Index where rows render zero items; conditionally hide testimonial/teachers sections when DB returns empty rather than rendering empty grids.
3. **Empty states** — `Teachers` (covered in A2), `Courses` (covered in A1), `MyCourses` already has good empty.
4. **Accessibility & RTL**:
   - Audit color contrast on `text-white/60` over dark gradient in Footer → bump to `/70`.
   - Add visible `:focus-visible` ring to all interactive elements via `index.css` global rule (`outline: 2px solid hsl(var(--ring)); outline-offset: 2px`).
   - Ensure form errors are announced (`role="alert"`) — add to Login/Register/Contact error blocks.
   - Confirm `dir="rtl"` propagation (already on `<html>`).
5. **Keyboard nav** — Navbar mobile menu and profile dropdown already trap on Escape (verified). Add `aria-current="page"` to active nav links.

---

## Files to be changed / created

**Created**
- `src/components/GlobalSeo.tsx` — Organization + WebSite JSON-LD
- `src/lib/seo.ts` — JSON-LD builders (org, website, breadcrumb, itemList)
- `src/components/CookieConsent.tsx` — banner
- `src/components/SecurityNoindex.tsx` — small reusable `<Helmet>` for noindex pages

**Edited**
- `src/App.tsx` — register `/courses`, `/courses/:id`; mount `<GlobalSeo>` and `<CookieConsent>`
- `src/components/PageHelmet.tsx` — extend props (canonical, OG, Twitter, JSON-LD, noindex)
- `index.html` — add CSP, Permissions-Policy, Referrer-Policy, X-Content-Type-Options meta tags
- `public/sitemap.xml` — add lastmod, drop `/login` (or set very low priority + noindex via meta)
- `src/pages/Login.tsx` — noindex, attempt throttle, focus styles, role=alert on errors
- `src/pages/Register.tsx` — noindex, honeypot, HIBP via Cloud config, role=alert
- `src/pages/ForgotPassword.tsx` — noindex
- `src/pages/SmartDashboard.tsx`, `Admin.tsx`, `LectureView.tsx`, `CheckoutReturn.tsx` — noindex
- `src/pages/Teachers.tsx` — richer empty state with CTAs + JSON-LD ItemList
- `src/pages/Courses.tsx` + `src/pages/CourseDetail.tsx` — canonical, ItemList / Course JSON-LD
- `src/pages/Privacy.tsx` — expanded sections (translation keys added)
- `src/pages/Terms.tsx` — expanded sections (translation keys added)
- `src/pages/Contact.tsx` — trust card, hours, honeypot, throttle
- `src/pages/Index.tsx` — Featured tutors guard + trust badges + WebSite JSON-LD
- `src/pages/NotFound.tsx` — robots noindex
- `src/contexts/LanguageContext.tsx` — add new translation keys for expanded legal sections, contact trust block, cookie banner, noindex copy
- `src/components/Footer.tsx` — color contrast bump, add cookie settings link
- `src/index.css` — global `:focus-visible` ring

**Database / Cloud config**
- Call `configure_auth` to enable `password_hibp_enabled: true`. No DB migrations needed.

---

## Before / After Summary

| Area | Before | After |
|---|---|---|
| **SEO — /courses** | Linked from sitemap & footer, 404s | Real route renders Courses page; canonical + ItemList JSON-LD |
| **SEO — meta** | Title+desc only, no canonical/OG/Twitter | Per-page canonical, OG, Twitter, JSON-LD via upgraded PageHelmet |
| **SEO — global structured data** | Only homepage EducationalOrganization | Org + WebSite + SearchAction site-wide; Breadcrumb on all inner pages |
| **SEO — auth/dash pages** | Indexable | `noindex,nofollow` on login/register/dashboard/admin |
| **Security — headers** | None app-level | CSP, Permissions-Policy, Referrer-Policy, X-Content-Type-Options via meta; backend TODOs documented |
| **Security — auth** | No throttle, no HIBP | HIBP on, client throttle + honeypot on forms |
| **Security — clickjacking** | Unprotected | CSP `frame-ancestors 'none'` (modern); X-Frame-Options TODO at edge |
| **Legal — Privacy** | 5 generic sections | 9 GDPR-aligned sections incl. processors, retention, DSR, minors, transfers |
| **Legal — Terms** | 6 generic sections | 9 sections incl. tutor/student duties, recordings, refunds, IP, governing law |
| **Trust — Contact** | Email/phone/wa | + business entity, hours, SLA, quick help, honeypot |
| **Trust — Cookies** | No banner | Lightweight consent banner (essential-only) |
| **UX — Trust signals** | Static numbers | Verified/pay-per-session/cancel-anytime badges + featured tutors guard |
| **UX — Empty states** | Plain "no results" | Actionable CTAs (register as tutor, contact us, browse subjects) |
| **A11y** | Some focus rings, low-contrast footer text | Global focus-visible ring, `role="alert"` on errors, `aria-current` on nav, contrast bumped |

---

## Assumptions

- Legal entity name is "OSTAZE Educational Services" — placeholder, please confirm exact registered name + jurisdiction (we'll mark with `TODO` in code if not confirmed).
- Governing law: Saudi Arabia (matches existing JSON-LD address).
- Microphone permission must remain allowed because the app has voice messages in chat.
- No analytics scripts are loaded today, so cookie banner is informational; if you add GA/Meta Pixel later, banner upgrades to preferences.
- Lovable hosting headers (HSTS, X-Frame-Options at the edge) cannot be set from the codebase; we add what `<meta http-equiv>` supports and document the rest.

---

## Backend TODOs (not fixable in app code)

1. Configure HSTS, X-Frame-Options, COOP, CORP as HTTP response headers at hosting / custom-domain edge.
2. Tune Supabase Auth rate-limits (login, signup, magic link) in Cloud Auth Settings.
3. Confirm and enter the registered legal entity name on Contact + Privacy.
4. If analytics are added, switch cookie banner to preferences mode and update CSP `connect-src`/`script-src`.

Approve to proceed and I'll implement all items above in one pass.
