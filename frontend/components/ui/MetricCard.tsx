export default function MetricCard({
  label,
  value,
  sub,
  accent = "#e2e8f0",
  icon,
  testid,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  accent?: string;
  icon?: React.ReactNode;
  testid?: string;
}) {
  return (
    <div data-testid={testid ?? "metric-card"} className="panel pixel-corner p-5 sm:p-6 transition-colors hover:border-[#00ff66]/30">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</span>
        {icon && <span className="text-slate-500">{icon}</span>}
      </div>
      <div className="mt-3 display text-2xl sm:text-3xl font-bold leading-none" style={{ color: accent }}>
        {value}
      </div>
      {sub && <div className="mt-2 text-[13px] text-slate-400">{sub}</div>}
    </div>
  );
}
