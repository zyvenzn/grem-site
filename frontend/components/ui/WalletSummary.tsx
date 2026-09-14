import { usd, num, shortAddr } from "@/lib/format";
import { Copy } from "lucide-react";
import AllocationBar from "./AllocationBar";

type Portfolio = {
  total_usd: number;
  sol_balance: number;
  sol_value_usd: number;
  token_count: number;
  allocation: { symbol: string; value_usd: number; percent: number }[];
};

export default function WalletSummary({
  address,
  portfolio,
  traderProfile,
  source,
}: {
  address: string;
  portfolio: Portfolio;
  traderProfile: string;
  source: string;
}) {
  return (
    <div data-testid="wallet-summary" className="panel panel-glow pixel-corner p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="eyebrow">Portfolio</div>
          <div className="mt-3 flex items-center gap-2 font-mono text-[13px] text-slate-400">
            {shortAddr(address, 6)}
            <button
              onClick={() => navigator.clipboard?.writeText(address)}
              className="text-slate-600 transition-colors hover:text-[#00ff66]"
              aria-label="Copy address"
            >
              <Copy size={13} />
            </button>
          </div>
        </div>
        <span className="chip !border-[#00ff66]/40 !text-[#00ff66]">{traderProfile}</span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Big label="Total Value" value={usd(portfolio.total_usd)} accent="#00ff66" />
        <Big label="SOL Balance" value={`${num(portfolio.sol_balance)} SOL`} sub={usd(portfolio.sol_value_usd)} />
        <Big label="Token Count" value={num(portfolio.token_count)} />
      </div>

      <div className="mt-8">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">Portfolio Allocation</div>
        <div className="mt-4">
          <AllocationBar allocation={portfolio.allocation} />
        </div>
      </div>

      {source === "mock" && (
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-600">
          ◇ Sample data shown — live provider unavailable for this address
        </p>
      )}
    </div>
  );
}

function Big({ label, value, sub, accent = "#ffffff" }: { label: string; value: React.ReactNode; sub?: string; accent?: string }) {
  return (
    <div>
      <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">{label}</div>
      <div className="mt-1.5 display text-xl sm:text-2xl font-bold leading-none" style={{ color: accent }}>{value}</div>
      {sub && <div className="mt-1 text-[13px] text-slate-500">{sub}</div>}
    </div>
  );
}
