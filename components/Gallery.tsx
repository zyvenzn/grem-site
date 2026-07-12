import Image from "next/image";

export default function Gallery() {
  const logs = [
    {
      src: "/grem.jpg",
      title: "MANIFESTATION.LOG",
      status: "ENCRYPTED",
      report:
        "Nobody knows where the creature came from. Nobody knows why it appeared."
    },

    {
      src: "/gremwtf.jpg",
      title: "PURPLE_SELECTION.LOG",
      status: "CRITICAL",
      report:
        "GREM spent 7 hours staring at a wall before choosing the color purple."
    },

    {
      src: "/grem-hero.jpg",
      title: "VOID_WATCHING.LOG",
      status: "ENCRYPTED",
      report:
        "The creature has been watching for an unknown amount of time."
    },

    {
      src: "/gremworld.jpg",
      title: "NEW_SIGHTING.LOG",
      status: "OPERATIONAL",
      report:
        "The creature has been spotted again. No further information is available."
    },

    {
      src: "/loregrem.jpg",
      title: "WALL_RECRUITMENT.LOG",
      status: "OPERATIONAL",
      report:
        "The wall has officially joined the team. Its responsibilities remain unclear."
    },

    {
      src: "/full-net.jpg",
      title: "FLUFF_NET_CONSOLE.LOG",
      status: "ENCRYPTED",
      report:
        "Several anomalies were detected. Most were ignored immediately."
    },

    {
      src: "/caffeine-overdose.jpg",
      title: "CAFFEINE_OVERDOSE.LOG",
      status: "CRITICAL",
      report:
        "Subject consumed dangerous amounts of coffee and attempted market analysis."
    },

    {
      src: "/rugpull-panic.jpg",
      title: "RUGPULL_PANIC.LOG",
      status: "TERMINATED",
      report:
        "Subject sold the bottom and instantly regretted the decision."
    },

    {
      src: "/gmi-sunrise.jpg",
      title: "GMI_SUNRISE.LOG",
      status: "OPERATIONAL",
      report:
        "Against all expectations, optimism briefly returned."
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CRITICAL":
        return "#ef4444";
      case "TERMINATED":
        return "#f97316";
      case "OPERATIONAL":
        return "#10b981";
      default:
        return "#a855f7";
    }
  };

  return (
    <section
      style={{
        width: "100%",
        padding: "40px 20px 80px",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "40px",
          fontSize: "22px",
          fontFamily: "monospace",
          fontWeight: "bold",
          color: "#ef4444",
          letterSpacing: "2px",
        }}
      >
        // CHAOS_LOGS_DATABASE
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {logs.map((log) => (
          <div
            key={log.src}
            style={{
              background: "#0a0a0a",
              border: "1px solid rgba(168,85,247,0.15)",
              borderRadius: "12px",
              overflow: "hidden",
              position: "relative",
              transition: "all 0.3s ease",
            }}
          >
            <div
              style={{
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Image
                src={log.src}
                alt="GREM DATA"
                width={500}
                height={500}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  filter: "grayscale(10%)",
                }}
              />

              <span
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  background: getStatusColor(log.status),
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "10px",
                  fontFamily: "monospace",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                {log.status}
              </span>
            </div>

            <div
              style={{
                padding: "16px",
                borderTop: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <h4
                style={{
                  fontSize: "13px",
                  fontFamily: "monospace",
                  color: "#ffffff",
                  marginBottom: "10px",
                }}
              >
                {log.title}
              </h4>

              <p
                style={{
                  fontSize: "12px",
                  lineHeight: "1.7",
                  color: "#9ca3af",
                  margin: 0,
                }}
              >
                {log.report}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}