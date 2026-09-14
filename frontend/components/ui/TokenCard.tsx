import { compact, usd, pct } from "@/lib/format";
import RiskBadge from "./RiskBadge";

export type TokenRow = {
  mint: string;
  name: string;
  symbol: string;
  logo?: string | null;
  price_usd?: number;
  change_24h?: number;
  market_cap_usd?: number;
  liquidity_usd?: number;
  volume_24h_usd?: number;
  buys?: number;
  sells?: number;
  risk_score?: number;
  risk_level?: "low" | "warning" | "critical" | "unknown";
  pump_fun?: boolean;
  is_new?: boolean;
};

function Avatar({ symbol, logo }: { symbol: string; logo?: string | null }) {
  if (logo) {
    return <img src={logo} alt={symbol} className="h-10 w-10 rounded-full border border-white/10 object-cover" />;
  }
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#00ff66]/30 bg-[#00ff66]/8 font-pixel text-[9px] text-[#00ff66]">
      {symbol.replace(/^\$/, "").slice(0, 3)}
    </span>
  );
}

export default function TokenCard({ t, onClick }: { t: TokenRow; onClick?: () => void }) {
  const up = (t.change_24h ?? 0) >= 0;
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid="token-card"
      className="panel pixel-corner group w-full p-5 text-left transition-all duration-200 hover:border-[#00ff66]/50 hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar symbol={t.symbol} logo={t.logo} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate font-semibold text-white">{t.name}</span>
              {t.is_new && <span className="chip !border-[#00ff66]/40 !text-[#00ff66]">New</span>}
            </div>
            <div className="font-mono text-xs text-slate-500">${t.symbol.replace(/^\$/, "")}</div>
          </div>
        </div>
        {t.risk_level && <RiskBadge level={t.risk_level} score={t.risk_score} size="sm" />}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-[13px]">
        <Stat label="Mkt Cap" value={usd(t.market_cap_usd, { compact: true })} />
        <Stat label="Liquidity" value={usd(t.liquidity_usd, { compact: true })} />
        <Stat label="Vol 24h" value={usd(t.volume_24h_usd, { compact: true })} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3 text-[13px]">
        <span className="text-slate-400">
          <span className="text-[#00ff66]">{compact(t.buys)}</span> buys ·{" "}
          <span className="text-[#ef4444]">{compact(t.sells)}</span> sells
        </span>
        {t.change_24h !== undefined && (
          <span className="font-mono" style={{ color: up ? "#00ff66" : "#ef4444" }}>{pct(t.change_24h)}</span>
        )}
      </div>
      {t.pump_fun && <div className="mt-3 chip !border-[#a66cff]/40 !text-[#c9a5ff]">Pump.fun</div>}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">{label}</div>
      <div className="mt-0.5 font-mono text-white">{value}</div>
    </div>
  );
}
