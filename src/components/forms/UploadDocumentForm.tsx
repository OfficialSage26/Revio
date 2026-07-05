"use client";

import { useActionState, useEffect, useRef } from "react";
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
      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          name="type"
          required
          defaultValue=""
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
        >
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
          className="flex-1 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
        />
        <SubmitButton>Upload</SubmitButton>
      </div>
      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
      {state?.ok && (
        <p className="text-sm text-green-600">Uploaded.</p>
      )}
    </form>
  );
}
