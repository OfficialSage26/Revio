import Link from "next/link";
import {
  FolderKanban,
  FileText,
  Rocket,
  Plus,
  Share2,
  ArrowRight,
  Inbox,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TopBar } from "@/components/TopBar";
import { CopyCode } from "@/components/CopyCode";
import { StatusBadge } from "@/components/StatusBadge";

export default async function DashboardPage() {
  const user = await requireUser();

  if (user.role === "ADVISER") {
    const projects = await prisma.project.findMany({
      where: { adviserId: user.id },
      include: {
        student: true,
        documents: true,
        _count: { select: { documents: true, progressUpdates: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalPending = projects.reduce(
      (n, p) => n + p.documents.filter((d) => d.status === "PENDING_REVIEW").length,
      0,
    );

    return (
      <>
        <TopBar name={user.name} role={user.role} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
          {/* Adviser code banner */}
          <div className="card relative overflow-hidden p-6">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-500/10 to-violet-500/10 blur-2xl"
            />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                  <Share2 className="h-5 w-5 text-indigo-500" />
                  Your adviser code
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Share this with your students so they can link their project to
                  you.
                </p>
              </div>
              <CopyCode code={user.adviserCode ?? ""} />
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard
              icon={FolderKanban}
              label="Projects"
              value={projects.length}
            />
            <StatCard
              icon={Inbox}
              label="Pending review"
              value={totalPending}
              accent
            />
            <StatCard
              icon={Rocket}
              label="Progress updates"
              value={projects.reduce((n, p) => n + p._count.progressUpdates, 0)}
            />
          </div>

          <h2 className="mb-4 mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Projects under your code
          </h2>

          {projects.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              message="No projects yet. Once a student joins with your code, their project appears here."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => {
                const pending = p.documents.filter(
                  (d) => d.status === "PENDING_REVIEW",
                ).length;
                return (
                  <ProjectCard
                    key={p.id}
                    href={`/project/${p.id}`}
                    title={p.title}
                    subtitle={`by ${p.student.name}`}
                    docs={p._count.documents}
                    updates={p._count.progressUpdates}
                    badge={
                      pending > 0 ? (
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                          {pending} pending
                        </span>
                      ) : null
                    }
                  />
                );
              })}
            </div>
          )}
        </main>
      </>
    );
  }

  // STUDENT
  const projects = await prisma.project.findMany({
    where: { studentId: user.id },
    include: {
      adviser: true,
      documents: true,
      _count: { select: { documents: true, progressUpdates: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <TopBar name={user.name} role={user.role} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Your projects
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Upload work, post progress, and track adviser feedback.
            </p>
          </div>
          <Link href="/project/new" className="btn-primary">
            <Plus className="h-4 w-4" />
            New project
          </Link>
        </div>

        {projects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            message="You haven't started a project yet. Create one and link your adviser with their code."
          >
            <Link href="/project/new" className="btn-primary mt-5">
              <Plus className="h-4 w-4" />
              Start your project
            </Link>
          </EmptyState>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => {
              const approved = p.documents.filter(
                (d) => d.status === "APPROVED",
              ).length;
              return (
                <ProjectCard
                  key={p.id}
                  href={`/project/${p.id}`}
                  title={p.title}
                  subtitle={`Adviser: ${p.adviser.name}`}
                  docs={p._count.documents}
                  updates={p._count.progressUpdates}
                  badge={approved > 0 ? <StatusBadge status="APPROVED" /> : null}
                />
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: typeof FileText;
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
          accent
            ? "bg-amber-100 text-amber-600"
            : "bg-indigo-50 text-indigo-600"
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function ProjectCard({
  href,
  title,
  subtitle,
  docs,
  updates,
  badge,
}: {
  href: string;
  title: string;
  subtitle: string;
  docs: number;
  updates: number;
  badge: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="card group flex flex-col p-5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-slate-900 group-hover:text-indigo-700">
          {title}
        </p>
        <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500" />
      </div>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" /> {docs}
        </span>
        <span className="flex items-center gap-1.5">
          <Rocket className="h-3.5 w-3.5" /> {updates}
        </span>
        {badge && <span className="ml-auto">{badge}</span>}
      </div>
    </Link>
  );
}

function EmptyState({
  icon: Icon,
  message,
  children,
}: {
  icon: typeof FileText;
  message: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center border-dashed p-12 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Icon className="h-7 w-7" />
      </span>
      <p className="mt-4 max-w-sm text-sm text-slate-500">{message}</p>
      {children}
    </div>
  );
}
