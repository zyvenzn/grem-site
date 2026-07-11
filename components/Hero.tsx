import Image from "next/image";

export default function Hero() {
  return (
    <section style={{ width: "100%", padding: "60px 20px 20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", boxSizing: "border-box", position: "relative", zIndex: 10 }}>
      
      {/* Banner System Status dengan Efek Neon Kedip */}
      <div style={{ background: "rgba(239, 68, 68, 0.05)", border: "1px solid #ef4444", color: "#ef4444", padding: "10px 16px", borderRadius: "4px", fontSize: "11px", fontFamily: "monospace", marginBottom: "25px", width: "100%", maxWidth: "360px", boxShadow: "0 0 15px rgba(239, 68, 68, 0.2)", letterSpacing: "1px" }}>
        [!] SYSTEM_STATUS: OVERLOAD_BY_GREM
      </div>

      {/* Maskot dengan Dual Glow Effect */}
      <div style={{ position: "relative", marginBottom: "20px" }}>
        <Image
          src="/grem-hero.jpg"
          alt="GREM"
          width={320}
          height={320}
          style={{
            boxShadow: "0 0 50px rgba(239, 68, 68, 0.25), 0 0 30px rgba(168, 85, 247, 0.3)",
            border: "2px solid #ef4444",
            borderRadius: "8px",
            display: "block"
          }}
          priority
        />
        <span style={{ position: "absolute", bottom: "-10px", right: "10px", background: "#ef4444", color: "black", padding: "3px 10px", borderRadius: "2px", fontSize: "10px", fontWeight: "bold", fontFamily: "monospace", boxShadow: "0 0 10px #ef4444" }}>
          CRITICAL_ERROR
        </span>
      </div>

      {/* Judul dengan Efek Bayangan RGB */}
      <h1 className="glitch-hover" style={{ color: "#ffffff", textShadow: "3px 3px 0px #ef4444, -2px -2px 0px #a855f7", margin: "10px 0 5px", fontSize: "4.5rem", fontWeight: "900", letterSpacing: "-1px", fontFamily: "monospace" }}>
        GREM_
      </h1>
      
      {/* Kode Terminal Kopi/Chart yang Menyala Merah */}
      <p style={{ color: "#ef4444", fontFamily: "monospace", margin: "0 0 20px", fontSize: "13px", textShadow: "0 0 8px rgba(239, 68, 68, 0.6)", letterSpacing: "1px", fontWeight: "bold" }}>
        
        &gt;&gt; FEEDS_ON_CHAOS.exe <span style={{ filter: "none", display: "inline-block", marginLeft: "5px" }}>☕📈</span>

      </p>
      
      {/* Deskripsi Core Log */}
      <p style={{ color: "#aaaaaa", fontSize: "13px", lineHeight: "1.6", maxWidth: "400px", margin: "0 0 25px", fontFamily: "monospace", padding: "0 10px" }}>
        <span style={{ color: "#a855f7" }}>[CORE_LOG]</span> Born from the deep dust of dead chains. Powered by pure instant coffee and 48 hours of sleepless chart-watching. <br />
        <span style={{ color: "#ef4444", textShadow: "0 0 5px rgba(239,68,68,0.3)" }}>WARNING: Volatility maximum.</span>
      </p>

      {/* Tombol Aksi Khas Terminal Cyberpunk */}
      <div style={{ display: "flex", gap: "12px", width: "100%", maxWidth: "360px", marginBottom: "10px" }}>
        <a href="https://x.com/GREMWTF" target="_blank" style={{ background: "#ef4444", border: "1px solid #ff4444", display: "inline-flex", alignItems: "center", justifyContent: "center", height: "46px", borderRadius: "2px", fontWeight: "bold", textDecoration: "none", color: "#000", flex: 1, fontSize: "11px", fontFamily: "monospace", boxShadow: "0 0 15px rgba(239, 68, 68, 0.4)", letterSpacing: "1px" }}>
          [ BYPASS_TO_X ]
        </a>
        <a href="https://t.me/gremwtf" target="_blank" style={{ background: "rgba(239, 68, 68, 0.02)", border: "1px solid #ef4444", display: "inline-flex", alignItems: "center", justifyContent: "center", height: "46px", borderRadius: "2px", fontWeight: "bold", textDecoration: "none", color: "#ef4444", flex: 1, fontSize: "11px", fontFamily: "monospace", backdropFilter: "blur(4px)", letterSpacing: "1px", boxShadow: "inset 0 0 10px rgba(239, 68, 68, 0.1)" }}>
          [ TELEGRAM_FEED ]
        </a>
      </div>

    </section>
  );
}

{/* Target Raydium Tracker Khas Pump.fun */}
<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", marginTop: "15px", fontFamily: "monospace", fontSize: "11px", color: "#a855f7" }}>
  <div style={{ color: "#ef4444", textShadow: "0 0 5px rgba(239,68,68,0.3)" }}>
    [ TARGET: GRADUATE_TO_RAYDIUM ]
  </div>
  <div style={{ color: "#aaaaaa" }}>
    [ BONDING_CURVE: READY_FOR_CHAOS ]
  </div>
</div>
