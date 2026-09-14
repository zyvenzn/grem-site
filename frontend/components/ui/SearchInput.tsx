"use client";

import { useState } from "react";
import { Search, ClipboardPaste, Loader2 } from "lucide-react";

export default function SearchInput({
  placeholder,
  buttonLabel,
  onSubmit,
  loading = false,
  defaultValue = "",
  testid = "search-input",
}: {
  placeholder: string;
  buttonLabel: string;
  onSubmit: (value: string) => void;
  loading?: boolean;
  defaultValue?: string;
  testid?: string;
}) {
  const [value, setValue] = useState(defaultValue);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (value.trim()) onSubmit(value.trim());
  };

  const paste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setValue(text.trim());
    } catch {}
  };

  return (
    <form onSubmit={submit} className="w-full">
      <div className="panel pixel-corner flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
        <div className="relative flex flex-1 items-center">
          <Search size={18} className="pointer-events-none absolute left-4 text-slate-500" />
          <input
            data-testid={testid}
            suppressHydrationWarning
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            spellCheck={false}
            autoComplete="off"
            className="h-[52px] w-full rounded-lg border border-white/10 bg-black/40 pl-11 pr-12 font-mono text-[14px] text-white outline-none transition-colors placeholder:text-slate-600 focus:border-[#00ff66]/60 focus:shadow-[0_0_0_3px_rgba(0,255,102,0.12)]"
          />
          <button
            type="button"
            onClick={paste}
            data-testid={`${testid}-paste`}
            aria-label="Paste from clipboard"
            className="absolute right-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:text-[#00ff66]"
          >
            <ClipboardPaste size={17} />
          </button>
        </div>
        <button type="submit" disabled={loading} data-testid={`${testid}-submit`} className="btn btn-primary sm:w-auto disabled:opacity-70">
          {loading ? <Loader2 size={17} className="animate-spin" /> : <Search size={17} />}
          {buttonLabel}
        </button>
      </div>
    </form>
  );
}
