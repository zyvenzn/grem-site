export default function Meter({
  label,
  value,
  display,
  color = "#00ff66",
}: {
  label: string;
  value: number;
  display?: string;
  color?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="flex items-center justify-between text-[13px]">
        <span className="text-slate-300">{label}</span>
        <span className="font-mono" style={{ color }}>{display ?? `${Math.round(v)}%`}</span>
      </div>
      <div className="meter mt-2">
        <span style={{ width: `${v}%`, background: color, boxShadow: `0 0 12px ${color}88` }} />
      </div>
    </div>
  );
}
