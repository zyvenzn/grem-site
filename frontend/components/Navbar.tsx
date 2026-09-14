"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, SOCIAL } from "@/lib/constants";
import { XIcon, TelegramIcon } from "./Icons";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header
      data-testid="navbar"
      className="fixed top-0 inset-x-0 z-50 transition-colors duration-300"
      style={{
        background: scrolled ? "rgba(7,6,9,0.82)" : "rgba(7,6,9,0.35)",
        backdropFilter: "blur(18px) saturate(140%)",
        borderBottom: `1px solid ${scrolled ? "rgba(0,255,102,0.14)" : "rgba(255,255,255,0.05)"}`,
      }}
    >
      <nav className="container-grem flex items-center justify-between h-[64px]">
        <Link href="/" data-testid="nav-logo" className="flex items-center gap-3 group">
          <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-[8px] border border-[#00ff66]/40 shadow-[0_0_18px_rgba(0,255,102,0.25)]">
            <img src="/grem.jpg" alt="GREM" className="h-full w-full object-cover" style={{ imageRendering: "pixelated" }} />
          </span>
          <span className="display text-[22px] font-bold tracking-tight text-white">
            GREM<span className="text-[#00ff66]">.</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                data-testid={`nav-link-${l.label.replace(/\$/g, "").toLowerCase()}`}
                className="relative px-4 py-2 text-[13.5px] font-semibold rounded-lg transition-colors"
                style={{ color: active ? "#00ff66" : "#aab0bd" }}
              >
                {l.label}
                {active && (
                  <span className="absolute left-4 right-4 -bottom-0.5 h-[2px] rounded bg-[#00ff66] shadow-[0_0_10px_#00ff66]" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <SocialBtn href={SOCIAL.x} label="X" testid="nav-x"><XIcon width={16} height={16} /></SocialBtn>
          <SocialBtn href={SOCIAL.telegram} label="Telegram" testid="nav-telegram"><TelegramIcon width={17} height={17} /></SocialBtn>
        </div>

        <button
          data-testid="nav-hamburger"
          className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div data-testid="mobile-menu" className="md:hidden container-grem pb-5 pt-1">
          <div className="panel pixel-corner p-3 flex flex-col">
            {NAV_LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  data-testid={`mobile-nav-${l.label.replace(/\$/g, "").toLowerCase()}`}
                  className="px-4 py-3.5 rounded-lg text-[15px] font-semibold transition-colors"
                  style={{ color: active ? "#00ff66" : "#d6dae2", background: active ? "rgba(0,255,102,0.06)" : "transparent" }}
                >
                  {l.label}
                </Link>
              );
            })}
            <div className="flex gap-2 px-2 pt-3 mt-2 border-t border-white/10">
              <a href={SOCIAL.x} target="_blank" rel="noreferrer" data-testid="mobile-x" className="btn btn-ghost flex-1"><XIcon width={16} height={16} /> X</a>
              <a href={SOCIAL.telegram} target="_blank" rel="noreferrer" data-testid="mobile-telegram" className="btn btn-ghost flex-1"><TelegramIcon width={17} height={17} /> Telegram</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function SocialBtn({ href, label, testid, children }: { href: string; label: string; testid: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      data-testid={testid}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition-colors hover:text-[#00ff66] hover:border-[#00ff66]/50 hover:bg-[#00ff66]/5"
    >
      {children}
    </a>
  );
}
