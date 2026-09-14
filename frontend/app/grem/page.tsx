import Link from "next/link";
import { SOCIAL } from "@/lib/constants";
import { XIcon, TelegramIcon } from "@/components/Icons";
import { Rocket, FileText, Puzzle, ScrollText, Clock } from "lucide-react";

const PLACEHOLDERS = [
  { icon: FileText, title: "Token Information", body: "Supply, tokenomics and distribution will appear here once officially announced.", tag: "Coming soon" },
  { icon: Puzzle, title: "Utility", body: "How $GREM powers the GREM intelligence ecosystem.", tag: "Coming soon" },
  { icon: Rocket, title: "Launch", body: "$GREM is intended to launch through Pump.fun. It has not launched yet.", tag: "Launching on Pump.fun" },
  { icon: ScrollText, title: "Contract", body: "The official contract address will be published here at launch. Beware of impersonators.", tag: "Coming soon" },
];

export default function GremTokenPage() {
  return (
    <div className="container-grem pt-[112px] sm:pt-[128px]">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-10 left-1/2 h-64 w-[min(700px,90vw)] -translate-x-1/2 rounded-full bg-[#00ff66]/10 blur-[100px]" />
        <div className="relative flex flex-col items-center text-center">
          <img src="/grem-logo.jpg" alt="$GREM" className="h-28 w-28 rounded-2xl border border-[#00ff66]/30 object-cover shadow-[0_0_40px_rgba(0,255,102,0.25)] float-y" style={{ imageRendering: "pixelated" }} />
          <h1 className="mt-8 display text-6xl font-bold uppercase tracking-tight text-white sm:text-7xl">
            <span className="neon">$GREM</span>
          </h1>
          <p className="mt-4 max-w-md text-[16px] text-slate-400">The token powering the GREM ecosystem.</p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#a66cff]/40 bg-[#9945ff]/10 px-4 py-2 font-mono text-[12px] uppercase tracking-[0.14em] text-[#c9a5ff]">
            <Clock size={13} /> Not yet launched
          </div>
        </div>
      </section>

      <section className="mt-14 grid gap-4 sm:grid-cols-2">
        {PLACEHOLDERS.map((p) => (
          <div key={p.title} data-testid={`grem-section-${p.title.replace(/\s/g, "-").toLowerCase()}`} className="panel pixel-corner p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#00ff66]/30 bg-[#00ff66]/8 text-[#00ff66]">
                <p.icon size={20} />
              </span>
              <span className={`chip ${p.tag === "Launching on Pump.fun" ? "!border-[#a66cff]/40 !text-[#c9a5ff]" : ""}`}>{p.tag}</span>
            </div>
            <h3 className="mt-5 display text-xl font-bold uppercase text-white">{p.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-slate-400">{p.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-4 panel pixel-corner p-8 text-center">
        <h3 className="display text-xl font-bold uppercase text-white">Community</h3>
        <p className="mt-2 text-[14px] text-slate-400">Follow the official channels. Details will be updated when officially announced.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={SOCIAL.x} target="_blank" rel="noreferrer" data-testid="grem-x" className="btn btn-ghost"><XIcon width={16} height={16} /> X / Twitter</a>
          <a href={SOCIAL.telegram} target="_blank" rel="noreferrer" data-testid="grem-telegram" className="btn btn-ghost"><TelegramIcon width={17} height={17} /> Telegram</a>
        </div>
      </section>

      <div className="mb-24 mt-6 text-center">
        <p className="font-mono text-[12px] leading-relaxed text-slate-600">
          ◆ No tokenomics, supply, price, market cap, liquidity or contract exists yet.
          Anything claiming to be $GREM before an official announcement is not real.
        </p>
        <Link href="/tracker" className="btn btn-primary mt-6">Try the Tracker</Link>
      </div>
    </div>
  );
}
