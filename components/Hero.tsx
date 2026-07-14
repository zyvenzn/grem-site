import Image from "next/image";


export default function Hero() {
  return (
    <section
      style={{
        minHeight: "100vh",
        width: "100%",
        padding: "60px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
          gap: "40px",
          alignItems: "center",
        }}
      >
        {/* LEFT SIDE */}
        <div>
          <div
            style={{
              display: "inline-block",
              padding: "8px 14px",
              border: "1px solid rgba(168,85,247,0.3)",
              borderRadius: "999px",
              color: "#a855f7",
              fontSize: "12px",
              marginBottom: "20px",
              fontFamily: "monospace",
            }}
          >
            FEEDS ON CHAOS
          </div>

          <h1
            style={{
              fontSize: "clamp(64px,10vw,120px)",
              fontWeight: "900",
              lineHeight: "0.9",
              margin: 0,
              color: "#ffffff",
            }}
          >
            GREM
          </h1>

          <h2
            style={{
              color: "#d1d5db",
              fontWeight: "500",
              marginTop: "20px",
              fontSize: "clamp(20px,3vw,32px)",
              lineHeight: "1.4",
            }}
          >
            The confused creature that somehow survives every crypto cycle.
          </h2>

          <p
            style={{
              color: "#9ca3af",
              marginTop: "25px",
              fontSize: "18px",
              lineHeight: "1.8",
              maxWidth: "600px",
            }}
          >
            Born from FOMO.
            <br />
            Raised by rug pulls.
            <br />
            Still somehow alive.
          </p>

          <div
            style={{
              display: "flex",
              gap: "15px",
              flexWrap: "wrap",
              marginTop: "35px",
            }}
          >
            <a
              href="https://telegram.me/gremwtf"
              target="_blank"
              style={{
                background: "#a855f7",
                color: "#fff",
                textDecoration: "none",
                padding: "14px 26px",
                borderRadius: "10px",
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
                color: "#ffffff",
                textDecoration: "none",
                padding: "14px 26px",
                borderRadius: "10px",
                fontWeight: "700",
              }}
            >
              Follow X
            </a>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "-30px",
                background:
                  "radial-gradient(circle, rgba(168,85,247,0.35), transparent 70%)",
                filter: "blur(40px)",
              }}
            />

            <Image
              src="/grem-hero.jpg"
              alt="GREM"
              width={600}
              height={600}
              priority
              style={{
                width: "100%",
                maxWidth: "520px",
                height: "auto",
                borderRadius: "20px",
                border: "1px solid rgba(168,85,247,0.25)",
                position: "relative",
                zIndex: 2,
              }}
            />
          
          </div>
        </div>
      </div>
    </section>
  );
}