import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BASE = "https://data.solanatracker.io";
const MINT_RE = /^[1-9A-HJ-NP-Za-km-z]{32,48}$/;

// Chart range -> candle size and how far back to look.
const RANGES: Record<string, { type: string; seconds: number }> = {
  "1H": { type: "1m", seconds: 3600 },
  "24H": { type: "15m", seconds: 86_400 },
  "7D": { type: "1h", seconds: 7 * 86_400 },
  "30D": { type: "4h", seconds: 30 * 86_400 },
};

// Identical requests within 30s share one provider call (protects API quota).
const CACHE_HEADERS = { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" };

type Candle = { t: number; o: number; h: number; l: number; c: number; v: number };

const num = (v: any): number | null => {
  const x = typeof v === "string" && v.trim() !== "" ? Number(v) : v;
  return typeof x === "number" && Number.isFinite(x) ? x : null;
};

// Accepts a plain array or an object wrapping it, so small response-shape
// differences from the provider do not break the chart.
function normalizeCandles(payload: any): Candle[] {
  const raw = Array.isArray(payload)
    ? payload
    : payload?.oclhv ?? payload?.candles ?? payload?.data ?? payload?.items ?? [];
  if (!Array.isArray(raw)) return [];

  const out: Candle[] = [];
  for (const k of raw) {
    let t = num(k?.time ?? k?.t);
    const o = num(k?.open ?? k?.o);
    const h = num(k?.high ?? k?.h);
    const l = num(k?.low ?? k?.l);
    const c = num(k?.close ?? k?.c);
    const v = num(k?.volume ?? k?.v) ?? 0;
    if (t === null || o === null || h === null || l === null || c === null) continue;
    if (c <= 0) continue;
    if (t > 1e12) t = Math.floor(t / 1000); // milliseconds -> seconds
    out.push({ t, o, h, l, c, v });
  }
  out.sort((a, b) => a.t - b.t);
  return out;
}

export async function GET(req: Request, ctx: { params: Promise<{ mint: string }> }) {
  const { mint } = await ctx.params;
  if (!MINT_RE.test(mint)) {
    return NextResponse.json({ detail: "invalid_token_mint" }, { status: 422 });
  }

  const rangeKey = new URL(req.url).searchParams.get("range") ?? "24H";
  const range = RANGES[rangeKey];
  if (!range) {
    return NextResponse.json({ detail: "invalid_range" }, { status: 422 });
  }

  const key = process.env.SOLANA_TRACKER_API_KEY;
  if (!key) {
    return NextResponse.json({ detail: "server_misconfigured" }, { status: 500 });
  }

  const to = Math.floor(Date.now() / 1000);
  const from = to - range.seconds;
  const url = `${BASE}/chart/${mint}?type=${range.type}&time_from=${from}&time_to=${to}`;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(url, { headers: { "x-api-key": key }, signal: ctrl.signal, cache: "no-store" });
    if (res.status === 404) return NextResponse.json({ detail: "not_found" }, { status: 404 });
    if (!res.ok) return NextResponse.json({ detail: "provider_unavailable" }, { status: 502 });

    const candles = normalizeCandles(await res.json());
    return NextResponse.json(
      { source: "live", mint, range: rangeKey, type: range.type, count: candles.length, candles },
      { headers: CACHE_HEADERS },
    );
  } catch {
    return NextResponse.json({ detail: "provider_unavailable" }, { status: 502 });
  } finally {
    clearTimeout(timer);
  }
}
