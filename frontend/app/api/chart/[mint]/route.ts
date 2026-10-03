"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent, ReactNode } from "react";

type Candle = { t: number; o: number; h: number; l: number; c: number; v: number };

const RANGES = ["1H", "24H", "7D", "30D"] as const;
type Range = (typeof RANGES)[number];

const MODES = [
  { id: "line", label: "Line" },
  { id: "candle", label: "Candles" },
] as const;
type Mode = (typeof MODES)[number]["id"];

const UP = "#00ff66";
const DOWN = "#ef4444";

// Drawing area (SVG units). Price on top, volume bars underneath.
const W = 640;
const H = 220;
const PAD_TOP = 12;
const PRICE_BOTTOM = 172;
const VOL_TOP = 184;
const VOL_H = H - VOL_TOP;

// Memecoin prices are tiny, so show enough decimals to be readable.
function fmtPrice(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "—";
  if (n >= 1) return `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  const decimals = Math.min(10, Math.max(4, -Math.floor(Math.log10(n)) + 3));
  return `$${n.toFixed(decimals)}`;
}

const volFmt = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 });
function fmtVol(n: number): string {
  return Number.isFinite(n) && n > 0 ? volFmt.format(n) : "0";
}

function fmtTime(t: number, range: Range): string {
  const d = new Date(t * 1000);
  return range === "1H" || range === "24H"
    ? d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function PriceChart({ mint }: { mint: string }) {
  const [range, setRange] = useState<Range>("24H");
  const [mode, setMode] = useState<Mode>("line");
  const [state, setState] = useState<"loading" | "done" | "error">("loading");
  const [candles, setCandles] = useState<Candle[]>([]);
  const [hover, setHover] = useState<number | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setState("loading");
    setHover(null);
    fetch(`/api/chart/${encodeURIComponent(mint)}?range=${range}`, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((res) => {
        setCandles(Array.isArray(res.candles) ? res.candles : []);
        setState("done");
      })
      .catch((e) => {
        if (e?.name !== "AbortError") {
          setCandles([]);
          setState("error");
        }
      });
    return () => ctrl.abort();
  }, [mint, range]);

  const geo = useMemo(() => {
    const n = candles.length;
    if (n < 2) return null;
    const candleMode = mode === "candle";

    // Candles must fit their wicks; the line only needs the closes.
    let min = candleMode ? Math.min(...candles.map((k) => k.l)) : Math.min(...candles.map((k) => k.c));
    let max = candleMode ? Math.max(...candles.map((k) => k.h)) : Math.max(...candles.map((k) => k.c));
    if (max === min) {
      max = max * 1.01;
      min = min * 0.99;
    }

    const span = PRICE_BOTTOM - PAD_TOP;
    const y = (v: number) => PAD_TOP + (1 - (v - min) / (max - min)) * span;
    const step = W / n;
    const cx = (i: number) => (i + 0.5) * step; // one slot per candle, shared by line, candles and volume
    const line = candles.map((k, i) => `${i === 0 ? "M" : "L"}${cx(i).toFixed(1)},${y(k.c).toFixed(1)}`).join(" ");
    const area = `${line} L${cx(n - 1).toFixed(1)},${PRICE_BOTTOM} L${cx(0).toFixed(1)},${PRICE_BOTTOM} Z`;
    const low = Math.min(...candles.map((k) => k.l));
    const high = Math.max(...candles.map((k) => k.h));
    const vmax = Math.max(...candles.map((k) => k.v));
    return { n, step, y, cx, line, area, low, high, vmax };
  }, [candles, mode]);

  const first = candles[0];
  const last = candles[candles.length - 1];
  const active = hover !== null && candles[hover] ? candles[hover] : last;
  const change = first && last && first.o > 0 ? ((last.c - first.o) / first.o) * 100 : 0;
  const up = change >= 0;
  const color = up ? UP : DOWN;
  const gradId = `pc-${mint.slice(0, 8)}`;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const box = boxRef.current;
    if (!box || candles.length < 2) return;
    const rect = box.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    setHover(Math.min(candles.length - 1, Math.floor(ratio * candles.length)));
  };

  const hovered = hover !== null && candles[hover] ? candles[hover] : null;

  return (
    <div className="panel pixel-corner p-6 sm:p-8" data-testid="price-chart">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">
            {hovered ? fmtTime(hovered.t, range) : `Last ${range}`}
          </div>
          <div className="mt-1 display text-2xl font-bold text-white">
            {state === "done" && geo && active ? fmtPrice(active.c) : "—"}
          </div>
          {state === "done" && geo && (
            <div className="mt-1 font-mono text-[13px]" style={{ color }}>
              {up ? "+" : ""}
              {change.toFixed(2)}%
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {MODES.map((m) => (
            <Pill key={m.id} on={m.id === mode} onClick={() => setMode(m.id)} testid={`chart-mode-${m.id}`}>
              {m.label}
            </Pill>
          ))}
          <span className="mx-1 hidden h-5 w-px bg-white/10 sm:block" />
          {RANGES.map((r) => (
            <Pill key={r} on={r === range} onClick={() => setRange(r)} testid={`chart-range-${r}`}>
              {r}
            </Pill>
          ))}
        </div>
      </div>

      <div
        ref={boxRef}
        className="relative mt-5 select-none"
        style={{ height: H, touchAction: "pan-y" }}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        {state === "loading" && <Note>Loading chart…</Note>}
        {state === "error" && <Note>Chart unavailable right now.</Note>}
        {state === "done" && !geo && <Note>Not enough price history yet.</Note>}

        {state === "done" && geo && (
          <>
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-full w-full" role="img" aria-label="Price chart">
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity="0.28" />
                  <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
              </defs>

              {[0.25, 0.5, 0.75].map((f) => {
                const yy = PAD_TOP + f * (PRICE_BOTTOM - PAD_TOP);
                return <line key={f} x1="0" x2={W} y1={yy} y2={yy} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 6" vectorEffect="non-scaling-stroke" />;
              })}
              <line x1="0" x2={W} y1={VOL_TOP - 5} y2={VOL_TOP - 5} stroke="rgba(255,255,255,0.05)" vectorEffect="non-scaling-stroke" />

              {geo.vmax > 0 &&
                candles.map((k, i) => (
                  <rect
                    key={`v${i}`}
                    x={geo.cx(i) - geo.step * 0.35}
                    y={H - Math.max((k.v / geo.vmax) * VOL_H, 0)}
                    width={geo.step * 0.7}
                    height={Math.max((k.v / geo.vmax) * VOL_H, 0)}
                    fill={k.c >= k.o ? UP : DOWN}
                    opacity="0.35"
                  />
                ))}

              {mode === "line" && (
                <>
                  <path d={geo.area} fill={`url(#${gradId})`} />
                  <path d={geo.line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                </>
              )}

              {mode === "candle" &&
                candles.map((k, i) => {
                  const col = k.c >= k.o ? UP : DOWN;
                  const x = geo.cx(i);
                  const bw = Math.max(geo.step * 0.7, 1);
                  const yO = geo.y(k.o);
                  const yC = geo.y(k.c);
                  return (
                    <g key={`c${i}`}>
                      <line x1={x} x2={x} y1={geo.y(k.h)} y2={geo.y(k.l)} stroke={col} strokeWidth="1" vectorEffect="non-scaling-stroke" />
                      <rect x={x - bw / 2} y={Math.min(yO, yC)} width={bw} height={Math.max(Math.abs(yO - yC), 1)} fill={col} />
                    </g>
                  );
                })}

              {hovered && (
                <line x1={geo.cx(hover as number)} x2={geo.cx(hover as number)} y1="0" y2={H} stroke="rgba(255,255,255,0.25)" vectorEffect="non-scaling-stroke" />
              )}
            </svg>

            {hovered && mode === "line" && (
              <span
                className="pointer-events-none absolute h-3 w-3 rounded-full border-2"
                style={{
                  left: `${(geo.cx(hover as number) / W) * 100}%`,
                  top: `${(geo.y(hovered.c) / H) * 100}%`,
                  transform: "translate(-50%, -50%)",
                  borderColor: color,
                  background: "#0b0914",
                }}
              />
            )}

            {hovered && (
              <div
                data-testid="chart-readout"
                className="pointer-events-none absolute top-1 rounded-md bg-black/70 px-2 py-1 font-mono text-[11px] leading-snug text-slate-300"
                style={(hover as number) / geo.n > 0.5 ? { left: 8 } : { right: 8 }}
              >
                <div>O {fmtPrice(hovered.o)} · H {fmtPrice(hovered.h)}</div>
                <div>L {fmtPrice(hovered.l)} · C {fmtPrice(hovered.c)}</div>
                <div>Vol {fmtVol(hovered.v)}</div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-slate-500">
        <span>{state === "done" && geo ? `Low ${fmtPrice(geo.low)}` : ""}</span>
        <span>{state === "done" && geo ? `High ${fmtPrice(geo.high)}` : ""}</span>
      </div>
      <p className="mt-3 font-mono text-[11px] text-slate-600">Price in USD · bars below show volume · data from Solana Tracker</p>
    </div>
  );
}

function Pill({ on, onClick, testid, children }: { on: boolean; onClick: () => void; testid: string; children: ReactNode }) {
  return (
    <button
      data-testid={testid}
      onClick={onClick}
      className="h-9 rounded-lg border px-3 font-mono text-[12px] transition-colors"
      style={{
        borderColor: on ? "rgba(0,255,102,0.5)" : "rgba(255,255,255,0.1)",
        color: on ? "#00ff66" : "#94a3b8",
        background: on ? "rgba(0,255,102,0.08)" : "transparent",
      }}
    >
      {children}
    </button>
  );
}

function Note({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center font-mono text-[12px] uppercase tracking-[0.12em] text-slate-500">
      {children}
    </div>
  );
}
