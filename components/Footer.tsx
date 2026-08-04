import MagneticButton from "./MagneticButton";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-main">
        <p className="eyebrow">The signal remains</p>
        <h2 className="footer-title">Feeds<br /><span>on chaos.</span></h2>
        <p className="footer-copy">Millions of opinions. Thousands of charts. One confused creature. Join the transmission before GREM changes its mind.</p>
        <div className="footer-actions">
          <MagneticButton href="https://telegram.me/gremwtf" primary>
            Enter GREM world
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </MagneticButton>
          <MagneticButton href="https://x.com/GREMWTF">Follow @GREMWTF</MagneticButton>
        </div>

        <div className="footer-bottom">
          <span>© 2026 GREM / The creature remains</span>
          <div className="footer-socials">
            <a href="#top">Top</a>
            <a href="https://x.com/GREMWTF" target="_blank" rel="noreferrer">X</a>
            <a href="https://telegram.me/gremwtf" target="_blank" rel="noreferrer">Telegram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
