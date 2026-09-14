import GremAvatar from "./GremAvatar";

export default function LoadingState({ label = "GREM IS LOOKING", testid = "loading-state" }: { label?: string; testid?: string }) {
  const logs = [
    "> connecting to solana rpc…",
    "> pulling wallet transactions…",
    "> mapping token movements…",
    "> scoring behavioural patterns…",
  ];
  return (
    <div data-testid={testid} className="panel pixel-corner scanlines p-8 sm:p-12">
      <div className="flex flex-col items-center text-center">
        <div className="float-y">
          <GremAvatar size={72} watching />
        </div>
        <h3 className="mt-6 display text-xl font-bold uppercase tracking-wide text-white">
          <span className="neon">{label}</span>
          <span className="loading-dots" />
        </h3>
        <div className="mt-6 w-full max-w-sm scanbar" />
        <div className="mt-6 w-full max-w-md rounded-lg border border-white/8 bg-black/50 p-4 text-left font-mono text-[12px] leading-relaxed text-[#33ff85]/80">
          {logs.map((l, i) => (
            <div key={i} style={{ animation: `flicker ${1.2 + i * 0.3}s infinite` }}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
