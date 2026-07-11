import Image from "next/image";

export default function Gallery() {
  const logs = [
    { src: "/grem.jpg", title: "MANIFESTATION.LOG", status: "ENCRYPTED" },
    { src: "/gremwtf.jpg", title: "NO_SLEEP_48H.LOG", status: "CORRUPTED" },
    { src: "/grem-hero.jpg", title: "PURE_CHAOS.LOG", status: "ENCRYPTED" },
    { src: "/gremworld.jpg", title: "VOID_WATCHING.LOG", status: "ENCRYPTED" },
    { src: "/loregrem.jpg", title: "DEAD_CHAINS_DUST.LOG", status: "CORRUPTED" },
    { src: "/full-net.jpg", title:
"FLUFF-NET CONSOLE.LOG", status: "ENCRYPTED" },
  ];


  return (
    <section style={{ width: "100%", padding: "40px 20px 80px", boxSizing: "border-box" }}>
      <h2 style={{ textAlign: "center", marginBottom: "40px", fontSize: "22px", fontFamily: "monospace", fontWeight: "bold", color: "#ef4444", letterSpacing: "2px" }}>
        // CHAOS_LOGS_DATABASE
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", maxWidth: "1000px", margin: "0 auto" }}>
        {logs.map((log) => (
          <div key={log.src} style={{ background: "#0a0a0a", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "8px", overflow: "hidden", position: "relative" }}>
            <div style={{ overflow: "hidden", position: "relative" }}>
              <Image src={log.src} alt="GREM DATA" width={500} height={500} style={{ width: "100%", height: "auto", display: "block", filter: "grayscale(20%)" }} />
              <span style={{ position: "absolute", top: "12px", left: "12px", background: log.status === "CORRUPTED" ? "#ef4444" : "#a855f7", padding: "3px 8px", borderRadius: "4px", fontSize: "9px", fontFamily: "monospace", color: log.status === "CORRUPTED" ? "#fff" : "#000", fontWeight: "bold" }}>
                {log.status}
              </span>
            </div>
            <div style={{ padding: "14px", borderTop: "1px solid rgba(239, 68, 68, 0.2)" }}>
              <h4 style={{ fontSize: "13px", fontFamily: "monospace", color: "#ffffff", margin: 0 }}>{log.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
