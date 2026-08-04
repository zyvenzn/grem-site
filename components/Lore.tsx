"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import MotionReveal from "./MotionReveal";

export default function Lore() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [35, -35]);

  return (
    <section id="lore" className="story-section" ref={sectionRef}>
      <div className="container story-grid">
        <motion.div className="story-image-shell" style={{ y: imageY }}>
          <MotionReveal>
            <div className="story-image-wrap">
              <Image className="story-image" src="/loregrem.jpg" alt="GREM standing in the remains of crypto chaos" fill sizes="(max-width: 900px) 100vw, 55vw" />
              <span className="image-caption">Archive image / origin unknown</span>
            </div>
          </MotionReveal>
        </motion.div>

        <div className="story-copy">
          <span className="story-number" aria-hidden="true">01</span>
          <MotionReveal>
            <p className="eyebrow">The origin</p>
            <h2 className="display-title">Not born.<br /><span className="muted-line">Left behind.</span></h2>
          </MotionReveal>
          <MotionReveal delay={.12}>
            <p className="body-copy">
              When the chains went quiet and the communities disappeared, something remained in the glow of an abandoned monitor. Not a founder. Not a trader. Just GREM—watching, surviving, waiting for the next terrible idea.
            </p>
          </MotionReveal>
          <MotionReveal delay={.2}>
            <div className="lore-lines">
              <div className="lore-line"><span>Primary habitat</span><span>THE TIMELINE</span></div>
              <div className="lore-line"><span>Known fuel source</span><span>CHAOS + COFFEE</span></div>
              <div className="lore-line"><span>Current condition</span><span>SOMEHOW ALIVE</span></div>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
