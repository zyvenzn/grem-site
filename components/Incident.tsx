"use client";

export default function Incident() {
  const situations = [
    {
      title: "Bought The Top?",
      answer: "GREM did.",
    },
    {
      title: "Panic Sold?",
      answer: "GREM did.",
    },
    {
      title: "Held A Dead Coin Too Long?",
      answer: "GREM did.",
    },
    {
      title: "Still Here?",
      answer: "So is GREM.",
    },
  ];

  return (
    <section
      style={{
        padding: "100px 20px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "60px",
        }}
      >
        <div
          style={{
            color: "#a855f7",
            letterSpacing: "2px",
            textTransform: "uppercase",
            fontSize: "13px",
            marginBottom: "10px",
          }}
        >
          Every Degen Has Been GREM
        </div>

        <h2
          style={{
            color: "#fff",
            fontSize: "clamp(36px,5vw,60px)",
            margin: 0,
          }}
        >
          Sound Familiar?
        </h2>

        <p
          style={{
            color: "#9ca3af",
            marginTop: "20px",
            fontSize: "18px",
            maxWidth: "700px",
            marginInline: "auto",
            lineHeight: "1.8",
          }}
        >
          Most people discover GREM after surviving things
          they promised themselves they would never do.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        {situations.map((item) => (
          <div
            key={item.title}
            style={{
              background: "rgba(10,10,10,0.9)",
              border: "1px solid rgba(168,85,247,0.15)",
              borderRadius: "20px",
              padding: "30px",
              minHeight: "180px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <h3
              style={{
                color: "#fff",
                fontSize: "22px",
                margin: 0,
                lineHeight: "1.4",
              }}
            >
              {item.title}
            </h3>

            <div
              style={{
                color: "#a855f7",
                fontSize: "28px",
                fontWeight: "700",
                marginTop: "25px",
              }}
            >
              {item.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}