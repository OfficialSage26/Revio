"use client";

import { useActionState, useEffect, useRef } from "react";
import { MessageSquarePlus, AlertCircle } from "lucide-react";
import { giveFeedbackAction, type FormState } from "@/app/actions/feedback";
import { SubmitButton } from "@/components/SubmitButton";
import { DOCUMENT_STATUSES, STATUS_LABELS } from "@/lib/constants";

export function FeedbackForm({
  projectId,
  targetType,
  targetId,
}: {
  projectId: string;
  targetType: "DOCUMENT" | "PROGRESS";
  targetId: string;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(
    giveFeedbackAction,
    undefined,
  );
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form
      ref={ref}
      action={formAction}
      className="mt-4 space-y-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3"
    >
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="targetType" value={targetType} />
      <input type="hidden" name="targetId" value={targetId} />
      <textarea
        name="body"
        rows={2}
        required
        placeholder="Leave feedback…"
        className="input bg-white"
      />
      <div className="flex flex-wrap items-center gap-3">
        {targetType === "DOCUMENT" && (
          <select
            name="statusApplied"
            defaultValue=""
            className="input h-10 w-auto py-0"
          >
            <option value="">Keep current status</option>
            {DOCUMENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                Set: {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        )}
        <SubmitButton className="!px-3.5 !py-2">
          <MessageSquarePlus className="h-4 w-4" />
          Submit feedback
        </SubmitButton>
        {state?.error && (
          <span className="flex items-center gap-1.5 text-sm text-rose-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {state.error}
          </span>
        )}
      </div>
    </form>
  );
}
