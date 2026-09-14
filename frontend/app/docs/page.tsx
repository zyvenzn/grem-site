import Link from "next/link";
import GremAvatar from "@/components/ui/GremAvatar";
import { ArrowRight } from "lucide-react";

const TOPICS = ["Getting Started", "Wallet Analyzer", "Token Analyzer", "GREM Intelligence", "Risk Signals", "API Reference"];

export default function DocsPage() {
  return (
    <div className="container-grem pt-[112px] sm:pt-[128px]">
      <header className="max-w-2xl">
        <span className="eyebrow">Documentation</span>
        <h1 className="mt-4 display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">Docs</h1>
      </header>

      <div className="mb-24 mt-8 panel pixel-corner scanlines p-10 sm:p-16">
        <div className="flex flex-col items-center text-center">
          <div className="float-y"><GremAvatar size={80} watching /></div>
          <h2 className="mt-6 display text-2xl font-bold uppercase text-white">Docs Coming Soon</h2>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-slate-400">
            GREM is still writing up how it reads the chain. Full documentation for the Tracker,
            analyzers, intelligence engine and API will land here.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {TOPICS.map((t) => <span key={t} className="chip">{t}</span>)}
          </div>
          <Link href="/tracker" className="btn btn-primary mt-9">Explore the Tracker <ArrowRight size={16} /></Link>
        </div>
      </div>
    </div>
  );
}
