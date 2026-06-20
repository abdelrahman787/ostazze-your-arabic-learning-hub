## Goal

Produce full-page screenshots of OSTAZZE's key pages at both desktop and mobile widths, saved to `/mnt/documents/` so you can download them. Then (optionally) do a quick on-page audit using the rendered DOM I can capture myself from the live preview — no need for you to paste outerHTML.

## Pages to capture

1. Home — `/`
2. Teacher listing — `/teachers`
3. A teacher profile — first teacher from `/teachers` (I'll click through to get a real ID)
4. Sign-up — `/register`
5. Pricing — there is no dedicated `/pricing` route. Closest equivalents: `/subjects` (shows session pricing per country) or `/checkout`. **I will use `/subjects`** unless you tell me otherwise, since `/checkout` requires an authenticated session + a selected teacher.

## Viewports

- Desktop: 1440 × 900
- Mobile: 390 × 844 (iPhone 14 class)

Each page captured with `full_page: true` so the entire scroll length is included. Output: 10 PNGs in `/mnt/documents/screenshots/`, named e.g. `home-desktop.png`, `home-mobile.png`, etc., plus one `<presentation-artifact>` per file.

## On-page audit (in place of you pasting outerHTML)

For each page I'll also pull the rendered HTML via the browser tool and check:
- Heading order (single H1, logical H2/H3 nesting)
- `alt` text presence on `<img>`
- ARIA landmarks and labels on interactive controls
- Obvious low-contrast text (computed colors vs background)

Delivered as a short Markdown report at `/mnt/documents/screenshots/audit.md`.

## What I can't do

- **Lighthouse**: not available inside this sandbox. I can run a lightweight perf snapshot via `browser--performance_profile` (FCP, LCP, CLS, INP, JS heap, DOM size, largest/blocking resources) for the home page and include those numbers in the audit. If you want full Lighthouse scores, you'll need to run DevTools → Lighthouse locally and share the JSON.

## Confirm before I start

- OK to use `/subjects` as the "pricing" page? (Alternative: capture `/checkout` while logged-out — it'll redirect to login.)
- Include the perf snapshot + audit report, or screenshots only?
