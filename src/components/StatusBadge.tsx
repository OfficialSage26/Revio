import { CheckCircle2, Clock3, AlertTriangle } from "lucide-react";
import { STATUS_LABELS, type DocumentStatus } from "@/lib/constants";

const CONFIG: Record<
  DocumentStatus,
  { cls: string; icon: typeof CheckCircle2 }
> = {
  APPROVED: {
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  PENDING_REVIEW: {
    cls: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock3,
  },
  REVISION_REQUIRED: {
    cls: "bg-rose-50 text-rose-700 border-rose-200",
    icon: AlertTriangle,
  },
};

export function StatusBadge({ status }: { status: string }) {
  const s = status as DocumentStatus;
  const cfg = CONFIG[s];
  if (!cfg) {
    return (
      <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
        {status}
      </span>
    );
  }
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cfg.cls}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {STATUS_LABELS[s]}
    </span>
  );
}
