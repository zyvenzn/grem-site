"use client";

export default function Navbar() {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        backdropFilter: "blur(16px)",
        background: "rgba(5,5,5,0.75)",
        borderBottom: "1px solid rgba(168,85,247,0.12)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <div
          style={{
            color: "#ffffff",
            fontWeight: "900",
            fontSize: "24px",
            letterSpacing: "1px",
          }}
        >
          GREM
        </div>

        {/* Menu */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <a
            href="#about"
            style={{
              color: "#9ca3af",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            About
          </a>

          <a
            href="#gallery"
            style={{
              color: "#9ca3af",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            Gallery
          </a>

          <a
            href="https://x.com/GREMWTF"
            target="_blank"
            style={{
              color: "#ffffff",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            X
          </a>

          <a
            href="https://telegram.me/gremwtf"
            target="_blank"
            style={{
              background: "#a855f7",
              color: "#ffffff",
              textDecoration: "none",
              padding: "10px 16px",
              borderRadius: "10px",
              fontWeight: "700",
              fontSize: "14px",
            }}
          >
            Join
          </a>
        </div>
      </div>
    </nav>
  );
}