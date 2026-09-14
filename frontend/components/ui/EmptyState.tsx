import GremAvatar from "./GremAvatar";

export default function EmptyState({
  title = "Nothing suspicious here… yet.",
  hint,
  testid = "empty-state",
}: {
  title?: string;
  hint?: string;
  testid?: string;
}) {
  return (
    <div data-testid={testid} className="panel pixel-corner p-10 sm:p-14">
      <div className="flex flex-col items-center text-center">
        <div className="opacity-90 float-y">
          <GremAvatar size={64} />
        </div>
        <h3 className="mt-6 display text-lg font-bold text-white">{title}</h3>
        {hint && <p className="mt-2 max-w-sm text-[14px] text-slate-400">{hint}</p>}
      </div>
    </div>
  );
}
