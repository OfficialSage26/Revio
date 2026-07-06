import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  GitBranch,
  History,
  KeyRound,
  MessageSquareText,
  Rocket,
  ShieldCheck,
  UploadCloud,
  Users,
} from "lucide-react";

export default async function Home() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-200">
      {/* Background glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(600px 300px at 15% -5%, rgba(99,102,241,0.25), transparent 60%), radial-gradient(800px 400px at 85% 5%, rgba(139,92,246,0.18), transparent 60%), radial-gradient(700px 500px at 50% 110%, rgba(99,102,241,0.12), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* Nav */}
      <header className="relative z-10">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-black text-white shadow-lg shadow-indigo-500/30">
              R
            </span>
            <span className="text-xl font-bold tracking-tight text-white">
              Revio
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-300 transition hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-white/10 transition hover:bg-slate-200"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-16 text-center sm:pt-24">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
          <Clock className="h-3.5 w-3.5" />
          Capstone reviews without the scheduling headache
        </div>
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
          Your capstone, reviewed{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
            on everyone&apos;s own time
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
          Students post documents, code links, and progress. Advisers review and
          give feedback whenever they&apos;re free. No missed meetings, no scattered
          chats — one transparent record from proposal to defense.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-500/30 transition hover:shadow-indigo-500/50"
          >
            Start free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-7 py-3.5 text-sm font-bold text-slate-200 backdrop-blur transition hover:border-slate-500 hover:text-white"
          >
            Sign in
          </Link>
        </div>

        {/* Product preview */}
        <div className="relative mx-auto mt-16 max-w-4xl">
          <div
            aria-hidden
            className="absolute -inset-6 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-indigo-500/20 blur-2xl"
          />
          <div className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/80 text-left shadow-2xl backdrop-blur">
            <div className="flex items-center gap-1.5 border-b border-slate-800 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-slate-700" />
              <span className="h-3 w-3 rounded-full bg-slate-700" />
              <span className="h-3 w-3 rounded-full bg-slate-700" />
              <span className="ml-3 rounded-md bg-slate-800 px-3 py-1 text-xs text-slate-400">
                revio.app/project/smart-attendance
              </span>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-3">
              <div className="space-y-3 sm:col-span-2">
                <p className="text-sm font-semibold text-white">
                  Smart Attendance System
                </p>
                {[
                  {
                    label: "Chapter 1 · v2",
                    status: "Approved",
                    cls: "bg-emerald-500/15 text-emerald-300 border-emerald-400/20",
                  },
                  {
                    label: "Chapter 2 · v1",
                    status: "Revision Required",
                    cls: "bg-rose-500/15 text-rose-300 border-rose-400/20",
                  },
                  {
                    label: "Proposal · v3",
                    status: "Pending Review",
                    cls: "bg-amber-500/15 text-amber-300 border-amber-400/20",
                  },
                ].map((d) => (
                  <div
                    key={d.label}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3"
                  >
                    <span className="flex items-center gap-2.5 text-sm text-slate-300">
                      <FileText className="h-4 w-4 text-indigo-400" />
                      {d.label}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${d.cls}`}
                    >
                      {d.status}
                    </span>
                  </div>
                ))}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <MessageSquareText className="h-3.5 w-3.5" /> Adviser feedback
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    &ldquo;Chapter 2 methodology needs more detail on your sampling
                    technique. Everything else looks solid — nice work.&rdquo;
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <History className="h-3.5 w-3.5" /> Timeline
                </p>
                <ul className="mt-3 space-y-3">
                  {[
                    "Chapter 1 approved",
                    "Feedback on Chapter 2",
                    "Progress update posted",
                    "Chapter 2 uploaded",
                  ].map((t) => (
                    <li key={t} className="flex gap-2.5 text-xs text-slate-400">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold tracking-tight text-white">
          Everything a capstone needs, nothing it doesn&apos;t
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-slate-400">
          Built for one thing: keeping students and advisers in sync without
          being in the same room.
        </p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: KeyRound,
              title: "Adviser codes",
              desc: "Advisers get a unique invite code. Students join with it — no admin, no manual assignments.",
            },
            {
              icon: UploadCloud,
              title: "Versioned documents",
              desc: "Upload proposals and Chapters 1–5. Revisions become new versions; nothing is ever lost.",
            },
            {
              icon: MessageSquareText,
              title: "Feedback & statuses",
              desc: "Advisers comment and set Approved, Pending Review, or Revision Required on every document.",
            },
            {
              icon: Rocket,
              title: "Progress updates",
              desc: "Completed features, milestones, challenges, and what's next — posted as structured updates.",
            },
            {
              icon: GitBranch,
              title: "Code & live app links",
              desc: "The GitHub repo and live deployment sit right on the project, one click from any review.",
            },
            {
              icon: History,
              title: "Full timeline",
              desc: "Every upload, comment, and status change lands on one chronological, accountable record.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition hover:border-indigo-500/40 hover:bg-slate-900"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 transition group-hover:bg-indigo-500/20">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold tracking-tight text-white">
          Up and running in three steps
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            {
              n: "01",
              icon: Users,
              title: "Adviser creates an account",
              desc: "They instantly get a shareable code like ADV-7QK2ML.",
            },
            {
              n: "02",
              icon: KeyRound,
              title: "Students join with the code",
              desc: "Create the project profile — title, description, repo, live URL — and link the adviser.",
            },
            {
              n: "03",
              icon: CheckCircle2,
              title: "Review flows async",
              desc: "Uploads, feedback, statuses, and progress — all tracked on the shared timeline.",
            },
          ].map((s) => (
            <div
              key={s.n}
              className="relative rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
            >
              <span className="absolute right-5 top-4 text-4xl font-black text-slate-800">
                {s.n}
              </span>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <s.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-600/20 via-slate-900 to-violet-600/20 p-10 text-center sm:p-14">
          <ShieldCheck className="mx-auto h-10 w-10 text-indigo-400" />
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">
            Ready to stop chasing meetings?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-slate-400">
            Free to use. Set up in under a minute — one account for the adviser,
            one for the team.
          </p>
          <Link
            href="/register"
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-slate-900 shadow-xl transition hover:bg-slate-200"
          >
            Create your account
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row">
          <span className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-black text-white">
              R
            </span>
            Revio — capstone review &amp; monitoring
          </span>
          <span>Built for students and advisers.</span>
        </div>
      </footer>
    </main>
  );
}
