"use client";

export default function Incident() {
  return (
    <section
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(145deg, rgba(15,15,25,0.8), rgba(5,5,5,0.95))",
          border: "1px solid rgba(168,85,247,0.15)",
          borderRadius: "20px",
          padding: "30px",
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "12px",
            color: "#ef4444",
            marginBottom: "20px",
            letterSpacing: "2px",
          }}
        >
          LATEST INCIDENT REPORT
        </div>

        <h2
          style={{
            color: "#ffffff",
            marginBottom: "20px",
          }}
        >
          NEW_SIGHTING.LOG
        </h2>

        <p
          style={{
            color: "#9ca3af",
            lineHeight: 1.9,
          }}
        >
          The creature has been spotted again.
          <br />
          <br />
          Location: Unknown.
          <br />
          Purpose: Unknown.
          <br />
          <br />
          Witnesses attempted communication.
          <br />
          The creature refused all questions.
        </p>

        <div
          style={{
            marginTop: "25px",
            color: "#a855f7",
            fontFamily: "monospace",
            fontSize: "13px",
          }}
        >
          STATUS: ACTIVE
        </div>
      </div>
    </section>
  );
}