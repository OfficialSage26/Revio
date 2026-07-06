import Link from "next/link";
import { Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25">
        <Compass className="h-8 w-8" />
      </span>
      <p className="mt-6 text-6xl font-black tracking-tight text-slate-900">
        404
      </p>
      <h1 className="mt-2 text-xl font-bold text-slate-800">Page not found</h1>
      <p className="mt-2 max-w-sm text-slate-500">
        This page doesn&apos;t exist, or you don&apos;t have access to it.
      </p>
      <Link href="/dashboard" className="btn-primary mt-8">
        <Home className="h-4 w-4" />
        Back to dashboard
      </Link>
    </main>
  );
}
