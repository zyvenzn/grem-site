import { ShieldCheck, AlertTriangle, ShieldAlert, HelpCircle } from "lucide-react";

type Level = "low" | "warning" | "critical" | "unknown";

const MAP: Record<Level, { label: string; color: string; bg: string; border: string; Icon: any }> = {
  low: { label: "Lower Risk", color: "#00ff66", bg: "rgba(0,255,102,0.1)", border: "rgba(0,255,102,0.4)", Icon: ShieldCheck },
  warning: { label: "Warning", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.4)", Icon: AlertTriangle },
  critical: { label: "Critical", color: "#ef4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.45)", Icon: ShieldAlert },
  unknown: { label: "Unknown", color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.3)", Icon: HelpCircle },
};

export default function RiskBadge({
  level,
  score,
  size = "md",
}: {
  level: Level;
  score?: number | null;
  size?: "sm" | "md";
}) {
  const cfg = MAP[level] ?? MAP.unknown;
  const { Icon } = cfg;
  const pad = size === "sm" ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-[11px]";
  return (
    <span
      data-testid="risk-badge"
      className={`inline-flex items-center gap-1.5 rounded-full font-mono uppercase tracking-[0.08em] ${pad}`}
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      <Icon size={size === "sm" ? 11 : 13} />
      {cfg.label}
      {score !== undefined && score !== null && <span className="opacity-70">· {score}/10</span>}
    </span>
  );
}
