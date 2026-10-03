"use client";

import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

const MotionLink = motion.create(Link);

type Props = {
  href: string;
  title: string;
  body: string;
  accent: string;
  icon: ReactNode;
  testId: string;
};

export default function FeatureCard({ href, title, body, accent, icon, testId }: Props) {
  return (
    <MotionConfig reducedMotion="user">
      <MotionLink
        href={href}
        data-testid={testId}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
        className="panel pixel-corner group relative block overflow-hidden p-6 transition-colors duration-200 hover:border-[#00ff66]/40"
      >
        <span
          className="inline-flex h-12 w-12 items-center justify-center rounded-xl border"
          style={{ borderColor: `${accent}55`, background: `${accent}14`, color: accent }}
        >
          {icon}
        </span>
        <h3 className="mt-5 display text-lg font-bold uppercase text-white">{title}</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-slate-400">{body}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500 transition-colors group-hover:text-[#00ff66]">
          Open
          <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </MotionLink>
    </MotionConfig>
  );
}
