import { NextResponse } from "next/server";
import { getTrending, TrackerError } from "@/lib/server/tracker";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VALID_SORT = new Set([
  "market_cap_usd", "liquidity_usd", "volume_24h_usd", "buys", "sells", "risk_score", "change_24h", "price_usd",
]);

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const q = (sp.get("q") ?? "").toLowerCase();
  const sort = sp.get("sort") ?? "volume_24h_usd";
  const order = sp.get("order") ?? "desc";
  const risk = sp.get("risk");
  const pumpFun = sp.get("pump_fun") === "true";
  const newOnly = sp.get("new_only") === "true";
  const minMc = Number(sp.get("min_market_cap") ?? 0);
  const minLiq = Number(sp.get("min_liquidity") ?? 0);
  const minVol = Number(sp.get("min_volume") ?? 0);

  let tokens: any[];
  try {
    tokens = await getTrending();
  } catch (e) {
    const err = e instanceof TrackerError ? e : new TrackerError(502, "provider_unavailable");
    return NextResponse.json({ detail: err.code }, { status: err.status });
  }

  if (q) tokens = tokens.filter((t) => t.name.toLowerCase().includes(q) || t.symbol.toLowerCase().includes(q));
  if (risk && risk !== "all") tokens = tokens.filter((t) => t.risk_level === risk);
  if (pumpFun) tokens = tokens.filter((t) => t.pump_fun);
  if (newOnly) tokens = tokens.filter((t) => t.is_new);
  if (minMc) tokens = tokens.filter((t) => t.market_cap_usd >= minMc);
  if (minLiq) tokens = tokens.filter((t) => t.liquidity_usd >= minLiq);
  if (minVol) tokens = tokens.filter((t) => t.volume_24h_usd >= minVol);

  const key = VALID_SORT.has(sort) ? sort : "volume_24h_usd";
  tokens.sort((a, b) => (order === "asc" ? (a[key] ?? 0) - (b[key] ?? 0) : (b[key] ?? 0) - (a[key] ?? 0)));

  return NextResponse.json({ source: "live", count: tokens.length, tokens });
}
