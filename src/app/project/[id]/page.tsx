import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getAccessibleProject, type AccessibleProject } from "@/lib/access";
import { TopBar } from "@/components/TopBar";
import { StatusBadge } from "@/components/StatusBadge";
import { FeedbackForm } from "@/components/forms/FeedbackForm";
import { UploadDocumentForm } from "@/components/forms/UploadDocumentForm";
import { ProgressForm } from "@/components/forms/ProgressForm";
import { DOCUMENT_TYPE_LABELS, type DocumentType } from "@/lib/constants";

function fmt(d: Date) {
  return new Date(d).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

type Feedbacks = AccessibleProject["feedbacks"];

function FeedbackList({ items }: { items: Feedbacks }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-3 space-y-2 border-t border-slate-100 pt-3">
      {items.map((f) => (
        <li key={f.id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-slate-700">{f.author.name}</span>
            <span className="text-xs text-slate-400">{fmt(f.createdAt)}</span>
          </div>
          <p className="mt-1 whitespace-pre-wrap text-slate-600">{f.body}</p>
          {f.statusApplied && (
            <div className="mt-1.5">
              <StatusBadge status={f.statusApplied} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const project = await getAccessibleProject(id, user.id);
  if (!project) notFound();

  const isStudent = user.id === project.studentId;
  const isAdviser = user.id === project.adviserId;

  const feedbackByTarget = new Map<string, Feedbacks>();
  for (const f of project.feedbacks) {
    const list = feedbackByTarget.get(f.targetId) ?? [];
    list.push(f);
    feedbackByTarget.set(f.targetId, list);
  }

  return (
    <>
      <TopBar name={user.name} role={user.role} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Link
          href="/dashboard"
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← Back to dashboard
        </Link>

        {/* Project header */}
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6">
          <h1 className="text-2xl font-bold text-slate-900">{project.title}</h1>
          <p className="mt-2 text-slate-600">{project.description}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
              >
                GitHub repo ↗
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
              >
                Live app ↗
              </a>
            )}
          </div>
          <div className="mt-4 text-sm text-slate-500">
            Student: {project.student.name} · Adviser: {project.adviser.name}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Documents */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Documents
              </h2>

              {isStudent && (
                <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    Upload a document
                  </p>
                  <UploadDocumentForm projectId={project.id} />
                </div>
              )}

              {project.documents.length === 0 ? (
                <p className="text-sm text-slate-500">No documents uploaded yet.</p>
              ) : (
                <ul className="space-y-4">
                  {project.documents.map((d) => (
                    <li
                      key={d.id}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="font-medium text-slate-900">
                            {DOCUMENT_TYPE_LABELS[d.type as DocumentType]}
                          </span>
                          <span className="ml-2 text-xs text-slate-400">
                            v{d.version} · {fmt(d.uploadedAt)}
                          </span>
                        </div>
                        <StatusBadge status={d.status} />
                      </div>
                      <a
                        href={d.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-sm text-indigo-600 hover:underline"
                      >
                        {d.fileName} ↗
                      </a>

                      <FeedbackList items={feedbackByTarget.get(d.id) ?? []} />

                      {isAdviser && (
                        <FeedbackForm
                          projectId={project.id}
                          targetType="DOCUMENT"
                          targetId={d.id}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Progress */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Progress updates
              </h2>

              {isStudent && (
                <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    Post an update
                  </p>
                  <ProgressForm projectId={project.id} />
                </div>
              )}

              {project.progressUpdates.length === 0 ? (
                <p className="text-sm text-slate-500">No updates yet.</p>
              ) : (
                <ul className="space-y-4">
                  {project.progressUpdates.map((u) => (
                    <li
                      key={u.id}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <p className="mb-2 text-xs text-slate-400">
                        {fmt(u.createdAt)}
                      </p>
                      <dl className="space-y-1.5 text-sm">
                        <Field label="Completed" value={u.completedFeatures} />
                        <Field label="Milestones" value={u.milestones} />
                        <Field label="Challenges" value={u.challenges} />
                        <Field label="Upcoming" value={u.upcomingTasks} />
                      </dl>

                      <FeedbackList items={feedbackByTarget.get(u.id) ?? []} />

                      {isAdviser && (
                        <FeedbackForm
                          projectId={project.id}
                          targetType="PROGRESS"
                          targetId={u.id}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* Timeline */}
          <aside className="lg:col-span-1">
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Timeline
              </h2>
              {project.timelineEvents.length === 0 ? (
                <p className="text-sm text-slate-500">Nothing yet.</p>
              ) : (
                <ol className="space-y-4">
                  {project.timelineEvents.map((e) => (
                    <li key={e.id} className="relative pl-5">
                      <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-indigo-400" />
                      <p className="text-sm text-slate-700">{e.summary}</p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {fmt(e.createdAt)}
                      </p>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </aside>
        </div>
      </main>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  if (!value?.trim()) return null;
  return (
    <div>
      <dt className="inline font-medium text-slate-600">{label}: </dt>
      <dd className="inline whitespace-pre-wrap text-slate-600">{value}</dd>
    </div>
  );
}
