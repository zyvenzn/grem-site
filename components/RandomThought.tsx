"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const thoughts = [
  "Everyone has a plan. GREM has coffee.",
  "Market recovered. GREM remains deeply suspicious.",
  "Hope is not a strategy. Neither is whatever this is.",
  "GREM checked the chart. Mistake.",
  "Bull market. Bear market. GREM market.",
  "Confidence level: completely unjustified.",
];

export default function RandomThought() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % thoughts.length);
    }, 6500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="thought-strip" aria-label="GREM transmission">
      <div className="container thought-inner">
        <span className="thought-label">Incoming transmission</span>
        <AnimatePresence mode="wait">
          <motion.p
            className="thought-text"
            key={index}
            initial={{ opacity: 0, y: 8, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: .55 }}
          >
            “{thoughts[index]}”
          </motion.p>
        </AnimatePresence>
        <span className="thought-code">CH-09 / LIVE</span>
      </div>
    </section>
  );
}
