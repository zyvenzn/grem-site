"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Lore() {
  return (
    <section className="lore">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{
          background: "linear-gradient(145deg, rgba(15,15,25,0.6) 0%, rgba(5,5,5,0.8) 100%)",
          border: "1px solid rgba(168, 85, 247, 0.15)",
          borderRadius: "32px",
          overflow: "hidden",
          backdropFilter: "blur(16px)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          maxWidth: "800px",
          margin: "0 auto"
        }}
      >
        <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
          <Image
            src="/grem.jpg"
            alt="GREM"
            width={1000}
            height={500}
            className="lore-image"
            style={{ width: "100%", height: "auto", display: "block", opacity: 0.85, margin: "0 auto", borderRadius: "0" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, #050505 100%)" }} />
        </div>

        <div style={{ padding: "40px 30px", textAlign: "center" }}>
          <h2 style={{ marginBottom: "24px", color: "#f3f4f6" }}>
            WHAT IS GREM?
          </h2>

          <p style={{ opacity: 0.8, lineHeight: 2, color: "#d1d5db" }}>
            GREM doesn't trade. GREM doesn't build. GREM doesn't explain itself. <br />
            <span style={{ color: "#ef4444", fontWeight: "bold" }}>GREM simply appears wherever chaos exists.</span> <br />
            It lives on your market anxieties, refueling itself with every red candle on the chart.
          </p>

          {/* Info Box */}
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "40px", flexWrap: "wrap" }}>
            <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.05)", padding: "14px 28px", borderRadius: "16px", minWidth: "140px" }}>
              <p style={{ fontSize: "11px", textTransform: "uppercase", color: "#a855f7", margin: 0 }}>Tax Mechanism</p>
              <h3 style={{ fontSize: "20px", margin: "4px 0 0", color: "#10b981" }}>0% Tax</h3>
            </div>
            <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.05)", padding: "14px 28px", borderRadius: "16px", minWidth: "140px" }}>
              <p style={{ fontSize: "11px", textTransform: "uppercase", color: "#a855f7", margin: 0 }}>Launchpad</p>
              <h3 style={{ fontSize: "20px", margin: "4px 0 0", color: "#f59e0b" }}>Pump.fun</h3>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
