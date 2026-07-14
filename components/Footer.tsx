export default function Footer() {
  return (
    <footer
      style={{
        padding: "120px 20px 80px",
        textAlign: "center",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            color: "#a855f7",
            fontSize: "13px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "15px",
          }}
        >
          Enter GREM World
        </div>

        <h2
          style={{
            fontSize: "clamp(42px,7vw,90px)",
            color: "#fff",
            margin: 0,
            lineHeight: "1",
          }}
        >
          FEEDS
          <br />
          ON CHAOS
        </h2>

        <p
          style={{
            color: "#9ca3af",
            fontSize: "18px",
            lineHeight: "1.8",
            marginTop: "30px",
            maxWidth: "650px",
            marginInline: "auto",
          }}
        >
          Millions of opinions.
          <br />
          Thousands of charts.
          <br />
          One confused creature.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            flexWrap: "wrap",
            marginTop: "40px",
          }}
        >
          <a
            href="https://telegram.me/gremwtf"
            target="_blank"
            style={{
              background: "#a855f7",
              color: "#fff",
              padding: "14px 28px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "700",
            }}
          >
            Join Telegram
          </a>

          <a
            href="https://x.com/GREMWTF"
            target="_blank"
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
              padding: "14px 28px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "700",
            }}
          >
            Follow X
          </a>
        </div>

        <div
          style={{
            marginTop: "60px",
            color: "#6b7280",
            fontSize: "13px",
          }}
        >
          © GREM • The creature somehow remains.
        </div>
      </div>
    </footer>
  );
}