"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Origin() {
  return (
    <section
      style={{
        padding: "100px 20px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
          gap: "50px",
          alignItems: "center",
        }}
      >
        <div>
          <Image
            src="/loregrem.jpg"
            alt="Origin of GREM"
            width={700}
            height={700}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "20px",
              border: "1px solid rgba(168,85,247,0.15)",
            }}
          />
        </div>

        <div>
          <div
            style={{
              color: "#a855f7",
              letterSpacing: "2px",
              fontSize: "13px",
              textTransform: "uppercase",
              marginBottom: "15px",
            }}
          >
            The Origin
          </div>

          <h2
            style={{
              color: "#fff",
              fontSize: "clamp(40px,6vw,70px)",
              lineHeight: "1.1",
              marginBottom: "25px",
            }}
          >
            Why GREM Exists
          </h2>

          <p
            style={{
              color: "#9ca3af",
              fontSize: "18px",
              lineHeight: "2",
            }}
          >
            In the ruins of dead chains,
            abandoned communities,
            and forgotten promises,
            something remained.
            <br />
            <br />
            Not a founder.
            <br />
            Not a trader.
            <br />
            Not a genius.
            <br />
            <br />
            Just a confused creature.
            <br />
            Watching.
            <br />
            Surviving.
            <br />
            Waiting.
          </p>
        </div>
      </motion.div>
    </section>
  );
}