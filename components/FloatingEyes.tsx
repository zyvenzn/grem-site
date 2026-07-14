"use client";

import { useEffect, useState } from "react";

export default function FloatingEyes() {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);

      setTimeout(() => {
        setBlink(false);
      }, 180);
    }, Math.random() * 6000 + 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "24px",
        marginTop: "20px",
      }}
    >
      <Eye blink={blink} />
      <Eye blink={blink} />
    </div>
  );
}

function Eye({ blink }: { blink: boolean }) {
  return (
    <div
      style={{
        width: "48px",
        height: blink ? "6px" : "48px",
        borderRadius: "999px",
        border: "2px solid #a855f7",
        background: "#050505",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.15s ease",
        boxShadow: "0 0 20px rgba(168,85,247,0.5)",
        overflow: "hidden",
      }}
    >
      {!blink && (
        <div
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "999px",
            background: "#ef4444",
            boxShadow: "0 0 15px #ef4444",
          }}
        />
      )}
    </div>
  );
}