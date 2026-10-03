"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Eye } from "lucide-react";

const GremScene3D = dynamic(() => import("./GremScene3D"), { ssr: false });

type Mode = "ssr" | "ok" | "reduced-motion" | "no-webgl";

const noopSubscribe = () => () => {};

// Why the 3D scene is (not) shown. Stable string snapshot, computed once per page load.
// Adding ?3d=1 to the URL overrides the reduced-motion preference (useful for testing).
let cachedMode: Mode | null = null;
function detectMode(): Mode {
  if (cachedMode !== null) return cachedMode;
  try {
    const forced = new URLSearchParams(window.location.search).get("3d") === "1";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    cachedMode = !gl ? "no-webgl" : reduced && !forced ? "reduced-motion" : "ok";
  } catch {
    cachedMode = "no-webgl";
  }
  return cachedMode;
}

const LABELS: Record<Mode, string> = {
  ssr: "live surveillance · sample feed",
  ok: "move your cursor · GREM is watching",
  "reduced-motion": "3D off · reduced motion is on (add ?3d=1 to the URL)",
  "no-webgl": "3D off · WebGL unavailable in this browser",
};

// Server render and the first client render show the static image (same markup),
// then the 3D scene takes over only when WebGL is available and motion is allowed.
export default function HeroMascot() {
  const mode = useSyncExternalStore<Mode>(noopSubscribe, detectMode, () => "ssr");
  const use3D = mode === "ok";
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="panel pixel-corner scanlines relative overflow-hidden rounded-2xl border-[#00ff66]/20"
      style={{ aspectRatio: "16 / 10" }}
    >
      {use3D ? (
        <div
          role="img"
          aria-label="GREM the Wallet Goblin as an interactive 3D character that follows your cursor"
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(0,255,102,0.12), rgba(7,6,9,0.95) 70%)" }}
          data-testid="hero-3d"
        >
          <GremScene3D active={visible} />
        </div>
      ) : (
        <img
          src="/grem-hero.jpg"
          alt="GREM in the underground control room, watching wallet activity"
          className="h-full w-full object-cover"
        />
      )}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(180deg, transparent 55%, rgba(7,6,9,0.85))" }}
      />
      <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded-md border border-white/10 bg-black/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-300 backdrop-blur">
        <Eye size={12} className="text-[#00ff66]" /> {LABELS[mode]}
      </div>
    </div>
  );
}
