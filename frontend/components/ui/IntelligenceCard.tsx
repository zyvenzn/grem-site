import GremAvatar from "./GremAvatar";

export default function IntelligenceCard({
  take,
  patterns,
  score,
  trader,
}: {
  take: string;
  patterns: string[];
  score?: number;
  trader?: string;
}) {
  return (
    <div data-testid="intelligence-card" className="panel panel-glow pixel-corner scanlines overflow-hidden">
      <div className="flex items-center gap-3 border-b border-[#00ff66]/15 bg-[#00ff66]/5 px-5 py-4">
        <GremAvatar size={40} watching />
        <div>
          <div className="display text-lg font-bold uppercase tracking-wide text-white">GREM&apos;s Take</div>
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#33ff85]">investigation complete</div>
        </div>
        {score !== undefined && (
          <div className="ml-auto text-right">
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Wallet Score</div>
            <div className="display text-2xl font-bold text-[#00ff66]">{score}<span className="text-slate-600 text-base">/100</span></div>
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6">
        {trader && <span className="chip !border-[#a66cff]/40 !text-[#c9a5ff]">{trader}</span>}
        <p className="mt-4 font-mono text-[14px] leading-relaxed text-slate-200">
          <span className="text-[#00ff66]">$ grem --analyze</span>
          <br />
          {take}
        </p>

        <div className="mt-6">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">Detected Patterns</div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {patterns.map((p, i) => (
              <li key={i} data-testid="pattern-item" className="flex items-center gap-2.5 rounded-lg border border-white/8 bg-black/30 px-3 py-2.5 text-[13.5px] text-slate-200">
                <span className="font-pixel text-[8px] text-[#00ff66]">▶</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
