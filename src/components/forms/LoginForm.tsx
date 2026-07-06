"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { loginAction, type FormState } from "@/app/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";

export function LoginForm() {
  const [state, formAction] = useActionState<FormState, FormData>(
    loginAction,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="field-label">Email</label>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@school.edu"
          className="input"
        />
      </div>

      <div>
        <label className="field-label">Password</label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Your password"
          className="input"
        />
      </div>

      {state?.error && (
        <p className="flex items-center gap-2 rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </p>
      )}

      <SubmitButton className="w-full">Sign in</SubmitButton>

      <p className="text-center text-sm text-slate-500">
        No account yet?{" "}
        <Link
          href="/register"
          className="font-semibold text-indigo-600 hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
