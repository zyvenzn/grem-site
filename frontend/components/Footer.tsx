import Link from "next/link";
import { NAV_LINKS, SOCIAL } from "@/lib/constants";
import { XIcon, TelegramIcon } from "./Icons";

export default function Footer() {
  return (
    <footer data-testid="footer" className="relative mt-24 border-t border-white/8 overflow-hidden">
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[400px] w-[min(900px,90vw)] -translate-x-1/2 rounded-full bg-[#00ff66]/10 blur-[120px]" />
      <div className="container-grem relative py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src="/grem.jpg" alt="GREM" className="h-11 w-11 rounded-[8px] border border-[#00ff66]/40 object-cover" style={{ imageRendering: "pixelated" }} />
              <span className="display text-3xl font-bold text-white">GREM<span className="text-[#00ff66]">.</span></span>
            </div>
            <p className="mt-4 font-mono text-sm text-[#00ff66]">The Wallet Goblin</p>
            <p className="mt-1 text-slate-400 text-[15px]">&ldquo;You trade. GREM watches.&rdquo;</p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-slate-500">
              GREM turns raw Solana on-chain activity into readable intelligence. Analytical signals only — not financial advice.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Navigation</h4>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} data-testid={`footer-link-${l.label.replace(/\$/g, "").toLowerCase()}`} className="text-[15px] text-slate-300 transition-colors hover:text-[#00ff66]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Community</h4>
            <div className="mt-4 flex flex-col gap-3">
              <a href={SOCIAL.x} target="_blank" rel="noreferrer" data-testid="footer-x" className="inline-flex items-center gap-3 text-[15px] text-slate-300 transition-colors hover:text-[#00ff66]">
                <XIcon width={16} height={16} /> X / Twitter
              </a>
              <a href={SOCIAL.telegram} target="_blank" rel="noreferrer" data-testid="footer-telegram" className="inline-flex items-center gap-3 text-[15px] text-slate-300 transition-colors hover:text-[#00ff66]">
                <TelegramIcon width={17} height={17} /> Telegram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 border-t border-white/8 pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-slate-500">© 2026 GREM</p>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-slate-600">Launching on Pump.fun · Not yet live</p>
        </div>
      </div>
    </footer>
  );
}
