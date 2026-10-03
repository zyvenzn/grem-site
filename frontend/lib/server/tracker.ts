// Server-only Solana Tracker client + normalizers.
// Reads SOLANA_TRACKER_API_KEY from the server environment (never exposed to the browser).
// Used exclusively by Next.js Route Handlers under app/api/*.

const BASE = "https://data.solanatracker.io";

export const SOLANA_ADDRESS_RE = /^[1-9A-HJ-NP-Za-km-z]{32,48}$/;

export class TrackerError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string) {
    super(code);
    this.status = status;
    this.code = code;
  }
}

function apiKey(): string {
  const k = process.env.SOLANA_TRACKER_API_KEY;
  if (!k) throw new TrackerError(500, "server_misconfigured");
  return k;
}

async function trackerGet(path: string): Promise<any> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { "x-api-key": apiKey() },
      signal: ctrl.signal,
      cache: "no-store",
    });
  } catch {
    clearTimeout(timer);
    throw new TrackerError(502, "provider_unavailable");
  }
  clearTimeout(timer);
  if (res.status === 404) throw new TrackerError(404, "not_found");
  if (!res.ok) throw new TrackerError(502, "provider_unavailable");
  return res.json();
}

const n = (...vals: any[]): number => {
  for (const v of vals) {
    if (typeof v === "number" && !Number.isNaN(v)) return v;
    if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
  }
  return 0;
};

const usdOf = (obj: any): number =>
  typeof obj === "object" && obj !== null ? n(obj.usd) : n(obj);

const SOL_MINTS = new Set([
  "So11111111111111111111111111111111111111112",
  "So11111111111111111111111111111111111111111",
]);

export async function getWallet(address: string) {
  const data = await trackerGet(`/wallet/${address}`);
  const raw: any[] = Array.isArray(data?.tokens) ? data.tokens : [];
  if (raw.length === 0 && !data?.total) throw new TrackerError(404, "not_found");

  let solBalance = 0;
  let solPrice = 0;
  let solValue = 0;
  const holdings: any[] = [];

  for (const h of raw) {
    const tk = h?.token ?? {};
    const pool = Array.isArray(h?.pools) && h.pools.length ? h.pools[0] : {};
    const price = usdOf(pool?.price);
    const balance = n(h?.balance, h?.amount);
    const value = n(h?.value, h?.valueUsd, balance * price);
    const symbol = tk?.symbol ?? "UNKNOWN";
    const mint = tk?.mint ?? h?.mint ?? "";
    if (symbol === "SOL" || SOL_MINTS.has(mint)) {
      solBalance = balance;
      solPrice = price;
      solValue = value;
      continue;
    }
    holdings.push({
      mint,
      name: tk?.name ?? symbol,
      symbol,
      balance: Math.round(balance * 10000) / 10000,
      price_usd: price,
      value_usd: Math.round(value * 100) / 100,
      market_cap_usd: usdOf(pool?.marketCap),
      liquidity_usd: usdOf(pool?.liquidity),
      logo: tk?.image ?? tk?.logo ?? null,
    });
  }

  holdings.sort((a, b) => b.value_usd - a.value_usd);
  const total = n(data?.total, solValue + holdings.reduce((s, h) => s + h.value_usd, 0));

  return {
    source: "live" as const,
    address,
    sol_balance: Math.round(solBalance * 10000) / 10000,
    sol_value_usd: Math.round(solValue * 100) / 100,
    sol_price_usd: solPrice,
    token_count: raw.length,
    holdings: holdings.slice(0, 8),
    total_usd: Math.round(total * 100) / 100,
  };
}

function riskLevel(score: number | null | undefined): string {
  if (score === null || score === undefined) return "unknown";
  if (score <= 3) return "low";
  if (score <= 6) return "warning";
  return "critical";
}

function count(v: any): number {
  if (Array.isArray(v)) return v.length;
  if (v && typeof v === "object") return v.count ?? Object.keys(v).length;
  if (typeof v === "number") return v;
  return 0;
}

