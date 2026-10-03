"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Eye } from "lucide-react";

const GremScene3D = dynamic(() => import("./GremScene3D"), { ssr: false });

const noopSubscribe = () => () => {};

let cachedCanRun3D: boolean | null = null;
function canRun3D(): boolean {
  if (cachedCanRun3D !== null) return cachedCanRun3D;
  try {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    cachedCanRun3D = !reduced && !!gl;
  } catch {
    cachedCanRun3D = false;
  }
  return cachedCanRun3D;
}

// Server render and the first client render show the static image (same markup),
// then the 3D scene takes over only when WebGL is available and motion is allowed.
export default function HeroMascot() {
  const use3D = useSyncExternalStore(noopSubscribe, canRun3D, () => false);
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
        <Eye size={12} className="text-[#00ff66]" /> {use3D ? "move your cursor · GREM is watching" : "live surveillance · sample feed"}
      </div>
    </div>
  );
}
