"use client";

import type { MouseEvent } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import MagneticButton from "./MagneticButton";

const particles = [
  [12, 24, 7, -1], [20, 72, 9, -4], [34, 16, 8, -2], [47, 83, 11, -6],
  [60, 19, 9, -3], [72, 73, 12, -8], [82, 31, 8, -5], [91, 60, 10, -7],
] as const;

const reveal = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export default function Hero() {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 65, damping: 20 });
  const smoothY = useSpring(pointerY, { stiffness: 65, damping: 20 });
  const visualX = useTransform(smoothX, [-0.5, 0.5], [-14, 14]);
  const visualY = useTransform(smoothY, [-0.5, 0.5], [-10, 10]);

  function handlePointer(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    pointerX.set(x - 0.5);
    pointerY.set(y - 0.5);
    event.currentTarget.style.setProperty("--mouse-x", `${x * 100}%`);
    event.currentTarget.style.setProperty("--mouse-y", `${y * 100}%`);
  }

  return (
    <section id="top" className="hero" onMouseMove={handlePointer}>
      <div className="hero-aurora" aria-hidden="true" />
      <div className="hero-spotlight" aria-hidden="true" />
      {particles.map(([left, top, duration, delay]) => (
        <span
          className="particle"
          key={`${left}-${top}`}
          style={{ left: `${left}%`, top: `${top}%`, "--duration": `${duration}s`, "--delay": `${delay}s` } as React.CSSProperties}
          aria-hidden="true"
        />
      ))}

      <motion.div
        className="container hero-grid"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1, delayChildren: 0.12 }}
      >
        <div className="hero-copy">
          <motion.div className="hero-kicker" variants={reveal} transition={{ duration: .75, ease: [0.22, 1, 0.36, 1] }}>
            <span className="live-dot" />
            Signal acquired / $GREM
          </motion.div>
          <motion.h1 className="hero-title" variants={reveal} transition={{ duration: .9, ease: [0.22, 1, 0.36, 1] }}>GREM</motion.h1>
          <motion.h2 className="hero-tagline" variants={reveal} transition={{ duration: .9, ease: [0.22, 1, 0.36, 1] }}>
            Feeds <span>on chaos.</span>
          </motion.h2>
          <motion.p className="hero-description" variants={reveal} transition={{ duration: .8, ease: [0.22, 1, 0.36, 1] }}>
            Born from FOMO. Raised by rug pulls. A confused creature built to outlive every chart, cycle, and terrible decision.
          </motion.p>
          <motion.div className="hero-actions" variants={reveal} transition={{ duration: .8, ease: [0.22, 1, 0.36, 1] }}>
            <MagneticButton href="https://telegram.me/gremwtf" primary>
              Enter GREM world
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </MagneticButton>
            <MagneticButton href="https://x.com/GREMWTF">
              Follow the signal
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div className="hero-visual" style={{ x: visualX, y: visualY }}>
          <motion.div className="creature-orbit" initial={{ opacity: 0, scale: .84 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, delay: .25, ease: [0.22, 1, 0.36, 1] }} />
          <div className="creature-glow" aria-hidden="true" />
          <motion.div className="creature-frame" initial={{ opacity: 0, scale: .88, filter: "blur(18px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} transition={{ duration: 1.2, delay: .32, ease: [0.22, 1, 0.36, 1] }}>
            <div className="creature-image-wrap">
              <Image className="creature-image" src="/grem-hero.jpg" alt="GREM creature watching the crypto market" fill priority sizes="(max-width: 900px) 78vw, 42vw" />
              <div className="creature-shade" />
            </div>
            <div className="creature-label"><span className="live-dot" /> specimen online</div>
          </motion.div>
          <span className="hero-index">SPECIMEN_001 / CHAOS_NATIVE</span>
        </motion.div>
      </motion.div>

      <div className="scroll-cue" aria-hidden="true"><span>Descend</span><span className="scroll-line" /></div>
    </section>
  );
}
