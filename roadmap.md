# Roadmap — SSR SEO follow-up (brief: staged TanStack migration)

- [x] 1. Per-page metadata in first server response (title, description, canonical, robots, OG, Twitter, JSON-LD)
- [x] 2. Server 301 (trailing slash, /subjects?department=, legacy college URLs), real 404, X-Robots-Tag on private routes
- [x] 3. Server-rendered verified tutor profiles + published courses (public fields only, 60s shared cache)
- [~] 4. Verification report — done: build, typecheck, tests, raw-HTML checks. Open: lint (times out on full run), perf-budget script (still expects old dist/index.html), full sitemap URL sweep, college 404 check
- [ ] List pages (teachers, courses) still load their cards in the browser, not in the server's first response
- Do NOT publish — user reviews first.
