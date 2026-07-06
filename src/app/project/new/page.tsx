import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { TopBar } from "@/components/TopBar";
import { CreateProjectForm } from "@/components/forms/CreateProjectForm";

export default async function NewProjectPage() {
  const user = await requireRole("STUDENT");

  return (
    <>
      <TopBar name={user.name} role={user.role} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <div className="card mt-4 p-6 sm:p-8">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-5 w-5" />
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Start a capstone project
          </h1>
          <p className="mb-8 mt-1.5 text-sm text-slate-500">
            Fill in your project details and link your adviser with their code.
          </p>
          <CreateProjectForm />
        </div>
      </main>
    </>
  );
}