export async function getToken(mint: string) {
  const info = await trackerGet(`/tokens/${mint}`);
  let stats: any = {};
  try {
    stats = await trackerGet(`/stats/${mint}`);
  } catch {
    stats = {};
  }
  const token = info?.token ?? info ?? {};
  const pool = Array.isArray(info?.pools) && info.pools.length ? info.pools[0] : {};
  const risk = info?.risk ?? {};
  const txns = pool?.txns ?? {};
  const day = stats?.["24h"] ?? {};

  const score = typeof risk?.score === "number" ? risk.score : null;
  const reasons = Array.isArray(risk?.risks)
    ? risk.risks.map((r: any) => (typeof r === "object" ? r?.name ?? r?.description ?? "" : String(r))).filter(Boolean)
    : [];
  const buys = Math.round(n(txns?.buys, info?.buys, day?.buys));
  const sells = Math.round(n(txns?.sells, info?.sells, day?.sells));
  const market = pool?.market;

  return {
    source: "live" as const,
    mint,
    token: { name: token?.name ?? null, symbol: token?.symbol ?? null, mint, logo: token?.image ?? token?.logo ?? null, decimals: token?.decimals ?? pool?.decimals ?? null },
    market: {
      price_usd: usdOf(pool?.price),
      market_cap_usd: usdOf(pool?.marketCap),
      liquidity_usd: usdOf(pool?.liquidity),
      volume_24h_usd: n(txns?.volume24h, txns?.volume, day?.volume),
    },
    trading: { buys, sells, transactions: buys + sells, buy_sell_ratio: Math.round((buys / Math.max(sells, 1)) * 100) / 100 },
    creator: { wallet: token?.creation?.creator ?? pool?.deployer ?? null, creation_date: token?.creation?.created_time ?? null },
    risk: {
      score,
      level: riskLevel(score),
      rugged: risk?.rugged ?? false,
      snipers: count(risk?.snipers),
      bundlers: count(risk?.bundlers),
      insiders: count(risk?.insiders ?? risk?.top10),
      reasons,
    },
    status: {
      pump_fun: market === "pumpfun" || Boolean(pool?.curve),
      bonding_curve: pool?.curvePercentage ?? pool?.curve ?? null,
      decimals: token?.decimals ?? pool?.decimals ?? null,
    },
  };
}

// One row of the Token Discovery grid, built from a Solana Tracker list item.
function normalizeListItem(it: any, now: number) {
  const tk = it?.token ?? {};
  const pool = Array.isArray(it?.pools) && it.pools.length ? it.pools[0] : {};
  const events = it?.events ?? {};
  const risk = it?.risk ?? {};
  const score = typeof risk?.score === "number" ? risk.score : null;
  const created = tk?.creation?.created_time ? tk.creation.created_time * (tk.creation.created_time < 1e12 ? 1000 : 1) : null;
  return {
    mint: tk?.mint ?? "",
    name: tk?.name ?? tk?.symbol ?? "Unknown",
    symbol: tk?.symbol ?? "?",
    logo: tk?.image ?? null,
    price_usd: usdOf(pool?.price),
    change_24h: n(events?.["24h"]?.priceChangePercentage),
    market_cap_usd: usdOf(pool?.marketCap),
    liquidity_usd: usdOf(pool?.liquidity),
    volume_24h_usd: n(pool?.txns?.volume24h, pool?.txns?.volume),
    buys: Math.round(n(it?.buys, pool?.txns?.buys)),
    sells: Math.round(n(it?.sells, pool?.txns?.sells)),
    risk_score: score,
    risk_level: riskLevel(score),
    pump_fun: pool?.market === "pumpfun" || Boolean(pool?.curve),
    is_new: created ? now - created < 48 * 3600 * 1000 : false,
    created_at: created ? new Date(created).toISOString() : null,
  };
}

async function fetchList(path: string): Promise<any[]> {
  const data = await trackerGet(path);
  return Array.isArray(data) ? data : data?.data ?? data?.tokens ?? [];
}

export async function getTrending() {
  const arr = await fetchList(`/tokens/trending`);
  const now = Date.now();
  return arr
    .slice(0, 40)
    .map((it: any) => normalizeListItem(it, now))
    .filter((t: any) => t.mint);
}

// Wider net for "new tokens that already reached a big market cap":
// merges trending + 24h volume leaders + latest launches, de-duplicated by mint.
// Succeeds as long as at least one of the three lists loads.
const DISCOVERY_PATHS = ["/tokens/trending", "/tokens/volume/24h", "/tokens/latest"];

export async function getDiscovery() {
  const results = await Promise.allSettled(DISCOVERY_PATHS.map((p) => fetchList(p)));
  const lists = results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
  if (lists.length === 0) throw new TrackerError(502, "provider_unavailable");

  const now = Date.now();
  const byMint = new Map<string, any>();
  for (const list of lists) {
    for (const it of list.slice(0, 100)) {
      const t = normalizeListItem(it, now);
      if (t.mint && !byMint.has(t.mint)) byMint.set(t.mint, t);
    }
  }
  return Array.from(byMint.values());
}
