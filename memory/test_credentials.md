# Test Credentials

This app has **no authentication** — all pages are public. No login/user accounts.

## Example inputs
- Example Solana wallet (returns deterministic MOCK data — not a real on-chain wallet):
  `57rXqaQsvgYBKwebP2StfqQeCBjBS4jsrZ7EJN5aU2V9b`
- Example token mint (returns LIVE Solana Tracker data):
  `EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm`

## Provider keys
- Solana Tracker + Zerion API keys live in `/app/backend/.env` (SOLANA_TRACKER_API_KEY, ZERION_API_KEY) — server-side only, never in the frontend.

## Base URL
- Preview: https://7fb24cad-0cde-4b97-b88d-ad85794f8df0.preview.emergentagent.com
- Frontend at `/`, backend at `/api/*` (same origin).
