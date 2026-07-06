"use client";

import { useActionState } from "react";
import { FileText, GitBranch, Globe, KeyRound, AlertCircle } from "lucide-react";
import { createProjectAction, type FormState } from "@/app/actions/project";
import { SubmitButton } from "@/components/SubmitButton";

export function CreateProjectForm({ defaultCode }: { defaultCode?: string }) {
  const [state, formAction] = useActionState<FormState, FormData>(
    createProjectAction,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="field-label">Project title</label>
        <input
          name="title"
          type="text"
          required
          placeholder="e.g. Smart Attendance System"
          className="input"
        />
      </div>

      <div>
        <label className="field-label">Description</label>
        <textarea
          name="description"
          rows={3}
          required
          className="input"
          placeholder="What is your capstone about?"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label flex items-center gap-1.5">
            <GitBranch className="h-3.5 w-3.5 text-slate-400" /> GitHub repo
            <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <input
            name="githubUrl"
            type="url"
            className="input"
            placeholder="https://github.com/…"
          />
        </div>
        <div>
          <label className="field-label flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-slate-400" /> Live deployment
            <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <input
            name="liveUrl"
            type="url"
            className="input"
            placeholder="https://…"
          />
        </div>
      </div>

      <div>
        <label className="field-label flex items-center gap-1.5">
          <KeyRound className="h-3.5 w-3.5 text-slate-400" /> Adviser code
        </label>
        <input
          name="adviserCode"
          type="text"
          required
          defaultValue={defaultCode}
          className="input font-mono uppercase tracking-[0.2em]"
          placeholder="ADV-XXXXXX"
        />
        <p className="mt-1.5 text-xs text-slate-500">
          Ask your adviser for their Revio code.
        </p>
      </div>

      {state?.error && (
        <p className="flex items-center gap-2 rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </p>
      )}

      <SubmitButton className="w-full">
        <FileText className="h-4 w-4" />
        Create project
      </SubmitButton>
    </form>
  );
}
