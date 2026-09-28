# Deployment (portable Node.js / Nitro)

- Node.js: >= 22 (tested on 22.22)
- Build: `npm install && npm run build:node` (sets `NITRO_PRESET=node-server`)
- Start: `npm run start` → `node .output/server/index.mjs` (listens on `PORT`, default 3000)
- Output: `.output/` (`server/` = server bundle, `public/` = static assets)
- Health check: `GET /api/health` → `{"status":"ok"}`, `Cache-Control: no-store`
- Environment: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` (build time; fallbacks exist),
  `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` (server, public data). No service-role key is needed by the web server.
- No Lovable-only runtime dependency: the Node build runs standalone (verified with the node-server preset).
- Performance check: start the server, then `BASE=http://localhost:3000 npm run perf:budget` (fails if homepage JS > 180 KB gzip).
- Sitemap check: `BASE=http://localhost:3000 node scripts/audit-sitemap-live.mjs`.

## Deferred SEO
- Separate `/en/` URLs with reciprocal hreflang. Today the server response is Arabic, so only Arabic is independently indexable; no hreflang is emitted.
