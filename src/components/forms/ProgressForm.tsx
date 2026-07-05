"use client";

import { useActionState, useEffect, useRef } from "react";
import { postProgressAction, type FormState } from "@/app/actions/progress";
import { SubmitButton } from "@/components/SubmitButton";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

const fields = [
  { name: "completedFeatures", label: "Completed features", required: true },
  { name: "milestones", label: "Milestones achieved", required: false },
  { name: "challenges", label: "Challenges encountered", required: false },
  { name: "upcomingTasks", label: "Upcoming tasks", required: false },
] as const;

export function ProgressForm({ projectId }: { projectId: string }) {
  const [state, formAction] = useActionState<FormState, FormData>(
    postProgressAction,
    undefined,
  );
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={formAction} className="space-y-3">
      <input type="hidden" name="projectId" value={projectId} />
      {fields.map((f) => (
        <div key={f.name}>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            {f.label}
            {!f.required && (
              <span className="font-normal text-slate-400"> (optional)</span>
            )}
          </label>
          <textarea
            name={f.name}
            rows={2}
            required={f.required}
            className={inputClass}
          />
        </div>
      ))}
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.ok && <p className="text-sm text-green-600">Progress posted.</p>}
      <SubmitButton>Post update</SubmitButton>
    </form>
  );
}
