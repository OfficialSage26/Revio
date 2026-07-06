"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be unavailable; ignore.
    }
  }

  return (
    <button
      onClick={copy}
      className="group inline-flex items-center gap-3 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 shadow-sm transition hover:border-indigo-300 hover:shadow"
      title="Copy code"
    >
      <span className="font-mono text-base font-bold tracking-[0.2em] text-indigo-700">
        {code}
      </span>
      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 group-hover:text-indigo-500">
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" /> Copied
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" /> Copy
          </>
        )}
      </span>
    </button>
  );
}
