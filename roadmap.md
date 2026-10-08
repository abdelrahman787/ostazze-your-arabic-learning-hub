# Roadmap — pre-publish verification (round 2)

- [x] 1. Lint: zero errors, warnings by rule/file, rerun build/typecheck/tests
- [x] 2. Signed-in flows: student checks done; tutor/admin accounts + booking/checkout/contact/tutor-application flows still need test accounts (approval) (done; password reset + new sign-up blocked: disposable accounts can’t be created)
- [x] 3. Full raw-response report for every route type
- [x] 4. Language switch AR<->EN on key pages
- [x] 5. /courses initial JS to <=180 KB gzip
- [x] 6. Truth check of Pricing/Contact/tutor/course descriptions
- [x] 7. Security: DB function warnings explained
- Do NOT publish — user reviews first.

# Round 3

- [x] Tutor dashboard lecture cards contrast (light/dark)
- [x] Setup banner below navbar, no layout shift, RTL/LTR, all widths
- [x] Legacy test accounts: sessions revoked, passwords invalidated; admin MFA required
- [x] Test-count discrepancy explained (placeholder test removed)
- [x] Rechecks
- [ ] Delete teacher1@ostazze.com — blocked: publicly listed tutor with lectures/bookings; needs owner confirmation

## Round 4 — quarantine

- [x] Demo tutors/courses unpublished, demo history flagged, old admin + admin2 locked
- [x] Owner-admin abdokhmeis446@gmail.com granted (email verified; MFA + recovery codes built)
- [ ] Owner runs live MFA tests 1-6 on own screen, then revoke admin1 + force reset — blocked: needs owner's authenticator app

## Round 5 — password recovery

- [x] Audit and repair PKCE forgot-password → callback → reset flow
- [ ] Set production Site URL to https://ostaze.com and narrow recovery redirects — blocked: hosted control is read-only here; current allowlist includes the required URLs plus broad wildcards
- [x] Add automated callback and invalid/expired recovery tests
- [x] Run full pre-publish checks (build, Node start/health, tests, typecheck, lint, security, size budget, 412-URL sitemap audit)
- [ ] Complete one-email live recovery verification — blocked: owner must open the one sent email in the same preview browser/profile
- Do NOT publish.

## Round 6 — materials
- [x] Import courses from ALL_UNIVERSITIES_MASTER, UoS_Programs_16-45, ALL_IN_ONE_UoS46-61_HCT spreadsheets

## IGCSE restoration
- [x] Restore the IGCSE catalog and course-detail pages, routes, and navigation without publishing

## Homepage IGCSE section
- [x] Add a bilingual, visually distinctive IGCSE section immediately before Languages, inspired by leading education sites
- [x] Verify placement, images and navigation without publishing

## Homepage trust section
- [ ] Restore the student-count and university trust section and verify Arabic/English display without publishing
