"use client";

import { useState } from "react";

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
      className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-white px-3 py-1.5 font-mono text-sm font-semibold tracking-wider text-indigo-700 transition hover:bg-indigo-50"
      title="Copy code"
    >
      {code}
      <span className="text-xs font-sans font-normal text-slate-400">
        {copied ? "Copied!" : "Copy"}
      </span>
    </button>
  );
}
