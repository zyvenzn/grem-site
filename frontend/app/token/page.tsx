"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { EXAMPLE_TOKEN } from "@/lib/constants";
import { usd, compact, shortAddr, dateStr } from "@/lib/format";
import SearchInput from "@/components/ui/SearchInput";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import MetricCard from "@/components/ui/MetricCard";
import RiskBadge from "@/components/ui/RiskBadge";
import Disclaimer from "@/components/ui/Disclaimer";
import PriceChart from "@/components/ui/PriceChart";
import { Copy } from "lucide-react";

const RISK_COLOR: Record<string, string> = { low: "#00ff66", warning: "#f59e0b", critical: "#ef4444", unknown: "#94a3b8" };

function TokenInner() {
  const params = useSearchParams();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [data, setData] = useState<any>(null);
  const [errCode, setErrCode] = useState("network_error");
  const [current, setCurrent] = useState("");

  const run = useCallback(async (mint: string) => {
    setCurrent(mint);
    setStatus("loading");
    try {
      const res = await api.token(mint);
      setData(res);
      setStatus("done");
    } catch (e) {
      setErrCode(e instanceof ApiError ? e.code : "network_error");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    const m = params.get("mint");
    if (m) run(m);
  }, [params, run]);

  const level = data?.risk?.level ?? "unknown";
  const score = data?.risk?.score ?? null;

  return (
    <div className="container-grem pt-[112px] sm:pt-[128px]">
      <header className="max-w-2xl">
        <span className="eyebrow">Token Analyzer</span>
        <h1 className="mt-4 display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">Token</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-slate-400">
          Inspect any Solana token: market, trading flow, creator and GREM risk signals.
        </p>
      </header>

      <div className="mt-8">
        <SearchInput
          placeholder="Enter token mint address"
          buttonLabel="Analyze Token"
          onSubmit={run}
          loading={status === "loading"}
          testid="token-search"
        />
        <button data-testid="token-example" onClick={() => run(EXAMPLE_TOKEN)} className="mt-3 font-mono text-[12px] text-slate-500 transition-colors hover:text-[#00ff66]">
          ▸ Try example token
        </button>
      </div>

      <div className="mb-24 mt-8">
        {status === "idle" && <EmptyState title="No token selected." hint="Enter a token mint address above to inspect it." />}
        {status === "loading" && <LoadingState />}
        {status === "error" && <ErrorState code={errCode} onRetry={() => run(current)} />}
        {status === "done" && data && (
          <div className="grid gap-6">
            {/* TOKEN header */}
            <div className="panel panel-glow pixel-corner p-6 sm:p-8" data-testid="token-header">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {data.token.logo ? (
                    <img src={data.token.logo} alt={data.token.symbol} className="h-14 w-14 rounded-full border border-white/10 object-cover" />
                  ) : (
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#00ff66]/30 bg-[#00ff66]/8 font-pixel text-[10px] text-[#00ff66]">
                      {(data.token.symbol ?? "?").replace(/^\$/, "").slice(0, 3)}
                    </span>
                  )}
                  <div>
                    <div className="display text-2xl font-bold text-white">{data.token.name ?? "Unknown Token"}</div>
                    <div className="font-mono text-sm text-slate-500">${(data.token.symbol ?? "—").replace(/^\$/, "")}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {data.status.pump_fun && <span className="chip !border-[#a66cff]/40 !text-[#c9a5ff]">Pump.fun</span>}
                  <RiskBadge level={level} score={score} />
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2 border-t border-white/8 pt-4 font-mono text-[12px] text-slate-500">
                Mint: {shortAddr(data.mint, 8)}
                <button onClick={() => navigator.clipboard?.writeText(data.mint)} className="text-slate-600 transition-colors hover:text-[#00ff66]" aria-label="Copy mint"><Copy size={13} /></button>
                {data.source === "mock" && <span className="ml-auto uppercase tracking-[0.12em] text-slate-600">◇ sample data</span>}
              </div>
            </div>

            {/* MARKET */}
            <section>
              <h2 className="display text-lg font-bold uppercase tracking-wide text-white">Market</h2>
              <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
                <MetricCard label="Price" value={usd(data.market.price_usd)} accent="#00ff66" />
                <MetricCard label="Market Cap" value={usd(data.market.market_cap_usd, { compact: true })} />
                <MetricCard label="Liquidity" value={usd(data.market.liquidity_usd, { compact: true })} accent="#14f195" />
                <MetricCard label="Volume 24h" value={usd(data.market.volume_24h_usd, { compact: true })} accent="#38bdf8" />
              </div>
            </section>

            {/* PRICE CHART */}
            <section>
              <h2 className="display text-lg font-bold uppercase tracking-wide text-white">Price</h2>
              <div className="mt-4">
                <PriceChart key={data.mint} mint={data.mint} />
              </div>
            </section>

            {/* TRADING */}
            <section>
              <h2 className="display text-lg font-bold uppercase tracking-wide text-white">Trading</h2>
              <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
                <MetricCard label="Buys" value={compact(data.trading.buys)} accent="#00ff66" />
                <MetricCard label="Sells" value={compact(data.trading.sells)} accent="#ef4444" />
                <MetricCard label="Transactions" value={compact(data.trading.transactions)} />
                <MetricCard label="Buy / Sell Ratio" value={data.trading.buy_sell_ratio ?? "—"} accent={(data.trading.buy_sell_ratio ?? 1) >= 1 ? "#00ff66" : "#ef4444"} />
              </div>
            </section>

            {/* RISK + STATUS */}
            <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              <div className="panel pixel-corner p-6 sm:p-8" data-testid="risk-panel">
                <div className="flex items-center justify-between">
                  <h2 className="display text-lg font-bold uppercase tracking-wide text-white">Risk</h2>
                  <RiskBadge level={level} score={score} />
                </div>

                <div className="mt-6">
                  <div className="flex items-end justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">Risk Score</span>
                    <span className="display text-3xl font-bold" style={{ color: RISK_COLOR[level] }}>
                      {score ?? "—"}<span className="text-base text-slate-600">/10</span>
                    </span>
                  </div>
                  <div className="meter mt-3">
                    <span style={{ width: `${((score ?? 0) / 10) * 100}%`, background: RISK_COLOR[level], boxShadow: `0 0 12px ${RISK_COLOR[level]}88` }} />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <RiskStat label="Rugged" value={data.risk.rugged ? "Yes" : "No"} danger={data.risk.rugged} />
                  <RiskStat label="Snipers" value={compact(data.risk.snipers)} />
                  <RiskStat label="Bundlers" value={compact(data.risk.bundlers)} />
                  <RiskStat label="Insiders" value={compact(data.risk.insiders)} />
                </div>

                {data.risk.reasons?.length > 0 && (
                  <ul className="mt-6 space-y-2">
                    {data.risk.reasons.map((r: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-[13.5px] text-slate-300">
                        <span className="mt-0.5 font-pixel text-[8px] text-[#f59e0b]">▲</span> {r}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-6 font-mono text-[11px] leading-relaxed text-slate-500">
                  <span className="text-[#f59e0b]">◆</span> A low risk score does not mean this token is safe.
                  Always do your own research.
                </p>
              </div>

              <div className="grid gap-6">
                <div className="panel pixel-corner p-6" data-testid="creator-panel">
                  <h2 className="display text-lg font-bold uppercase tracking-wide text-white">Creator</h2>
                  <div className="mt-4 space-y-3 text-[14px]">
                    <Row label="Creator Wallet" value={data.creator.wallet ? shortAddr(data.creator.wallet, 6) : "Unknown"} />
                    <Row label="Creation Date" value={dateStr(data.creator.creation_date)} />
                  </div>
                </div>

                <div className="panel pixel-corner p-6" data-testid="status-panel">
                  <h2 className="display text-lg font-bold uppercase tracking-wide text-white">Token Status</h2>
                  <div className="mt-4 space-y-3 text-[14px]">
                    <Row label="Pump.fun" value={data.status.pump_fun ? "Yes" : "No"} />
                    <Row label="Bonding Curve" value={data.status.bonding_curve ? String(data.status.bonding_curve) : "—"} />
                    <Row label="Decimals" value={data.status.decimals ?? "—"} />
                  </div>
                </div>
              </div>
            </section>

            <Disclaimer />
          </div>
        )}
      </div>
    </div>
  );
}

function RiskStat({ label, value, danger }: { label: string; value: React.ReactNode; danger?: boolean }) {
  return (
    <div className="rounded-lg border border-white/8 bg-black/30 p-3 text-center">
      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">{label}</div>
      <div className="mt-1 display text-lg font-bold" style={{ color: danger ? "#ef4444" : "#e2e8f0" }}>{value}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/6 pb-3 last:border-0 last:pb-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-mono text-slate-200">{value}</span>
    </div>
  );
}

export default function TokenPage() {
  return (
    <Suspense fallback={<div className="container-grem pt-[128px]" />}>
      <TokenInner />
    </Suspense>
  );
}
