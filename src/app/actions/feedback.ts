"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { getAccessibleProject } from "@/lib/access";
import { logEvent } from "@/lib/timeline";
import {
  DOCUMENT_STATUSES,
  STATUS_LABELS,
  DOCUMENT_TYPE_LABELS,
  type DocumentStatus,
  type DocumentType,
} from "@/lib/constants";

export type FormState = { error?: string; ok?: boolean } | undefined;

const schema = z.object({
  projectId: z.string().min(1),
  targetType: z.enum(["DOCUMENT", "PROGRESS"]),
  targetId: z.string().min(1),
  body: z.string().trim().min(1, "Write your feedback."),
  statusApplied: z
    .enum(DOCUMENT_STATUSES)
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export async function giveFeedbackAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const adviser = await requireRole("ADVISER");

  const parsed = schema.safeParse({
    projectId: formData.get("projectId"),
    targetType: formData.get("targetType"),
    targetId: formData.get("targetId"),
    body: formData.get("body"),
    statusApplied: formData.get("statusApplied") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const { projectId, targetType, targetId, body, statusApplied } = parsed.data;

  const project = await getAccessibleProject(projectId, adviser.id);
  if (!project || project.adviserId !== adviser.id) {
    return { error: "You cannot review this project." };
  }

  // Confirm the target belongs to this project.
  if (targetType === "DOCUMENT") {
    const doc = await prisma.document.findFirst({
      where: { id: targetId, projectId },
    });
    if (!doc) return { error: "Document not found." };
  } else {
    const p = await prisma.progressUpdate.findFirst({
      where: { id: targetId, projectId },
    });
    if (!p) return { error: "Progress update not found." };
  }

  await prisma.feedback.create({
    data: {
      projectId,
      targetType,
      targetId,
      body,
      statusApplied: statusApplied ?? null,
      authorId: adviser.id,
    },
  });

  await logEvent({
    projectId,
    actorId: adviser.id,
    type: "FEEDBACK_GIVEN",
    summary: `${adviser.name} left feedback.`,
    refId: targetId,
  });

  // Applying a status only makes sense for documents.
  if (targetType === "DOCUMENT" && statusApplied) {
    const doc = await prisma.document.update({
      where: { id: targetId },
      data: { status: statusApplied },
    });
    const label = DOCUMENT_TYPE_LABELS[doc.type as DocumentType];
    await logEvent({
      projectId,
      actorId: adviser.id,
      type: "STATUS_CHANGED",
      summary: `${adviser.name} set ${label} (v${doc.version}) to ${
        STATUS_LABELS[statusApplied as DocumentStatus]
      }.`,
      refId: targetId,
    });
  }

  revalidatePath(`/project/${projectId}`);
  return { ok: true };
}
