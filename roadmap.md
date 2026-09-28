# Roadmap — pre-publish verification

- [~] 1. Lint: formatting + most `any` errors fixed; a final full run still shows leftovers to clear
- [x] 2. Perf budget per route; homepage 166 KB gzip (budget 180)
- [x] 3. SSR first page of /teachers (19 tutors) and /courses (5 courses)
- [x] 4. Sitemap audit: 431/431 pass
- [x] 5. College routes: SSR, fake → 404 + noindex, legacy → 301
- [ ] 6. Signed-in user-flow regression tests (not run yet)
- [x] 7. Security: scan clean, 49/49 access tests, private pages no-store, no secrets in pages
- [~] 8. Raw-response report (partly covered by sitemap audit + spot checks)
- [~] 9. English SEO: no hreflang; /en/ deferred (docs/DEPLOYMENT.md); language-switch flash not checked
- [x] 10. Node build/start + docs/DEPLOYMENT.md + /api/health
- Do NOT publish — user reviews first.
