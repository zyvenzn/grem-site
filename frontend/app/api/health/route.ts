import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "grem",
    provider_key_present: Boolean(process.env.SOLANA_TRACKER_API_KEY),
    time: new Date().toISOString(),
  });
}
