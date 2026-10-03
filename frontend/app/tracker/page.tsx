"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { EXAMPLE_WALLET } from "@/lib/constants";
import { usd, num, compact, timeAgo } from "@/lib/format";
import MetricCard from "@/components/ui/MetricCard";
import SearchInput from "@/components/ui/SearchInput";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import WalletSummary from "@/components/ui/WalletSummary";
import IntelligenceCard from "@/components/ui/IntelligenceCard";
import Meter from "@/components/ui/Meter";
import Disclaimer from "@/components/ui/Disclaimer";

const RISK_COLOR: Record<string, string> = { Low: "#00ff66", Medium: "#f59e0b", High: "#ef4444", Critical: "#ef4444" };

function TrackerInner() {
  const params = useSearchParams();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [data, setData] = useState<any>(null);
  const [errCode, setErrCode] = useState("network_error");
  const [current, setCurrent] = useState("");

  const run = useCallback(async (address: string) => {
    setCurrent(address);
    setStatus("loading");
    try {
      const res = await api.wallet(address);
      setData(res);
      setStatus("done");
    } catch (e) {
      setErrCode(e instanceof ApiError ? e.code : "network_error");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    const a = params.get("address");
    if (a) run(a);
  }, [params, run]);

  return (
    <div className="container-grem pt-[112px] sm:pt-[128px]">
      <header className="max-w-2xl">
        <span className="eyebrow">Wallet Analyzer</span>
        <h1 className="mt-4 display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">Tracker</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-slate-400">
          Paste any Solana wallet address. GREM maps the portfolio, holdings and trading behaviour.
        </p>
      </header>

      <div className="mt-8">
        <SearchInput
          placeholder="Enter Solana wallet address"
          buttonLabel="Analyze Wallet"
          onSubmit={run}
          loading={status === "loading"}
          testid="wallet-search"
        />
        <button
          data-testid="wallet-example"
          onClick={() => run(EXAMPLE_WALLET)}
          className="mt-3 font-mono text-[12px] text-slate-500 transition-colors hover:text-[#00ff66]"
        >
          ▸ Try example wallet
        </button>
      </div>

      <div className="mb-24 mt-8">
        {status === "idle" && (
          <EmptyState title="No wallet selected." hint="Enter a Solana address above to begin watching." />
        )}
        {status === "loading" && <LoadingState />}
        {status === "error" && <ErrorState code={errCode} onRetry={() => run(current)} />}
        {status === "done" && data && (
          <div className="grid gap-6">
            <WalletSummary
              address={data.address}
              portfolio={data.portfolio}
              traderProfile={data.intelligence.trader_profile}
              source={data.source}
            />

            {(data.pnl || data.trades) && (
              <section data-testid="trade-performance">
                <h2 className="display text-xl font-bold uppercase tracking-wide text-white">Trade Performance</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {data.pnl?.realized_usd != null && (
                    <MetricCard
                      label="Realized PnL"
                      value={usd(data.pnl.realized_usd)}
                      accent={data.pnl.realized_usd >= 0 ? "#00ff66" : "#ef4444"}
                    />
                  )}
                  {data.pnl?.win_rate != null && (
                    <MetricCard
                      label="Win Rate"
                      value={`${data.pnl.win_rate.toFixed(1)}%`}
                      sub={data.pnl.wins != null && data.pnl.losses != null ? `${num(data.pnl.wins)} wins · ${num(data.pnl.losses)} losses` : undefined}
                    />
                  )}
                  {data.trades && (
                    <MetricCard
                      label="Recent Trades"
                      value={`${num(data.trades.count)}${data.trades.sampled ? "+" : ""}`}
                      sub={data.trades.last_trade_at ? `Last trade ${timeAgo(data.trades.last_trade_at)}` : undefined}
                    />
                  )}
                  {data.trades && (
                    <MetricCard
                      label="Traded Volume"
                      value={usd(data.trades.volume_usd, { compact: true })}
                      sub={`${num(data.trades.distinct_tokens)} distinct tokens`}
                    />
                  )}
                </div>
              </section>
            )}

            <section>
              <h2 className="display text-xl font-bold uppercase tracking-wide text-white">Top Holdings</h2>
              {data.holdings.length === 0 ? (
                <div className="mt-4"><EmptyState title="Nothing suspicious here… yet." hint="No token holdings detected for this wallet." /></div>
              ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {data.holdings.map((h: any, i: number) => (
                    <div key={h.mint + i} data-testid="holding-card" className="panel pixel-corner p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">{h.name}</div>
                          <div className="font-mono text-xs text-slate-500">${h.symbol.replace(/^\$/, "")}</div>
                        </div>
                        <div className="text-right">
                          <div className="display text-lg font-bold text-[#00ff66]">{usd(h.value_usd)}</div>
                          <div className="font-mono text-[11px] text-slate-500">{compact(h.balance)} {h.symbol.replace(/^\$/, "")}</div>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/8 pt-3 text-[13px]">
                        <div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">Mkt Cap</div>
                          <div className="mt-0.5 font-mono text-slate-200">{usd(h.market_cap_usd, { compact: true })}</div>
                        </div>
                        <div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">Liquidity</div>
                          <div className="mt-0.5 font-mono text-slate-200">{usd(h.liquidity_usd, { compact: true })}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
              <div className="panel pixel-corner p-6 sm:p-8">
                <h2 className="display text-xl font-bold uppercase tracking-wide text-white">Trading Profile</h2>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="chip" style={{ color: RISK_COLOR[data.trading_profile.risk_level], borderColor: `${RISK_COLOR[data.trading_profile.risk_level]}55` }}>
                    Risk · {data.trading_profile.risk_level}
                  </span>
                  <span className="chip">
                    Activity · {data.trading_profile.trading_activity}
                    {data.trading_profile.activity_source === "estimate" ? " (est.)" : ""}
                  </span>
                </div>
                <div className="mt-6 grid gap-5">
                  <Meter label="Meme Exposure" value={data.trading_profile.meme_exposure} color="#a66cff" />
                  <Meter label="Low-Cap Exposure" value={data.trading_profile.low_cap_exposure} color="#f59e0b" />
                  <Meter label="Token Diversity" value={data.trading_profile.token_diversity} color="#00ff66" />
                </div>
              </div>

              <IntelligenceCard
                take={data.intelligence.grems_take}
                patterns={data.intelligence.patterns}
                score={data.intelligence.wallet_score}
                trader={data.intelligence.trader_profile}
              />
            </section>

            <Disclaimer className="mt-2" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackerPage() {
  return (
    <Suspense fallback={<div className="container-grem pt-[128px]" />}>
      <TrackerInner />
    </Suspense>
  );
}
