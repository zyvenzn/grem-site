import { NextResponse } from "next/server";
import { getWallet, SOLANA_ADDRESS_RE, TrackerError } from "@/lib/server/tracker";
import { analyze } from "@/lib/server/intelligence";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: Promise<{ address: string }> }) {
  const { address } = await ctx.params;
  if (!SOLANA_ADDRESS_RE.test(address)) {
    return NextResponse.json({ detail: "invalid_solana_address" }, { status: 422 });
  }
  try {
    const wallet = await getWallet(address);
    const derived = analyze(wallet);
    return NextResponse.json({
      source: wallet.source,
      address,
      wallet_score: derived.intelligence.wallet_score,
      trader_profile: derived.intelligence.trader_profile,
      patterns: derived.intelligence.patterns,
      grems_take: derived.intelligence.grems_take,
      trading_profile: derived.trading_profile,
      portfolio: derived.portfolio,
      retrieved_at: new Date().toISOString(),
    });
  } catch (e) {
    const err = e instanceof TrackerError ? e : new TrackerError(502, "provider_unavailable");
    return NextResponse.json({ detail: err.code }, { status: err.status });
  }
}
