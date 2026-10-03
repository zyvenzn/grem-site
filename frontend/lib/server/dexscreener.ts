// Server-only DexScreener client (public API, no key needed, 60 requests/min).
// Used by app/api/tokens/route.ts to power free-text token search.
// Never call this from the browser: keep traffic going through our own route so
// the CDN cache in front of it protects the rate limit.

const BASE = "https://api.dexscreener.com";

export class DexError extends Error {
  code: string;
  constructor(code: string) {
    super(code);
    this.code = code;
  }
}

const n = (...vals: any[]): number => {
  for (const v of vals) {
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) return Number(v);
  }
  return 0;
};

// Same row shape as the Solana Tracker lists, so the Tokens page needs no changes.
// DexScreener has no risk score, so risk fields stay empty ("unknown").
function normalizePair(p: any, now: number) {
  const created = n(p?.pairCreatedAt) || null; // milliseconds
  const dexId = String(p?.dexId ?? "").toLowerCase();
  return {
    mint: p?.baseToken?.address ?? "",
    name: p?.baseToken?.name ?? p?.baseToken?.symbol ?? "Unknown",
    symbol: p?.baseToken?.symbol ?? "?",
    logo: p?.info?.imageUrl ?? null,
    price_usd: n(p?.priceUsd),
    change_24h: n(p?.priceChange?.h24),
    market_cap_usd: n(p?.marketCap, p?.fdv),
    liquidity_usd: n(p?.liquidity?.usd),
    volume_24h_usd: n(p?.volume?.h24),
    buys: Math.round(n(p?.txns?.h24?.buys)),
    sells: Math.round(n(p?.txns?.h24?.sells)),
    risk_score: null as number | null,
    risk_level: "unknown",
    pump_fun: dexId.includes("pump"),
    is_new: created ? now - created < 48 * 3600 * 1000 : false,
    created_at: created ? new Date(created).toISOString() : null,
  };
}

export async function searchDexScreener(query: string) {
  const q = query.trim();
  if (q.length < 2) return [];

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  let res: Response;
  try {
    res = await fetch(`${BASE}/latest/dex/search?q=${encodeURIComponent(q)}`, {
      headers: { accept: "application/json" },
      signal: ctrl.signal,
      cache: "no-store",
    });
  } catch {
    throw new DexError("provider_unavailable");
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) throw new DexError("provider_unavailable");

  let json: any;
  try {
    json = await res.json();
  } catch {
    throw new DexError("provider_unavailable");
  }
  const pairs: any[] = Array.isArray(json?.pairs) ? json.pairs : [];

  // Solana only. One row per token: keep the pair with the deepest liquidity.
  const best = new Map<string, any>();
  for (const p of pairs) {
    if (p?.chainId !== "solana" || !p?.baseToken?.address) continue;
    const key = p.baseToken.address as string;
    const cur = best.get(key);
    if (!cur || n(p?.liquidity?.usd) > n(cur?.liquidity?.usd)) best.set(key, p);
  }

  const now = Date.now();
  return Array.from(best.values())
    .map((p) => normalizePair(p, now))
    .sort((a, b) => b.volume_24h_usd - a.volume_24h_usd)
    .slice(0, 30);
}
  
