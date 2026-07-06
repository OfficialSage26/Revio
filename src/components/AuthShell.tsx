import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-slate-950 lg:block">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(600px 400px at 20% 10%, rgba(99,102,241,0.35), transparent 60%), radial-gradient(600px 400px at 80% 90%, rgba(139,92,246,0.28), transparent 60%)",
          }}
        />
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-black text-white shadow-lg shadow-indigo-500/30">
              R
            </span>
            <span className="text-xl font-bold tracking-tight text-white">
              Revio
            </span>
          </Link>
          <div>
            <h2 className="max-w-sm text-3xl font-bold leading-tight text-white">
              Capstone supervision, minus the scheduling.
            </h2>
            <ul className="mt-8 space-y-3">
              {[
                "Post documents & progress anytime",
                "Advisers review on their own schedule",
                "One transparent timeline for everything",
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-3 text-sm text-slate-300"
                >
                  <CheckCircle2 className="h-5 w-5 text-indigo-400" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Revio
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-800 lg:hidden"
          >
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-black text-white">
              R
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Revio
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mb-8 mt-1.5 text-slate-500">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
