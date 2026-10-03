# GREM — The Wallet Goblin

Solana-native crypto intelligence platform. "You trade. GREM watches."

## Architecture (IMPORTANT)
- **Frontend**: Next.js 16 (App Router, React 19, TypeScript, Tailwind v4) in `/app/frontend`.
  - Served as a **production build** via supervisor `yarn start` -> `next start -p 3000`.
  - ⚠️ Dev-mode (`next dev`) hydration does NOT work behind this preview proxy. We use a production build.
  - **After ANY frontend code change you MUST run:** `cd /app/frontend && yarn build && sudo supervisorctl restart frontend` (no hot reload).
  - API calls use RELATIVE paths (`/api/...`) via `lib/api.ts`; resolved same-origin and routed to backend on port 8001.
- **Backend**: FastAPI in `/app/backend` on port 8001, all routes prefixed `/api`.
  - Modular: `server.py` (routes), `providers.py` (Solana Tracker + Zerion clients + normalizers), `mockdata.py` (deterministic fallback + discovery), `intelligence.py` (GREM scoring engine).
  - Secrets in `/app/backend/.env` only (SOLANA_TRACKER_API_KEY, ZERION_API_KEY) — never exposed to the client.
  - Snapshots persisted to MongoDB (`grem_db`).

## Endpoints
- `GET /api/health`
- `GET /api/wallet/{address}` — portfolio, holdings, trading_profile, intelligence
- `GET /api/intelligence/{address}` — wallet_score, trader_profile, patterns, grems_take
- `GET /api/token/{mint}` — token, market, trading, creator, risk, status
- `GET /api/tokens?q&sort&order&risk&pump_fun&new_only&min_market_cap&min_liquidity&min_volume` — discovery grid

## Data sourcing (updated 2026-10)
- The Next.js route handlers in `frontend/app/api/*` talk to Solana Tracker directly (`lib/server/tracker.ts`). **Everything the frontend shows is live — no mock fallback in the Next.js layer.**
- Token Analyzer, Token Discovery (trending + 24h volume + latest, merged) and charts: LIVE.
- Wallet: LIVE holdings, plus **optional enrichment** — `/pnl/{wallet}` (realized/unrealized PnL, win rate) and `/wallet/{wallet}/trades` (recent trade count, volume, distinct tokens, last trade). Both resolve to `null` on any failure; the page still works.
- Intelligence engine (`lib/server/intelligence.ts`): uses real trade count and win rate when available; otherwise falls back to the old holdings-based estimate (UI labels it "(est.)").
- API responses are CDN-cacheable: wallet/intelligence 60s, token/tokens/chart 30s.
- ⚠️ The PnL/trades endpoint shapes were written from the provider docs without a live test — verify against a real wallet with an API key and adjust the normalizers in `tracker.ts` if fields differ.
- `backend/` (FastAPI + `mockdata.py`) is **legacy** and no longer used by the frontend. Zerion is only wired in that legacy backend.

## Pages
Home (hero + features + Green Room lore + Who is GREM), /tracker (Wallet Analyzer), /token (Token Analyzer), /intelligence (GREM Intelligence), /tokens (Discovery), /grem ($GREM — placeholders only, NOT launched, Launching on Pump.fun), /docs (Coming soon).

## Brand / rules
- Dark theme, neon green (#00FF66) + Solana purple (#9945FF) accents, 8-bit goblin mascot (real user assets in `/public/grem.jpg`, `/public/grem-hero.jpg`; generated `/public/gremworld.jpg`, `/public/loregrem.jpg`).
- Risk colors: green=low, yellow=warning, red=critical. Never claim a token is "safe". All insights labelled analytical signals, not financial advice.
- No fake $GREM tokenomics/price/contract. Official socials: X https://x.com/GREMTracker , Telegram https://t.me/GREMTracker.

## Status (2026-06)
- MVP complete. Backend 100% + Frontend 100% verified by testing agent (iteration_1).
- All pages, navigation (incl. mobile hamburger), analyzers, intelligence engine, discovery filters/sort, and states (loading/empty/error/invalid) working.

## Hero 3D (2026-10)
- `components/HeroMascot.tsx` (client) lazy-loads `components/GremScene3D.tsx` (three + @react-three/fiber): a procedural voxel GREM that follows the cursor, with orbiting neon cubes.
- Falls back to the static `/grem-hero.jpg` on SSR, when WebGL is missing, or when `prefers-reduced-motion` is set. Rendering pauses when the hero is off-screen.
- Requires: `npm install three @react-three/fiber` and `npm install -D @types/three` in `frontend/`.

## Backlog / Next
- P1: Wire Zerion enrichment more deeply once a real wallet with data is used; add real trending endpoint for /api/tokens.
- P2: Wallet/token comparison, watchlists, share cards, historical snapshots view, docs content.
