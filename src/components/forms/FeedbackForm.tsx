"use client";

import { useActionState, useEffect, useRef } from "react";
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
    <form ref={ref} action={formAction} className="mt-3 space-y-2">
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="targetType" value={targetType} />
      <input type="hidden" name="targetId" value={targetId} />
      <textarea
        name="body"
        rows={2}
        required
        placeholder="Leave feedback…"
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
      <div className="flex flex-wrap items-center gap-3">
        {targetType === "DOCUMENT" && (
          <select
            name="statusApplied"
            defaultValue=""
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-indigo-500"
          >
            <option value="">Keep current status</option>
            {DOCUMENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                Set: {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        )}
        <SubmitButton className="!px-3 !py-1.5">Submit feedback</SubmitButton>
        {state?.error && <span className="text-sm text-red-600">{state.error}</span>}
      </div>
    </form>
  );
}
