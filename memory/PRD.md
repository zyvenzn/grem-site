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

## Data sourcing
- Token Analyzer: **LIVE** Solana Tracker.
- Wallet/Intelligence: live Solana Tracker with **deterministic realistic MOCK fallback** when the provider has no data (the example wallet is not a real chain wallet → mock).
- Token Discovery grid: realistic **MOCK** data by design (prototype).
- Zerion client is wired as a secondary source (Solana protocol positions unsupported by Zerion).

## Pages
Home (hero + features + Green Room lore + Who is GREM), /tracker (Wallet Analyzer), /token (Token Analyzer), /intelligence (GREM Intelligence), /tokens (Discovery), /grem ($GREM — placeholders only, NOT launched, Launching on Pump.fun), /docs (Coming soon).

## Brand / rules
- Dark theme, neon green (#00FF66) + Solana purple (#9945FF) accents, 8-bit goblin mascot (real user assets in `/public/grem.jpg`, `/public/grem-hero.jpg`; generated `/public/gremworld.jpg`, `/public/loregrem.jpg`).
- Risk colors: green=low, yellow=warning, red=critical. Never claim a token is "safe". All insights labelled analytical signals, not financial advice.
- No fake $GREM tokenomics/price/contract. Official socials: X https://x.com/GREMTracker , Telegram https://t.me/GREMTracker.

## Status (2026-06)
- MVP complete. Backend 100% + Frontend 100% verified by testing agent (iteration_1).
- All pages, navigation (incl. mobile hamburger), analyzers, intelligence engine, discovery filters/sort, and states (loading/empty/error/invalid) working.

## Backlog / Next
- P1: Wire Zerion enrichment more deeply once a real wallet with data is used; add real trending endpoint for /api/tokens.
- P2: Wallet/token comparison, watchlists, share cards, historical snapshots view, docs content.
