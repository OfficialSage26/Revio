"use client";

import { useActionState, useEffect, useRef } from "react";
import { UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";
import { uploadDocumentAction, type FormState } from "@/app/actions/document";
import { SubmitButton } from "@/components/SubmitButton";
import { DOCUMENT_TYPES, DOCUMENT_TYPE_LABELS } from "@/lib/constants";

export function UploadDocumentForm({ projectId }: { projectId: string }) {
  const [state, formAction] = useActionState<FormState, FormData>(
    uploadDocumentAction,
    undefined,
  );
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={formAction} className="space-y-3">
      <input type="hidden" name="projectId" value={projectId} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select name="type" required defaultValue="" className="input sm:w-44">
          <option value="" disabled>
            Document type…
          </option>
          {DOCUMENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {DOCUMENT_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
        <input
          name="file"
          type="file"
          required
          className="flex-1 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 shadow-sm file:mr-3 file:border-0 file:border-r file:border-slate-200 file:bg-slate-50 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-100"
        />
        <SubmitButton>
          <UploadCloud className="h-4 w-4" />
          Upload
        </SubmitButton>
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
          Uploaded.
        </p>
      )}
    </form>
  );
}
