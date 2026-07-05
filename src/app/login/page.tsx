import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/forms/LoginForm";

export default async function LoginPage() {
  if (await getSession()) redirect("/dashboard");

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 block text-center text-2xl font-bold text-indigo-600"
        >
          Revio
        </Link>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="mb-1 text-xl font-semibold text-slate-900">
            Welcome back
          </h1>
          <p className="mb-6 text-sm text-slate-600">
            Sign in to your Revio account.
          </p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
