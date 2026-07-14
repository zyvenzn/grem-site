import Image from "next/image";

export default function Gallery() {
  const moments = [
    {
      src: "/grem.jpg",
      title: "GREM Appears",
      report:
        "Nobody knows where GREM came from. Nobody knows why it stayed.",
    },
    {
      src: "/gremwtf.jpg",
      title: "GREM Chooses Purple",
      report:
        "After staring at a wall for seven hours, GREM decided purple was the correct answer.",
    },
    {
      src: "/grem-hero.jpg",
      title: "GREM Watches The Market",
      report:
        "Nobody asked GREM to watch the charts. It did it anyway.",
    },
    {
      src: "/gremworld.jpg",
      title: "GREM Joins The World",
      report:
        "The creature left its cave and immediately found more chaos.",
    },
    {
      src: "/loregrem.jpg",
      title: "GREM Recruits A Wall",
      report:
        "The wall officially joined the operation. Nobody knows what it does.",
    },
    {
      src: "/full-net.jpg",
      title: "GREM Uses The Internet",
      report:
        "Several discoveries were made. Most were ignored immediately.",
    },
    {
      src: "/caffeine-overdose.jpg",
      title: "GREM After 37 Coffees",
      report:
        "For a brief moment, GREM thought it understood crypto.",
    },
    {
      src: "/rugpull-panic.jpg",
      title: "GREM During A Rug Pull",
      report:
        "Sold the bottom. Regretted everything instantly.",
    },
    {
      src: "/gmi-sunrise.jpg",
      title: "GREM Sees A Green Candle",
      report:
        "Hope returned. Temporarily.",
    },
  ];

  return (
    <section
      id="gallery"
      style={{
        padding: "80px 20px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "50px",
        }}
      >
        <div
          style={{
            color: "#a855f7",
            fontSize: "13px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "10px",
          }}
        >
          Life Inside GREM World
        </div>

        <h2
          style={{
            color: "#ffffff",
            fontSize: "clamp(36px,5vw,60px)",
            margin: 0,
          }}
        >
          Chaos Moments
        </h2>

        <p
          style={{
            color: "#9ca3af",
            marginTop: "20px",
            lineHeight: "1.8",
            maxWidth: "700px",
            marginInline: "auto",
          }}
        >
          A collection of documented moments from the life of a creature
          that somehow survives every cycle.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: "24px",
        }}
      >
        {moments.map((item) => (
          <div
            key={item.title}
            style={{
              background: "rgba(10,10,10,0.85)",
              border: "1px solid rgba(168,85,247,0.15)",
              borderRadius: "20px",
              overflow: "hidden",
              transition: "0.3s ease",
            }}
          >
            <Image
              src={item.src}
              alt={item.title}
              width={600}
              height={600}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />

            <div
              style={{
                padding: "20px",
              }}
            >
              <h3
                style={{
                  color: "#ffffff",
                  marginBottom: "12px",
                  fontSize: "20px",
                }}
              >
                {item.title}
              </h3>

              <p
                style={{
                  color: "#9ca3af",
                  lineHeight: "1.7",
                  margin: 0,
                }}
              >
                {item.report}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}