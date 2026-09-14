"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { usd, compact, pct } from "@/lib/format";
import TokenCard, { TokenRow } from "@/components/ui/TokenCard";
import RiskBadge from "@/components/ui/RiskBadge";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import { Search, SlidersHorizontal } from "lucide-react";

const SORTS = [
  { value: "volume_24h_usd", label: "Volume 24h" },
  { value: "market_cap_usd", label: "Market Cap" },
  { value: "liquidity_usd", label: "Liquidity" },
  { value: "change_24h", label: "24h Change" },
  { value: "risk_score", label: "Risk" },
];
const RISKS = [
  { value: "all", label: "All Risk" },
  { value: "low", label: "Lower Risk" },
  { value: "warning", label: "Warning" },
  { value: "critical", label: "Critical" },
];

export default function TokensPage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("volume_24h_usd");
  const [risk, setRisk] = useState("all");
  const [pumpFun, setPumpFun] = useState(false);
  const [newOnly, setNewOnly] = useState(false);
  const [tokens, setTokens] = useState<TokenRow[]>([]);
  const [loading, setLoading] = useState(true);

  const debouncedQ = useDebounce(q, 300);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .tokens({ q: debouncedQ, sort, order: "desc", risk, pump_fun: pumpFun, new_only: newOnly })
      .then((res) => { if (active) { setTokens(res.tokens); setLoading(false); } })
      .catch(() => { if (active) { setTokens([]); setLoading(false); } });
    return () => { active = false; };
  }, [debouncedQ, sort, risk, pumpFun, newOnly]);

  const open = (mint: string) => router.push(`/token?mint=${encodeURIComponent(mint)}`);

  return (
    <div className="container-grem pt-[112px] sm:pt-[128px]">
      <header className="max-w-2xl">
        <span className="eyebrow">Token Discovery</span>
        <h1 className="mt-4 display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">Tokens</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-slate-400">
          Scan the Solana token landscape. Filter by risk, liquidity and Pump.fun status.
          <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-slate-600 mt-2">◇ Prototype grid — sample data</span>
        </p>
      </header>

      {/* Controls */}
      <div className="panel pixel-corner mt-8 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex flex-1 items-center">
            <Search size={17} className="pointer-events-none absolute left-3.5 text-slate-500" />
            <input
              data-testid="tokens-search"
              suppressHydrationWarning
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search token or symbol"
              className="h-11 w-full rounded-lg border border-white/10 bg-black/40 pl-10 pr-3 font-mono text-[14px] text-white outline-none transition-colors placeholder:text-slate-600 focus:border-[#00ff66]/60"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Select testid="tokens-sort" value={sort} onChange={setSort} options={SORTS} icon={<SlidersHorizontal size={14} />} />
            <Select testid="tokens-risk" value={risk} onChange={setRisk} options={RISKS} />
            <Toggle testid="tokens-pumpfun" active={pumpFun} onClick={() => setPumpFun((v) => !v)} label="Pump.fun" />
            <Toggle testid="tokens-new" active={newOnly} onClick={() => setNewOnly((v) => !v)} label="New" />
          </div>
        </div>
      </div>

      <div className="mb-24 mt-6">
        {loading ? (
          <LoadingState label="GREM IS SCANNING" />
        ) : tokens.length === 0 ? (
          <EmptyState title="Nothing suspicious here… yet." hint="No tokens match these filters." />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block panel pixel-corner overflow-hidden">
              <div className="table-scroll">
                <table className="w-full min-w-[820px] text-left text-[14px]" data-testid="tokens-table">
                  <thead>
                    <tr className="border-b border-white/8 font-mono text-[11px] uppercase tracking-[0.1em] text-slate-500">
                      <Th>Token</Th><Th right>Mkt Cap</Th><Th right>Liquidity</Th><Th right>Vol 24h</Th>
                      <Th right>Buys</Th><Th right>Sells</Th><Th right>24h</Th><Th right>Risk</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokens.map((t) => {
                      const up = (t.change_24h ?? 0) >= 0;
                      return (
                        <tr key={t.mint} data-testid="token-row" onClick={() => open(t.mint)} className="cursor-pointer border-b border-white/5 transition-colors hover:bg-[#00ff66]/4">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#00ff66]/30 bg-[#00ff66]/8 font-pixel text-[8px] text-[#00ff66]">
                                {t.symbol.replace(/^\$/, "").slice(0, 3)}
                              </span>
                              <div>
                                <div className="font-semibold text-white">{t.name}</div>
                                <div className="font-mono text-xs text-slate-500">${t.symbol.replace(/^\$/, "")}</div>
                              </div>
                              {t.is_new && <span className="chip !border-[#00ff66]/40 !text-[#00ff66]">New</span>}
                            </div>
                          </td>
                          <Td>{usd(t.market_cap_usd, { compact: true })}</Td>
                          <Td>{usd(t.liquidity_usd, { compact: true })}</Td>
                          <Td>{usd(t.volume_24h_usd, { compact: true })}</Td>
                          <Td className="text-[#00ff66]">{compact(t.buys)}</Td>
                          <Td className="text-[#ef4444]">{compact(t.sells)}</Td>
                          <Td><span style={{ color: up ? "#00ff66" : "#ef4444" }}>{pct(t.change_24h)}</span></Td>
                          <td className="px-4 py-3.5 text-right"><RiskBadge level={t.risk_level ?? "unknown"} score={t.risk_score} size="sm" /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
              {tokens.map((t) => <TokenCard key={t.mint} t={t} onClick={() => open(t.mint)} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function useDebounce<T>(value: T, delay: number) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return <th className={`px-4 py-3 font-medium ${right ? "text-right" : ""}`}>{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3.5 text-right font-mono ${className || "text-slate-200"}`}>{children}</td>;
}

function Select({ value, onChange, options, testid, icon }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; testid: string; icon?: React.ReactNode }) {
  return (
    <div className="relative inline-flex items-center">
      {icon && <span className="pointer-events-none absolute left-3 text-slate-500">{icon}</span>}
      <select
        data-testid={testid}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-11 appearance-none rounded-lg border border-white/10 bg-[#13101c] ${icon ? "pl-9" : "pl-3"} pr-8 font-mono text-[13px] text-slate-200 outline-none transition-colors hover:border-[#00ff66]/40 focus:border-[#00ff66]/60`}
      >
        {options.map((o) => <option key={o.value} value={o.value} className="bg-[#13101c]">{o.label}</option>)}
      </select>
      <span className="pointer-events-none absolute right-3 text-slate-500">▾</span>
    </div>
  );
}

function Toggle({ active, onClick, label, testid }: { active: boolean; onClick: () => void; label: string; testid: string }) {
  return (
    <button
      data-testid={testid}
      onClick={onClick}
      className="h-11 rounded-lg border px-4 font-mono text-[13px] transition-colors"
      style={{
        borderColor: active ? "rgba(0,255,102,0.5)" : "rgba(255,255,255,0.1)",
        color: active ? "#00ff66" : "#94a3b8",
        background: active ? "rgba(0,255,102,0.08)" : "transparent",
      }}
    >
      {label}
    </button>
  );
}
