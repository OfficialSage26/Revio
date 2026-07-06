"use client";

import { useActionState, useEffect, useRef } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { postProgressAction, type FormState } from "@/app/actions/progress";
import { SubmitButton } from "@/components/SubmitButton";

const fields = [
  {
    name: "completedFeatures",
    label: "Completed features",
    required: true,
    placeholder: "What did you finish since the last update?",
  },
  {
    name: "milestones",
    label: "Milestones achieved",
    required: false,
    placeholder: "Any major goals reached?",
  },
  {
    name: "challenges",
    label: "Challenges encountered",
    required: false,
    placeholder: "What's blocking or slowing you down?",
  },
  {
    name: "upcomingTasks",
    label: "Upcoming tasks",
    required: false,
    placeholder: "What's next?",
  },
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
    <form ref={ref} action={formAction} className="space-y-4">
      <input type="hidden" name="projectId" value={projectId} />
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name}>
            <label className="field-label">
              {f.label}
              {!f.required && (
                <span className="font-normal text-slate-400"> (optional)</span>
              )}
            </label>
            <textarea
              name={f.name}
              rows={2}
              required={f.required}
              placeholder={f.placeholder}
              className="input"
            />
          </div>
        ))}
      </div>
      {state?.error && (
        <p className="flex items-center gap-1.5 text-sm text-rose-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p className="flex items-center gap-1.5 text-sm text-emerald-600">
          <CheckCircle2 className="h-4 w-4" />
          Progress posted.
        </p>
      )}
      <SubmitButton>
        <Send className="h-4 w-4" />
        Post update
      </SubmitButton>
    </form>
  );
}
