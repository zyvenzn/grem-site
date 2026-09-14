import Link from "next/link";
import { Search, Coins, Brain, Activity, ArrowRight, Eye } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { MagnifierPixel } from "@/components/Icons";

const FEATURES = [
  { icon: Search, title: "Wallet Intelligence", body: "Understand what a wallet is actually doing.", href: "/tracker", accent: "#00ff66" },
  { icon: Coins, title: "Token Analysis", body: "Inspect liquidity, trading activity, holders and risk signals.", href: "/token", accent: "#9945ff" },
  { icon: Activity, title: "Behavior Patterns", body: "Turn raw blockchain activity into readable trading behavior.", href: "/intelligence", accent: "#14f195" },
  { icon: Brain, title: "GREM Intelligence", body: "Let GREM connect the dots.", href: "/intelligence", accent: "#a66cff" },
];

const TICKER = [
  "wallet 0x9f… flagged: heavy meme exposure",
  "new pump.fun token detected",
  "liquidity shift on low-cap asset",
  "concentrated holdings pattern",
  "high-frequency trader identified",
  "insider cluster forming",
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden pt-[112px] sm:pt-[128px]">
        <div className="container-grem">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
            <div className="reveal">
              <div className="flex items-center gap-3">
                <span className="live-dot" />
                <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-400">
                  The Wallet Goblin · Solana Intelligence
                </span>
              </div>

              <h1 className="mt-6 display text-[clamp(2.6rem,7vw,5.2rem)] font-bold uppercase leading-[0.92] tracking-tight text-white">
                The Wallet<br />Goblin is<br /><span className="neon">Watching.</span>
              </h1>

              <p className="mt-6 max-w-md text-[16px] leading-relaxed text-slate-400">
                Every wallet leaves a trace.<br />
                <span className="text-slate-200">GREM finds the patterns.</span>
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/tracker" data-testid="hero-analyze-wallet" className="btn btn-primary">
                  <MagnifierPixel width={16} height={16} /> Analyze Wallet
                </Link>
                <Link href="/tokens" data-testid="hero-explore-tokens" className="btn btn-ghost">
                  Explore Tokens <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className="relative reveal" style={{ animationDelay: "0.1s" }}>
              <div className="pointer-events-none absolute -inset-6 rounded-[28px] bg-[#00ff66]/10 blur-[70px]" />
              <div className="panel pixel-corner scanlines relative overflow-hidden rounded-2xl border-[#00ff66]/20">
                <img
                  src="/grem-hero.jpg"
                  alt="GREM in the underground control room, watching wallet activity"
                  className="w-full object-cover"
                  style={{ aspectRatio: "16 / 10" }}
                />
                <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(7,6,9,0.85))" }} />
                <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-md border border-white/10 bg-black/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-300 backdrop-blur">
                  <Eye size={12} className="text-[#00ff66]" /> live surveillance · sample feed
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 border-y border-white/8 bg-white/[0.015] py-3.5">
          <div className="ticker">
            <div className="ticker-track font-mono text-[12px] uppercase tracking-[0.1em] text-slate-500">
              {[...TICKER, ...TICKER].map((t, i) => (
                <span key={i} className="inline-flex items-center gap-2">
                  <span className="text-[#00ff66]">▸</span> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section container-grem">
        <SectionHeading eyebrow="Capabilities" title="What GREM Sees" desc="Four lenses GREM uses to turn on-chain noise into intelligence." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Link
              key={f.title}
              href={f.href}
              data-testid={`feature-card-${i}`}
              className="panel pixel-corner group relative overflow-hidden p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#00ff66]/40"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border" style={{ borderColor: `${f.accent}55`, background: `${f.accent}14`, color: f.accent }}>
                <f.icon size={22} />
              </span>
              <h3 className="mt-5 display text-lg font-bold uppercase text-white">{f.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-slate-400">{f.body}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500 transition-colors group-hover:text-[#00ff66]">
                Open <ArrowRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section relative overflow-hidden">
        <div className="container-grem">
          <div className="panel pixel-corner scanlines relative grid items-center gap-0 overflow-hidden rounded-2xl md:grid-cols-2">
            <div className="relative min-h-[320px]">
              <img src="/gremworld.jpg" alt="GREM inside the Green Room" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent, rgba(7,6,9,0.9))" }} />
            </div>
            <div className="relative p-8 sm:p-12">
              <span className="eyebrow">The Green Room</span>
              <div className="mt-6 space-y-4 font-mono text-[15px] leading-relaxed text-slate-300">
                <p>Every wallet leaves a trace.</p>
                <p>Every transaction tells a story.</p>
                <p>Some people trade.<br />Some people watch.</p>
                <p className="text-[#00ff66]">GREM does both.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section container-grem">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_1.2fr]">
          <div className="relative order-2 md:order-1">
            <div className="pointer-events-none absolute -inset-4 rounded-2xl bg-[#9945ff]/12 blur-[60px]" />
            <div className="panel pixel-corner relative overflow-hidden rounded-2xl">
              <img src="/loregrem.jpg" alt="GREM portrait" className="w-full object-cover" style={{ aspectRatio: "4/3" }} />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <span className="eyebrow">Who is GREM?</span>
            <h2 className="mt-4 display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
              GREM is the Wallet Goblin.
            </h2>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-slate-400">
              He watches wallets, follows token movements, searches for patterns and turns
              blockchain noise into intelligence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/intelligence" className="btn btn-ghost">Enter Intelligence <ArrowRight size={16} /></Link>
              <Link href="/grem" className="btn btn-sol">$GREM</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
