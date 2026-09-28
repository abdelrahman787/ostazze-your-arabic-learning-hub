# Roadmap — pre-publish verification (brief: Finish_all_remaining_verification)

- [ ] 1. Lint to completion; fix errors, report warnings
- [ ] 2. Perf budget for TanStack output, per-route first-load sizes, fail if home > 180 KB gzip
- [ ] 3. SSR first page of /teachers and /courses (public fields only, honest empty state)
- [ ] 4. Full sitemap audit (200, indexable, 1 title, desc, canonical, 1 H1, no redirects/private/invalid/dupes)
- [ ] 5. College routes: real college SSR, fake college 404+noindex, legacy 301
- [ ] 6. Critical user-flow regression tests with disposable data, cleaned up
- [ ] 7. Security after SSR: scan, no secrets/private fields, cache safety, role boundaries
- [ ] 8. Raw-response report for public/private/redirect/404 routes
- [ ] 9. English SEO: no same-URL hreflang; /en/ + hreflang recorded as deferred; no hydration flash on switch
- [ ] 10. Deployment portability: node build/start, docs (Node version, output, env, health route)
- Deferred: separate /en/ URLs with reciprocal hreflang
- Do NOT publish — user reviews first.
