import { NextResponse } from "next/server";
import { getToken, SOLANA_ADDRESS_RE, TrackerError } from "@/lib/server/tracker";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: Promise<{ mint: string }> }) {
  const { mint } = await ctx.params;
  if (!SOLANA_ADDRESS_RE.test(mint)) {
    return NextResponse.json({ detail: "invalid_token_mint" }, { status: 422 });
  }
  try {
    const result = await getToken(mint);
    return NextResponse.json({ ...result, retrieved_at: new Date().toISOString() });
  } catch (e) {
    const err = e instanceof TrackerError ? e : new TrackerError(502, "provider_unavailable");
    return NextResponse.json({ detail: err.code }, { status: err.status });
  }
}
