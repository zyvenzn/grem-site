"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";

type Candle = { t: number; o: number; h: number; l: number; c: number; v: number };

const RANGES = ["1H", "24H", "7D", "30D"] as const;
type Range = (typeof RANGES)[number];
type Mode = "line" | "candle";

const UP = "#00ff66";
const DOWN = "#ef4444";
const W = 640;
const H = 240;
const PAD_Y = 14;
const PRICE_BOTTOM = 188; // price area: PAD_Y .. PRICE_BOTTOM
const VOL_TOP = 198; // volume area: VOL_TOP .. H

// Memecoin prices are tiny, so show enough decimals to be readable.
function fmtPrice(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "—";
  if (n >= 1) return `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  const decimals = Math.min(10, Math.max(4, -Math.floor(Math.log10(n)) + 3));
  return `$${n.toFixed(decimals)}`;
}

function fmtVol(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "—";
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(n);
}

function fmtTime(t: number, range: Range): string {
  const d = new Date(t * 1000);
  return range === "1H" || range === "24H"
    ? d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function PriceChart({ mint }: { mint: string }) {
  const [range, setRange] = useState<Range>("24H");
  const [mode, setMode] = useState<Mode>("candle");
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

    // Line mode scales to closes; candle mode scales to the full high/low range.
    const lows = candles.map((k) => k.l);
    const highs = candles.map((k) => k.h);
    const closes = candles.map((k) => k.c);
    let min = mode === "candle" ? Math.min(...lows) : Math.min(...closes);
    let max = mode === "candle" ? Math.max(...highs) : Math.max(...closes);
    if (max === min) {
      max = max * 1.01;
      min = min * 0.99;
    }

    const step = W / n;
    const cx = (i: number) => (i + 0.5) * step; // candle center
    const lx = (i: number) => (i / (n - 1)) * W; // line x (edge to edge)
    const x = mode === "candle" ? cx : lx;
    const y = (v: number) => PAD_Y + (1 - (v - min) / (max - min)) * (PRICE_BOTTOM - PAD_Y);

    const line = candles.map((k, i) => `${i === 0 ? "M" : "L"}${lx(i).toFixed(1)},${y(k.c).toFixed(1)}`).join(" ");
    const area = `${line} L${W},${PRICE_BOTTOM} L0,${PRICE_BOTTOM} Z`;

    const maxVol = Math.max(...candles.map((k) => k.v), 0);
    const volH = H - VOL_TOP;
    const vy = (v: number) => (maxVol > 0 ? H - (v / maxVol) * volH : H);

    const low = Math.min(...lows);
    const high = Math.max(...highs);
    return { x, y, vy, step, line, area, low, high, maxVol };
  }, [candles, mode]);

  const first = candles[0];
  const last = candles[candles.length - 1];
  const active = hover !== null && candles[hover] ? candles[hover] : last;
  const change = first && last && first.o > 0 ? ((last.c - first.o) / first.o) * 100 : 0;
  const up = change >= 0;
  const color = up ? UP : DOWN;
  const gradId = `pc-${mint.slice(0, 8)}`;
  const hasData = state === "done" && !!geo;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const box = boxRef.current;
    if (!box || candles.length < 2) return;
    const rect = box.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const idx = mode === "candle" ? Math.floor(ratio * candles.length) : Math.round(ratio * (candles.length - 1));
    setHover(Math.min(candles.length - 1, Math.max(0, idx)));
  };

  return (
    <div className="panel pixel-corner p-6 sm:p-8" data-testid="price-chart">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">
            {hover !== null && active ? fmtTime(active.t, range) : `Last ${range}`}
          </div>
          <div className="mt-1 display text-2xl font-bold text-white">
            {hasData && active ? fmtPrice(active.c) : "—"}
          </div>
          {hasData && (
            <div className="mt-1 font-mono text-[13px]" style={{ color }}>
              {up ? "+" : ""}
              {change.toFixed(2)}%
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
            {RANGES.map((r) => (
              <Pill key={r} on={r === range} onClick={() => setRange(r)} testid={`chart-range-${r}`}>
                {r}
              </Pill>
            ))}
          </div>
          <div className="flex gap-2">
            <Pill on={mode === "candle"} onClick={() => setMode("candle")} testid="chart-mode-candle">
              Candle
            </Pill>
            <Pill on={mode === "line"} onClick={() => setMode("line")} testid="chart-mode-line">
              Line
            </Pill>
          </div>
        </div>
      </div>

      {/* OHLC + volume readout (shows the latest candle, or the one under the finger) */}
      <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-[11px] sm:grid-cols-5" data-testid="chart-readout">
        <Stat label="O" value={hasData && active ? fmtPrice(active.o) : "—"} />
        <Stat label="H" value={hasData && active ? fmtPrice(active.h) : "—"} />
        <Stat label="L" value={hasData && active ? fmtPrice(active.l) : "—"} />
        <Stat label="C" value={hasData && active ? fmtPrice(active.c) : "—"} />
        <Stat label="Vol" value={hasData && active ? fmtVol(active.v) : "—"} />
      </div>

      <div
        ref={boxRef}
        className="relative mt-3 select-none"
        style={{ height: H, touchAction: "pan-y" }}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        {state === "loading" && <Note>Loading chart…</Note>}
        {state === "error" && <Note>Chart unavailable right now.</Note>}
        {state === "done" && !geo && <Note>Not enough price history yet.</Note>}

        {hasData && geo && (
          <>
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-full w-full" role="img" aria-label="Price chart">
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity="0.28" />
                  <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
              </defs>

              {[0.25, 0.5, 0.75].map((f) => (
                <line
                  key={f}
                  x1="0"
                  x2={W}
                  y1={PAD_Y + (PRICE_BOTTOM - PAD_Y) * f}
                  y2={PAD_Y + (PRICE_BOTTOM - PAD_Y) * f}
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="4 6"
                  vectorEffect="non-scaling-stroke"
                />
              ))}

              {/* Volume bars (both modes) */}
              {geo.maxVol > 0 &&
                candles.map((k, i) => {
                  const bw = Math.max(1, geo.step * 0.7);
                  const top = geo.vy(k.v);
                  return (
                    <rect
                      key={`v${i}`}
                      x={(i + 0.5) * geo.step - bw / 2}
                      y={top}
                      width={bw}
                      height={Math.max(0, H - top)}
                      fill={k.c >= k.o ? UP : DOWN}
                      opacity={hover === i ? 0.7 : 0.3}
                    />
                  );
                })}

              {mode === "line" ? (
                <>
                  <path d={geo.area} fill={`url(#${gradId})`} />
                  <path d={geo.line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                </>
              ) : (
                candles.map((k, i) => {
                  const col = k.c >= k.o ? UP : DOWN;
                  const cxv = geo.x(i);
                  const bw = Math.max(1, geo.step * 0.7);
                  const yo = geo.y(k.o);
                  const yc = geo.y(k.c);
                  return (
                    <g key={`c${i}`}>
                      <line x1={cxv} x2={cxv} y1={geo.y(k.h)} y2={geo.y(k.l)} stroke={col} strokeWidth="1" vectorEffect="non-scaling-stroke" />
                      <rect x={cxv - bw / 2} y={Math.min(yo, yc)} width={bw} height={Math.max(1.5, Math.abs(yc - yo))} fill={col} />
                    </g>
                  );
                })
              )}

              {hover !== null && candles[hover] && (
                <line x1={geo.x(hover)} x2={geo.x(hover)} y1="0" y2={H} stroke="rgba(255,255,255,0.25)" vectorEffect="non-scaling-stroke" />
              )}
            </svg>

            {mode === "line" && hover !== null && candles[hover] && (
              <span
                className="pointer-events-none absolute h-3 w-3 rounded-full border-2"
                style={{
                  left: `${(geo.x(hover) / W) * 100}%`,
                  top: `${(geo.y(candles[hover].c) / H) * 100}%`,
                  transform: "translate(-50%, -50%)",
                  borderColor: color,
                  background: "#0b0914",
                }}
              />
            )}
          </>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-slate-500">
        <span>{hasData && geo ? `Low ${fmtPrice(geo.low)}` : ""}</span>
        <span>{hasData && geo ? `High ${fmtPrice(geo.high)}` : ""}</span>
      </div>
      <p className="mt-3 font-mono text-[11px] text-slate-600">Price in USD · volume below · data from Solana Tracker</p>
    </div>
  );
}

function Pill({ on, onClick, testid, children }: { on: boolean; onClick: () => void; testid: string; children: React.ReactNode }) {
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md border border-white/8 bg-black/30 px-2 py-1.5">
      <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500">{label}</div>
      <div className="break-words text-slate-200">{value}</div>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center font-mono text-[12px] uppercase tracking-[0.12em] text-slate-500">
      {children}
    </div>
  );
}
