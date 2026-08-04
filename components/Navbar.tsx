"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const previousY = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY;
      setScrolled(currentY > 24);
      setVisible(currentY < 80 || currentY < previousY.current);
      previousY.current = currentY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="navbar-wrap"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: visible ? 0 : -110, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav className="navbar" aria-label="Primary navigation" style={{ background: scrolled ? "rgba(8, 6, 11, .82)" : undefined }}>
        <div className="navbar-inner">
          <a className="brand" href="#top" aria-label="GREM home">
            <span className="brand-mark" aria-hidden="true" />
            GREM
          </a>

          <div className="nav-links">
            <a className="nav-link" href="#lore">Lore</a>
            <a className="nav-link" href="#incidents">Intel</a>
            <a className="nav-link" href="#gallery">Sightings</a>
            <a className="nav-link" href="https://x.com/GREMWTF" target="_blank" rel="noreferrer">X / Twitter</a>
          </div>

          <div className="nav-actions">
            <a className="nav-join" href="https://telegram.me/gremwtf" target="_blank" rel="noreferrer">
              <span>Enter chaos</span>
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </nav>
    </motion.div>
  );
}
