"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { EXAMPLE_WALLET } from "@/lib/constants";
import { shortAddr } from "@/lib/format";
import SearchInput from "@/components/ui/SearchInput";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import IntelligenceCard from "@/components/ui/IntelligenceCard";
import Meter from "@/components/ui/Meter";
import Disclaimer from "@/components/ui/Disclaimer";
import GremAvatar from "@/components/ui/GremAvatar";

const PROFILES = ["Meme Speculator", "Long-Term Holder", "High-Frequency Trader", "Whale", "Micro-Cap Hunter", "Diversified Trader"];

function scoreColor(s: number) {
  if (s >= 66) return "#00ff66";
  if (s >= 40) return "#f59e0b";
  return "#ef4444";
}

function ScoreGauge({ score }: { score: number }) {
  const color = scoreColor(score);
  return (
    <div className="relative grid h-44 w-44 place-items-center">
      <div
        className="h-44 w-44 rounded-full"
        style={{ background: `conic-gradient(${color} ${score * 3.6}deg, rgba(255,255,255,0.06) 0deg)` }}
      />
      <div className="absolute grid h-32 w-32 place-items-center rounded-full bg-[#0d0a12] text-center">
        <div>
          <div className="display text-4xl font-bold" style={{ color }}>{score}</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">/ 100</div>
        </div>
      </div>
    </div>
  );
}

function IntelInner() {
  const params = useSearchParams();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [data, setData] = useState<any>(null);
  const [errCode, setErrCode] = useState("network_error");
  const [current, setCurrent] = useState("");

  const run = useCallback(async (address: string) => {
    setCurrent(address);
    setStatus("loading");
    try {
      const res = await api.intelligence(address);
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
        <span className="eyebrow">GREM Intelligence</span>
        <h1 className="mt-4 display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">
          GREM connects<br />the dots.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-slate-400">
          Feed GREM a wallet. It converts blockchain data into a readable score, a trader profile
          and the patterns hiding in the noise.
        </p>
      </header>

      <div className="mt-8">
        <SearchInput placeholder="Enter Solana wallet address" buttonLabel="Investigate" onSubmit={run} loading={status === "loading"} testid="intel-search" />
        <button data-testid="intel-example" onClick={() => run(EXAMPLE_WALLET)} className="mt-3 font-mono text-[12px] text-slate-500 transition-colors hover:text-[#00ff66]">
          ▸ Try example wallet
        </button>
      </div>

      <div className="mb-24 mt-8">
        {status === "idle" && (
          <div className="panel pixel-corner scanlines p-10 sm:p-14">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="float-y"><GremAvatar size={72} watching /></div>
              <div>
                <h3 className="display text-lg font-bold text-white">GREM is waiting for a target.</h3>
                <p className="mt-2 text-[14px] text-slate-400">Drop a wallet address and watch the investigation unfold.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {PROFILES.map((p) => <span key={p} className="chip">{p}</span>)}
              </div>
            </div>
          </div>
        )}
        {status === "loading" && <LoadingState label="GREM IS INVESTIGATING" />}
        {status === "error" && <ErrorState code={errCode} onRetry={() => run(current)} />}
        {status === "done" && data && (
          <div className="grid gap-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
              <div className="panel panel-glow pixel-corner flex flex-col items-center p-6 sm:p-8">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">Wallet Score</span>
                <div className="my-5"><ScoreGauge score={data.wallet_score} /></div>
                <span className="chip !border-[#a66cff]/40 !text-[#c9a5ff]" data-testid="trader-profile">{data.trader_profile}</span>
                <span className="mt-3 font-mono text-[12px] text-slate-500">{shortAddr(data.address, 6)}</span>
              </div>

              <div className="panel pixel-corner p-6 sm:p-8">
                <h2 className="display text-lg font-bold uppercase tracking-wide text-white">Trading Profile</h2>
                <div className="mt-6 grid gap-5">
                  <Meter label="Meme Exposure" value={data.trading_profile.meme_exposure} color="#a66cff" />
                  <Meter label="Low-Cap Exposure" value={data.trading_profile.low_cap_exposure} color="#f59e0b" />
                  <Meter label="Token Diversity" value={data.trading_profile.token_diversity} color="#00ff66" />
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="chip">Risk · {data.trading_profile.risk_level}</span>
                  <span className="chip">Activity · {data.trading_profile.trading_activity}</span>
                </div>
              </div>
            </div>

            <IntelligenceCard take={data.grems_take} patterns={data.patterns} trader={data.trader_profile} />
            <Disclaimer />
          </div>
        )}
      </div>
    </div>
  );
}

export default function IntelligencePage() {
  return (
    <Suspense fallback={<div className="container-grem pt-[128px]" />}>
      <IntelInner />
    </Suspense>
  );
}
