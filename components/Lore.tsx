"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Lore() {
  return (
    <section
      id="about"
      style={{
        padding: "80px 20px",
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
          gap: "40px",
          alignItems: "center",
        }}
      >
        {/* IMAGE */}
        <div>
          <Image
            src="/grem.jpg"
            alt="GREM"
            width={700}
            height={700}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "20px",
              border: "1px solid rgba(168,85,247,0.2)",
            }}
          />
        </div>

        {/* CONTENT */}
        <div>
          <span
            style={{
              color: "#a855f7",
              fontSize: "13px",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            What Is GREM?
          </span>

          <h2
            style={{
              fontSize: "clamp(36px,5vw,56px)",
              marginTop: "10px",
              marginBottom: "25px",
              color: "#fff",
              lineHeight: "1.2",
            }}
          >
            Not a trader.
            <br />
            Not a genius.
            <br />
            Just GREM.
          </h2>

          <p
            style={{
              color: "#9ca3af",
              lineHeight: "1.9",
              fontSize: "18px",
            }}
          >
            GREM is a meme creature born from crypto chaos.
            <br />
            <br />
            It doesn't predict the market.
            <br />
            It doesn't give financial advice.
            <br />
            It barely understands what's happening.
            <br />
            <br />
            Yet somehow,
            it survives every cycle.
          </p>
        </div>
      </motion.div>

      {/* GREM IS / GREM IS NOT */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: "20px",
          marginTop: "60px",
        }}
      >
        {/* GREM IS */}
        <div
          style={{
            background: "rgba(10,10,10,0.8)",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: "20px",
            padding: "30px",
          }}
        >
          <h3
            style={{
              color: "#10b981",
              marginBottom: "20px",
            }}
          >
            GREM IS
          </h3>

          <ul
            style={{
              color: "#d1d5db",
              lineHeight: "2",
              paddingLeft: "20px",
            }}
          >
            <li>Meme Creature</li>
            <li>Chaos Survivor</li>
            <li>Internet Native</li>
            <li>Community Driven</li>
          </ul>
        </div>

        {/* GREM IS NOT */}
        <div
          style={{
            background: "rgba(10,10,10,0.8)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "20px",
            padding: "30px",
          }}
        >
          <h3
            style={{
              color: "#ef4444",
              marginBottom: "20px",
            }}
          >
            GREM IS NOT
          </h3>

          <ul
            style={{
              color: "#d1d5db",
              lineHeight: "2",
              paddingLeft: "20px",
            }}
          >
            <li>AI Project</li>
            <li>Trading Group</li>
            <li>Financial Advice</li>
            <li>Corporate Brand</li>
          </ul>
        </div>
      </div>
    </section>
  );
}