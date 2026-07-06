"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { GraduationCap, UserCog, AlertCircle } from "lucide-react";
import { registerAction, type FormState } from "@/app/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";

export function RegisterForm() {
  const [state, formAction] = useActionState<FormState, FormData>(
    registerAction,
    undefined,
  );
  const [role, setRole] = useState<"STUDENT" | "ADVISER">("STUDENT");

  const roles = [
    {
      value: "STUDENT" as const,
      label: "Student",
      desc: "Submit & track work",
      icon: GraduationCap,
    },
    {
      value: "ADVISER" as const,
      label: "Adviser",
      desc: "Review & give feedback",
      icon: UserCog,
    },
  ];

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="field-label">I am a…</label>
        <div className="grid grid-cols-2 gap-3">
          {roles.map((r) => {
            const active = role === r.value;
            const Icon = r.icon;
            return (
              <label
                key={r.value}
                className={`cursor-pointer rounded-xl border p-4 text-center transition ${
                  active
                    ? "border-indigo-500 bg-indigo-50 ring-4 ring-indigo-500/10"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={r.value}
                  checked={active}
                  onChange={() => setRole(r.value)}
                  className="sr-only"
                />
                <Icon
                  className={`mx-auto h-6 w-6 ${active ? "text-indigo-600" : "text-slate-400"}`}
                />
                <span
                  className={`mt-2 block text-sm font-semibold ${active ? "text-indigo-700" : "text-slate-700"}`}
                >
                  {r.label}
                </span>
                <span className="mt-0.5 block text-xs text-slate-400">
                  {r.desc}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <label className="field-label">Full name</label>
        <input
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Juan Dela Cruz"
          className="input"
        />
      </div>

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
          minLength={8}
          autoComplete="new-password"
          placeholder="At least 8 characters"
          className="input"
        />
      </div>

      {state?.error && (
        <p className="flex items-center gap-2 rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </p>
      )}

      <SubmitButton className="w-full">Create account</SubmitButton>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-indigo-600 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
