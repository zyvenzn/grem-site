export default function GremAvatar({ size = 44, watching = false }: { size?: number; watching?: boolean }) {
  return (
    <span
      className="relative inline-flex items-center justify-center overflow-hidden rounded-[10px] border border-[#00ff66]/40"
      style={{ width: size, height: size, boxShadow: "0 0 22px rgba(0,255,102,0.25)" }}
    >
      <img src="/grem.jpg" alt="GREM" className="h-full w-full object-cover" style={{ imageRendering: "pixelated" }} />
      {watching && (
        <span className="absolute inset-0 pointer-events-none scanlines" />
      )}
    </span>
  );
}
