"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

type MotionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export default function MotionReveal({ children, className, delay = 0, y = 34 }: MotionRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
