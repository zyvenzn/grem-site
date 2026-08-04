"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import MotionReveal from "./MotionReveal";

const moments = [
  ["/grem.jpg", "GREM appears", "Nobody knows where GREM came from. Nobody knows why it stayed."],
  ["/gremwtf.jpg", "Purple selected", "After staring at a wall for seven hours, GREM chose the only acceptable color."],
  ["/grem-hero.jpg", "Market watch", "Nobody asked GREM to watch the charts. It did it anyway."],
  ["/gremworld.jpg", "Outside world", "The creature left its cave and immediately discovered more chaos."],
  ["/loregrem.jpg", "Wall recruited", "The wall joined the operation. Its role remains classified."],
  ["/full-net.jpg", "Internet acquired", "Several discoveries were made. Most were ignored immediately."],
  ["/caffeine-overdose.jpg", "Coffee thirty-seven", "For one brief, dangerous moment, GREM understood crypto."],
  ["/rugpull-panic.jpg", "Rug event", "Sold the bottom. Regretted everything with professional efficiency."],
  ["/gmi-sunrise.jpg", "Green candle", "Hope returned. Temporarily."],
];

export default function Gallery() {
  return (
    <section id="gallery" className="gallery-section">
      <div className="container">
        <div className="gallery-intro">
          <MotionReveal>
            <p className="eyebrow">Documented sightings</p>
            <h2 className="display-title">Inside<br /><span className="muted-line">GREM world.</span></h2>
          </MotionReveal>
          <MotionReveal delay={.12}>
            <p className="body-copy">Fragments from the life of a creature with no utility, no strategy, and a suspicious talent for remaining online.</p>
          </MotionReveal>
        </div>

        <motion.div
          className="gallery-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: .06 }}
          transition={{ staggerChildren: .07 }}
        >
          {moments.map(([src, title, report], index) => (
            <motion.article
              className="gallery-card"
              key={title}
              variants={{ hidden: { opacity: 0, y: 35, scale: .985 }, visible: { opacity: 1, y: 0, scale: 1 } }}
              transition={{ duration: .75, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
            >
              <Image className="gallery-image" src={src} alt={title} fill sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 42vw" />
              <div className="gallery-overlay">
                <span className="gallery-index">FRAME_{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{report}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
