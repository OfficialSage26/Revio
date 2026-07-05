import { prisma } from "./prisma";

// Returns the project only if the given user is its owning student or its
// linked adviser. Returns null otherwise (caller should 404/403).
export async function getAccessibleProject(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      student: true,
      adviser: true,
      documents: { orderBy: [{ uploadedAt: "desc" }] },
      progressUpdates: { orderBy: { createdAt: "desc" } },
      feedbacks: { include: { author: true }, orderBy: { createdAt: "desc" } },
      timelineEvents: {
        include: { actor: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) return null;
  if (project.studentId !== userId && project.adviserId !== userId) return null;
  return project;
}

export type AccessibleProject = NonNullable<
  Awaited<ReturnType<typeof getAccessibleProject>>
>;
