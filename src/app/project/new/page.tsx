import Link from "next/link";
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
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← Back to dashboard
        </Link>
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="mb-1 text-xl font-semibold text-slate-900">
            Start a capstone project
          </h1>
          <p className="mb-6 text-sm text-slate-600">
            Fill in your project details and link your adviser with their code.
          </p>
          <CreateProjectForm />
        </div>
      </main>
    </>
  );
}
