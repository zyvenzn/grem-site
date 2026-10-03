"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";

type Candle = { t: number; o: number; h: number; l: number; c: number; v: number };

const RANGES = ["1H", "24H", "7D", "30D"] as const;
type Range = (typeof RANGES)[number];

const UP = "#00ff66";
const DOWN = "#ef4444";
const W = 640;
const H = 220;
const PAD_Y = 14;

// Memecoin prices are tiny, so show enough decimals to be readable.
function fmtPrice(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "—";
  if (n >= 1) return `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  const decimals = Math.min(10, Math.max(4, -Math.floor(Math.log10(n)) + 3));
  return `$${n.toFixed(decimals)}`;
}

function fmtTime(t: number, range: Range): string {
  const d = new Date(t * 1000);
  return range === "1H" || range === "24H"
    ? d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function PriceChart({ mint }: { mint: string }) {
  const [range, setRange] = useState<Range>("24H");
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
    if (candles.length < 2) return null;
    const closes = candles.map((k) => k.c);
    let min = Math.min(...closes);
    let max = Math.max(...closes);
    if (max === min) {
      max = max * 1.01;
      min = min * 0.99;
    }
    const x = (i: number) => (i / (candles.length - 1)) * W;
    const y = (v: number) => PAD_Y + (1 - (v - min) / (max - min)) * (H - PAD_Y * 2);
    const line = candles.map((k, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(k.c).toFixed(1)}`).join(" ");
    const area = `${line} L${W},${H} L0,${H} Z`;
    const low = Math.min(...candles.map((k) => k.l));
    const high = Math.max(...candles.map((k) => k.h));
    return { x, y, line, area, low, high };
  }, [candles]);

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
    setHover(Math.round(ratio * (candles.length - 1)));
  };

  return (
    <div className="panel pixel-corner p-6 sm:p-8" data-testid="price-chart">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">
            {hover !== null && active ? fmtTime(active.t, range) : `Last ${range}`}
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
        <div className="flex gap-2">
          {RANGES.map((r) => {
            const on = r === range;
            return (
              <button
                key={r}
                data-testid={`chart-range-${r}`}
                onClick={() => setRange(r)}
                className="h-9 rounded-lg border px-3 font-mono text-[12px] transition-colors"
                style={{
                  borderColor: on ? "rgba(0,255,102,0.5)" : "rgba(255,255,255,0.1)",
                  color: on ? "#00ff66" : "#94a3b8",
                  background: on ? "rgba(0,255,102,0.08)" : "transparent",
                }}
              >
                {r}
              </button>
            );
          })}
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
              {[0.25, 0.5, 0.75].map((f) => (
                <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 6" vectorEffect="non-scaling-stroke" />
              ))}
              <path d={geo.area} fill={`url(#${gradId})`} />
              <path d={geo.line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              {hover !== null && candles[hover] && (
                <line x1={geo.x(hover)} x2={geo.x(hover)} y1="0" y2={H} stroke="rgba(255,255,255,0.25)" vectorEffect="non-scaling-stroke" />
              )}
            </svg>
            {hover !== null && candles[hover] && (
              <span
                className="pointer-events-none absolute h-3 w-3 rounded-full border-2"
                style={{
                  left: `${(hover / (candles.length - 1)) * 100}%`,
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
        <span>{state === "done" && geo ? `Low ${fmtPrice(geo.low)}` : ""}</span>
        <span>{state === "done" && geo ? `High ${fmtPrice(geo.high)}` : ""}</span>
      </div>
      <p className="mt-3 font-mono text-[11px] text-slate-600">Price in USD · data from Solana Tracker</p>
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
