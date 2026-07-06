import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  GitBranch,
  Globe,
  FileText,
  Rocket,
  History,
  Download,
  MessageSquareText,
  UploadCloud,
  Sparkles,
  FolderPlus,
  RefreshCw,
  GraduationCap,
  UserCog,
} from "lucide-react";
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

const TIMELINE_ICONS: Record<
  string,
  { icon: typeof FileText; cls: string }
> = {
  PROJECT_CREATED: { icon: FolderPlus, cls: "bg-violet-100 text-violet-600" },
  DOCUMENT_UPLOADED: { icon: UploadCloud, cls: "bg-indigo-100 text-indigo-600" },
  PROGRESS_POSTED: { icon: Rocket, cls: "bg-sky-100 text-sky-600" },
  FEEDBACK_GIVEN: {
    icon: MessageSquareText,
    cls: "bg-amber-100 text-amber-600",
  },
  STATUS_CHANGED: { icon: RefreshCw, cls: "bg-emerald-100 text-emerald-600" },
};

function FeedbackList({ items }: { items: Feedbacks }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-4 space-y-2.5 border-t border-slate-100 pt-4">
      {items.map((f) => (
        <li
          key={f.id}
          className="rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-3 text-sm"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <MessageSquareText className="h-3.5 w-3.5 text-amber-500" />
              {f.author.name}
            </span>
            <span className="text-xs text-slate-400">{fmt(f.createdAt)}</span>
          </div>
          <p className="mt-1.5 whitespace-pre-wrap text-slate-600">{f.body}</p>
          {f.statusApplied && (
            <div className="mt-2">
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
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>

        {/* Project header */}
        <div className="card mt-4 overflow-hidden">
          <div className="border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white p-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {project.title}
            </h1>
            <p className="mt-2 max-w-2xl text-slate-600">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-2.5 text-sm">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary !px-3 !py-1.5"
                >
                  <GitBranch className="h-4 w-4" /> GitHub repo
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary !px-3 !py-1.5"
                >
                  <Globe className="h-4 w-4" /> Live app
                </a>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 px-6 py-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-indigo-400" />
              Student: <span className="font-medium text-slate-700">{project.student.name}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <UserCog className="h-4 w-4 text-violet-400" />
              Adviser: <span className="font-medium text-slate-700">{project.adviser.name}</span>
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Documents */}
            <section className="card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                <FileText className="h-5 w-5 text-indigo-500" />
                Documents
              </h2>

              {isStudent && (
                <div className="mb-5 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 p-4">
                  <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                    <UploadCloud className="h-4 w-4 text-indigo-500" />
                    Upload a document
                  </p>
                  <UploadDocumentForm projectId={project.id} />
                </div>
              )}

              {project.documents.length === 0 ? (
                <EmptyRow message="No documents uploaded yet." />
              ) : (
                <ul className="space-y-4">
                  {project.documents.map((d) => (
                    <li
                      key={d.id}
                      className="rounded-xl border border-slate-200 p-4 transition hover:border-slate-300"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
                            <FileText className="h-4 w-4" />
                          </span>
                          <div>
                            <span className="font-semibold text-slate-900">
                              {DOCUMENT_TYPE_LABELS[d.type as DocumentType]}
                            </span>
                            <span className="ml-2 text-xs text-slate-400">
                              v{d.version} · {fmt(d.uploadedAt)}
                            </span>
                          </div>
                        </div>
                        <StatusBadge status={d.status} />
                      </div>
                      <a
                        href={d.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:underline"
                      >
                        <Download className="h-3.5 w-3.5" />
                        {d.fileName}
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
            <section className="card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                <Rocket className="h-5 w-5 text-sky-500" />
                Progress updates
              </h2>

              {isStudent && (
                <div className="mb-5 rounded-xl border border-dashed border-sky-200 bg-sky-50/50 p-4">
                  <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                    <Sparkles className="h-4 w-4 text-sky-500" />
                    Post an update
                  </p>
                  <ProgressForm projectId={project.id} />
                </div>
              )}

              {project.progressUpdates.length === 0 ? (
                <EmptyRow message="No updates yet." />
              ) : (
                <ul className="space-y-4">
                  {project.progressUpdates.map((u) => (
                    <li
                      key={u.id}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <p className="mb-3 text-xs font-medium text-slate-400">
                        {fmt(u.createdAt)}
                      </p>
                      <dl className="grid gap-3 sm:grid-cols-2">
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
            <section className="card sticky top-20 p-6">
              <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                <History className="h-5 w-5 text-slate-400" />
                Timeline
              </h2>
              {project.timelineEvents.length === 0 ? (
                <EmptyRow message="Nothing yet." />
              ) : (
                <ol className="relative space-y-5 before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-slate-200">
                  {project.timelineEvents.map((e) => {
                    const cfg =
                      TIMELINE_ICONS[e.type] ?? {
                        icon: History,
                        cls: "bg-slate-100 text-slate-500",
                      };
                    const Icon = cfg.icon;
                    return (
                      <li key={e.id} className="relative flex gap-3">
                        <span
                          className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-white ${cfg.cls}`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="pt-1">
                          <p className="text-sm leading-snug text-slate-700">
                            {e.summary}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            {fmt(e.createdAt)}
                          </p>
                        </div>
                      </li>
                    );
                  })}
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
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-0.5 whitespace-pre-wrap text-sm text-slate-700">
        {value}
      </dd>
    </div>
  );
}

function EmptyRow({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-6 text-center text-sm text-slate-400">
      {message}
    </p>
  );
}
