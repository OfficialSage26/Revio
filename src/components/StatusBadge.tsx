import { STATUS_LABELS, STATUS_STYLES, type DocumentStatus } from "@/lib/constants";

export function StatusBadge({ status }: { status: string }) {
  const s = status as DocumentStatus;
  const style = STATUS_STYLES[s] ?? "bg-slate-100 text-slate-700 border-slate-200";
  const label = STATUS_LABELS[s] ?? status;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${style}`}
    >
      {label}
    </span>
  );
}
