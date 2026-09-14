export default function SectionHeading({
  eyebrow,
  title,
  desc,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <div className={center ? "flex justify-center" : ""}>
          <span className="eyebrow">{eyebrow}</span>
        </div>
      )}
      <h2 className="mt-4 display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">{title}</h2>
      {desc && <p className="mt-4 text-[15px] leading-relaxed text-slate-400">{desc}</p>}
    </div>
  );
}
