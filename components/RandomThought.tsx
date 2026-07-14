"use client";

import { useEffect, useState } from "react";

export default function RandomThought() {
  const thoughts = [
    "Everyone has a plan. GREM has coffee.",
    "Market recovered. GREM still confused.",
    "Hope is not a strategy. Neither is whatever GREM is doing.",
    "GREM checked the chart. Mistake.",
    "Bull market. Bear market. GREM market.",
    "Nobody knows the plan. Including GREM.",
    "Fear is temporary. Screenshots are forever.",
    "GREM bought the top. Again.",
    "Some creatures hunt. GREM refreshes Dexscreener.",
    "The market moved. GREM panicked professionally.",
    "One more candle. Surely.",
    "Confidence level: completely unjustified.",
  ];

  const [thought, setThought] = useState("");

useEffect(() => {
  setThought(
    thoughts[Math.floor(Math.random() * thoughts.length)]
  );
}, []);

  return (
    <section
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "40px 20px 80px",
      }}
    >
      <div
        style={{
          background: "rgba(10,10,10,0.8)",
          border: "1px solid rgba(168,85,247,0.15)",
          borderRadius: "20px",
          padding: "30px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: "#a855f7",
            fontSize: "12px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "15px",
          }}
        >
          Today's Thought
        </div>

        <p
          style={{
            color: "#ffffff",
            fontSize: "24px",
            lineHeight: "1.6",
            margin: 0,
          }}
        >
          "{thought}"
        </p>
      </div>
    </section>
  );
}