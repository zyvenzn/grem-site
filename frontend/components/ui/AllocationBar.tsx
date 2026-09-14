import { usd } from "@/lib/format";

type Alloc = { symbol: string; value_usd: number; percent: number };

const PALETTE = ["#00ff66", "#9945ff", "#14f195", "#38bdf8", "#f59e0b", "#a66cff", "#33ff85"];

export default function AllocationBar({ allocation }: { allocation: Alloc[] }) {
  const items = (allocation ?? []).slice(0, 7).filter((a) => a.percent > 0);
  const total = items.reduce((s, a) => s + a.percent, 0);
  return (
    <div data-testid="allocation-bar">
      <div className="flex h-4 w-full overflow-hidden rounded-full border border-white/10 bg-white/5">
        {items.map((a, i) => (
          <span
            key={a.symbol + i}
            title={`${a.symbol} ${a.percent}%`}
            style={{ width: `${(a.percent / (total || 1)) * 100}%`, background: PALETTE[i % PALETTE.length] }}
            className="h-full transition-all"
          />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-3">
        {items.map((a, i) => (
          <div key={a.symbol + i} className="flex items-center gap-2 text-[13px]">
            <span className="h-2.5 w-2.5 flex-shrink-0 rounded-sm" style={{ background: PALETTE[i % PALETTE.length] }} />
            <span className="font-semibold text-slate-200">{a.symbol}</span>
            <span className="ml-auto font-mono text-slate-400">{a.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
