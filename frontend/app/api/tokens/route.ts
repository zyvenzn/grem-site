import { NextResponse } from "next/server";
import { getDiscovery, getTrending, TrackerError } from "@/lib/server/tracker";
import { searchDexScreener } from "@/lib/server/dexscreener";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VALID_SORT = new Set([
  "market_cap_usd", "liquidity_usd", "volume_24h_usd", "buys", "sells", "risk_score", "change_24h", "price_usd",
]);

// Edge/CDN cache: identical queries within 30s reuse one provider call,
// which protects the Solana Tracker and DexScreener quotas from repeated hits.
const CACHE_HEADERS = { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" };

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const rawQ = (sp.get("q") ?? "").trim().slice(0, 80);
  const q = rawQ.toLowerCase();
  const sort = sp.get("sort") ?? "volume_24h_usd";
  const order = sp.get("order") ?? "desc";
  const risk = sp.get("risk");
  const pumpFun = sp.get("pump_fun") === "true";
  const newOnly = sp.get("new_only") === "true";
  const minMc = Number(sp.get("min_market_cap") ?? 0);
  const minLiq = Number(sp.get("min_liquidity") ?? 0);
  const minVol = Number(sp.get("min_volume") ?? 0);
  const rawAge = Number(sp.get("max_age_days") ?? 0);
  const maxAgeDays = Number.isFinite(rawAge) && rawAge > 0 ? Math.min(rawAge, 365) : 0;

  const baseList = () => (maxAgeDays > 0 ? getDiscovery() : getTrending());

  let tokens: any[] = [];
  let searched = false; // true when DexScreener already matched the query for us
  try {
    if (rawQ.length >= 2) {
      try {
        // Free-text search across all Solana tokens (name, ticker or mint address).
        tokens = await searchDexScreener(rawQ);
        searched = true;
      } catch {
        // DexScreener down: fall back to filtering our own list by name.
        tokens = await baseList();
      }
    } else {
      // Default view = trending only (unchanged). max_age_days switches to the wider discovery list.
      tokens = await baseList();
    }
  } catch (e) {
    const err = e instanceof TrackerError ? e : new TrackerError(502, "provider_unavailable");
    return NextResponse.json({ detail: err.code }, { status: err.status });
  }

  if (maxAgeDays > 0) {
    const cutoff = Date.now() - maxAgeDays * 86_400_000;
    tokens = tokens.filter((t) => t.created_at && Date.parse(t.created_at) >= cutoff);
  }
  if (q && !searched) tokens = tokens.filter((t) => t.name.toLowerCase().includes(q) || t.symbol.toLowerCase().includes(q));
  if (risk && risk !== "all") tokens = tokens.filter((t) => t.risk_level === risk);
  if (pumpFun) tokens = tokens.filter((t) => t.pump_fun);
  if (newOnly) tokens = tokens.filter((t) => t.is_new);
  if (minMc) tokens = tokens.filter((t) => t.market_cap_usd >= minMc);
  if (minLiq) tokens = tokens.filter((t) => t.liquidity_usd >= minLiq);
  if (minVol) tokens = tokens.filter((t) => t.volume_24h_usd >= minVol);

  const key = VALID_SORT.has(sort) ? sort : "volume_24h_usd";
  tokens.sort((a, b) => (order === "asc" ? (a[key] ?? 0) - (b[key] ?? 0) : (b[key] ?? 0) - (a[key] ?? 0)));

  return NextResponse.json(
    { source: "live", is_demo: false, count: tokens.length, tokens },
    { headers: CACHE_HEADERS },
  );
}
