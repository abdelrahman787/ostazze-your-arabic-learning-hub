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
- [ ] Configure exact production and preview recovery redirects — blocked: hosted control exposes current values but not a URL-config write
- [x] Add automated callback and invalid/expired recovery tests
- [ ] Run one-email live recovery verification and full pre-publish checks
- Do NOT publish.
