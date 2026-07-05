import Link from "next/link";
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

    return (
      <>
        <TopBar name={user.name} role={user.role} />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
          <div className="mb-8 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-6">
            <h1 className="text-lg font-semibold text-slate-900">
              Your adviser code
            </h1>
            <p className="mb-3 text-sm text-slate-600">
              Share this with your students so they can link their project to you.
            </p>
            <CopyCode code={user.adviserCode ?? ""} />
          </div>

          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Projects under your code ({projects.length})
          </h2>

          {projects.length === 0 ? (
            <EmptyState message="No projects yet. Once a student joins with your code, their project appears here." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((p) => {
                const pending = p.documents.filter(
                  (d) => d.status === "PENDING_REVIEW",
                ).length;
                return (
                  <Link
                    key={p.id}
                    href={`/project/${p.id}`}
                    className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm"
                  >
                    <p className="font-semibold text-slate-900">{p.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      by {p.student.name}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span>{p._count.documents} documents</span>
                      <span>·</span>
                      <span>{p._count.progressUpdates} updates</span>
                      {pending > 0 && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-800">
                          {pending} pending review
                        </span>
                      )}
                    </div>
                  </Link>
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
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900">Your projects</h1>
          <Link
            href="/project/new"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            + New project
          </Link>
        </div>

        {projects.length === 0 ? (
          <EmptyState message="You haven't started a project yet. Create one and link your adviser with their code.">
            <Link
              href="/project/new"
              className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Start your project
            </Link>
          </EmptyState>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((p) => {
              const approved = p.documents.filter(
                (d) => d.status === "APPROVED",
              ).length;
              return (
                <Link
                  key={p.id}
                  href={`/project/${p.id}`}
                  className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm"
                >
                  <p className="font-semibold text-slate-900">{p.title}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Adviser: {p.adviser.name}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>{p._count.documents} documents</span>
                    <span>·</span>
                    <span>{p._count.progressUpdates} updates</span>
                    {approved > 0 && (
                      <StatusBadge status="APPROVED" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}

function EmptyState({
  message,
  children,
}: {
  message: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <p className="text-sm text-slate-500">{message}</p>
      {children}
    </div>
  );
}
