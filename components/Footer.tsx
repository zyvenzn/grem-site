export default function Footer() {
  return (
    <footer style={{ textAlign: "center", padding: "60px 20px", marginTop: "40px", borderTop: "1px solid #1f1f1f" }}>
      <h3 style={{ fontFamily: "monospace", color: "#ef4444", letterSpacing: "2px", fontSize: "14px", margin: "0 0 10px 0" }}>
        JOIN THE CHAOS
      </h3>
      <p style={{ fontFamily: "monospace", fontSize: "12px", color: "#aaaaaa", margin: "0 0 15px 0" }}>
        The creature is watching.
      </p>
      
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", fontFamily: "monospace", fontSize: "12px" }}>
        <a href="https://x.com/GREMWTF" target="_blank" style={{ color: "#ef4444", textDecoration: "none" }}>[ X ]</a>
        <a href="https://t.me/gremwtf" target="_blank" style={{ color: "#ef4444", textDecoration: "none" }}>[ Telegram ]</a>
      </div>
    </footer>
  );
}
