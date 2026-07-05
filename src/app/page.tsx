import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <span className="mb-4 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
          Capstone review, without the scheduling headache
        </span>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Supervise capstone projects{" "}
          <span className="text-indigo-600">asynchronously</span>.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-slate-600">
          Students post documents, code links, and progress. Advisers review and
          give feedback on their own time. No meetings required — just a clear,
          shared record of the whole capstone journey.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/register"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Create an account
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Sign in
          </Link>
        </div>

        <div className="mt-16 grid w-full max-w-3xl gap-4 text-left sm:grid-cols-3">
          {[
            {
              t: "1 · Adviser code",
              d: "Advisers sign up and get a unique code to share with their teams.",
            },
            {
              t: "2 · Start a project",
              d: "Students create a project and join their adviser with the code.",
            },
            {
              t: "3 · Review & track",
              d: "Upload docs, post progress, get feedback — all on one timeline.",
            },
          ].map((c) => (
            <div
              key={c.t}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <p className="font-semibold text-slate-900">{c.t}</p>
              <p className="mt-1 text-sm text-slate-600">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
