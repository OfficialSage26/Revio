"use client";

import { useActionState } from "react";
import { createProjectAction, type FormState } from "@/app/actions/project";
import { SubmitButton } from "@/components/SubmitButton";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

export function CreateProjectForm({ defaultCode }: { defaultCode?: string }) {
  const [state, formAction] = useActionState<FormState, FormData>(
    createProjectAction,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Project title
        </label>
        <input name="title" type="text" required className={inputClass} />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          required
          className={inputClass}
          placeholder="What is your capstone about?"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            GitHub repository{" "}
            <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <input
            name="githubUrl"
            type="url"
            className={inputClass}
            placeholder="https://github.com/…"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Live deployment{" "}
            <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <input
            name="liveUrl"
            type="url"
            className={inputClass}
            placeholder="https://…"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Adviser code
        </label>
        <input
          name="adviserCode"
          type="text"
          required
          defaultValue={defaultCode}
          className={`${inputClass} font-mono uppercase tracking-wider`}
          placeholder="ADV-XXXXXX"
        />
        <p className="mt-1 text-xs text-slate-500">
          Ask your adviser for their Revio code.
        </p>
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <SubmitButton className="w-full">Create project</SubmitButton>
    </form>
  );
}
