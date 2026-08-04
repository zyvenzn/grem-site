"use client";

import type { MouseEvent, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type MagneticButtonProps = {
  href: string;
  children: ReactNode;
  primary?: boolean;
  ariaLabel?: string;
};

export default function MagneticButton({ href, children, primary = false, ariaLabel }: MagneticButtonProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.45 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.45 });

  function handleMove(event: MouseEvent<HTMLAnchorElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.16);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.16);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      className={`premium-button${primary ? " primary" : ""}`}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={ariaLabel}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.975 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.a>
  );
}
