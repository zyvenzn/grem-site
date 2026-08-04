"use client";

import { motion } from "framer-motion";

const stats = [
  ["Coffee consumed", "37", "cups"],
  ["Rugs witnessed", "9,999", "+"],
  ["Sanity remaining", "2", "%"],
  ["Cycles survived", "∞", ""],
];

export default function ChaosCounter() {
  return (
    <section className="counter-section" aria-label="GREM survival statistics">
      <motion.div
        className="container counter-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: .45 }}
        transition={{ staggerChildren: .08 }}
      >
        {stats.map(([label, value, suffix]) => (
          <motion.div
            className="counter-item"
            key={label}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: .65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="counter-label">{label}</div>
            <div className="counter-value">{value}<span>{suffix}</span></div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
