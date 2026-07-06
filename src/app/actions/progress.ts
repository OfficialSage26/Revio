"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { getAccessibleProject } from "@/lib/access";
import { logEvent } from "@/lib/timeline";

export type FormState = { error?: string; ok?: boolean } | undefined;

const schema = z.object({
  projectId: z.string().min(1),
  completedFeatures: z.string().trim().min(1, "Describe what you completed."),
  milestones: z.string().trim().default(""),
  challenges: z.string().trim().default(""),
  upcomingTasks: z.string().trim().default(""),
});

export async function postProgressAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const student = await requireRole("STUDENT");

  const parsed = schema.safeParse({
    projectId: formData.get("projectId"),
    completedFeatures: formData.get("completedFeatures"),
    milestones: formData.get("milestones") ?? "",
    challenges: formData.get("challenges") ?? "",
    upcomingTasks: formData.get("upcomingTasks") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const { projectId, ...fields } = parsed.data;

  const project = await getAccessibleProject(projectId, student.id);
  if (!project || project.studentId !== student.id) {
    return { error: "You cannot post progress to this project." };
  }

  await prisma.progressUpdate.create({
    data: { projectId, ...fields },
  });

  await logEvent({
    projectId,
    actorId: student.id,
    type: "PROGRESS_POSTED",
    summary: `${student.name} posted a progress update.`,
  });

  revalidatePath(`/project/${projectId}`);
  return { ok: true };
}
