"use client";

import type { MouseEvent } from "react";
import { motion } from "framer-motion";
import MotionReveal from "./MotionReveal";

const incidents = [
  {
    code: "INCIDENT_0042",
    question: "What happens when the market drops thirty percent overnight?",
    answer: "GREM makes coffee.",
    icon: "01",
  },
  {
    code: "INCIDENT_0088",
    question: "What happens when everyone promises this time is different?",
    answer: "GREM blinks twice.",
    icon: "02",
  },
  {
    code: "INCIDENT_0101",
    question: "What happens when the timeline reaches maximum confidence at the exact top?",
    answer: "GREM feeds on the chaos.",
    icon: "03",
  },
];

export default function Incident() {
  function handlePointer(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--card-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--card-y", `${event.clientY - rect.top}px`);
  }

  return (
    <section id="incidents" className="incidents">
      <div className="container">
        <div className="section-header">
          <MotionReveal>
            <p className="eyebrow">Observed behavior</p>
            <h2 className="display-title">Chaos<br /><span className="muted-line">protocol.</span></h2>
          </MotionReveal>
          <MotionReveal delay={.12}>
            <p className="body-copy">No roadmap. No master plan. Just a strangely reliable response to increasingly unreliable market conditions.</p>
          </MotionReveal>
        </div>

        <motion.div
          className="incident-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: .12 }}
          transition={{ staggerChildren: .12 }}
        >
          {incidents.map((incident) => (
            <motion.article
              className="incident-card"
              key={incident.code}
              variants={{ hidden: { opacity: 0, y: 35, filter: "blur(8px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)" } }}
              transition={{ duration: .8, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              onMouseMove={handlePointer}
            >
              <div className="incident-meta">
                <span>{incident.code}</span>
                <span className="incident-icon">{incident.icon}</span>
              </div>
              <div>
                <p className="incident-question">{incident.question}</p>
                <h3 className="incident-answer">{incident.answer}</h3>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
