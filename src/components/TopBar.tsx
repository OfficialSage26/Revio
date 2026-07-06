import Link from "next/link";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

export function TopBar({ name, role }: { name: string; role: string }) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-black text-white shadow-md shadow-indigo-500/20">
            R
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Revio
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              role === "ADVISER"
                ? "bg-violet-100 text-violet-700"
                : "bg-indigo-100 text-indigo-700"
            }`}
          >
            {role === "ADVISER" ? "Adviser" : "Student"}
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 sm:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
              {initials}
            </span>
            <span className="text-sm font-medium text-slate-700">{name}</span>
          </span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
