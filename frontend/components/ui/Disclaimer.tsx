export default function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <p
      data-testid="signals-disclaimer"
      className={`font-mono text-[11px] leading-relaxed text-slate-500 ${className}`}
    >
      <span className="text-[#f59e0b]">◆</span> These are analytical signals derived from on-chain
      activity — <span className="text-slate-300">not financial advice</span>. A low risk score
      never means a token or wallet is &ldquo;safe&rdquo;.
    </p>
  );
}
