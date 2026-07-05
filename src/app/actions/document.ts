"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { getAccessibleProject } from "@/lib/access";
import { saveUpload } from "@/lib/storage";
import { logEvent } from "@/lib/timeline";
import { DOCUMENT_TYPES, DOCUMENT_TYPE_LABELS, type DocumentType } from "@/lib/constants";

export type FormState = { error?: string; ok?: boolean } | undefined;

const MAX_BYTES = 20 * 1024 * 1024; // 20 MB

const schema = z.object({
  projectId: z.string().min(1),
  type: z.enum(DOCUMENT_TYPES),
});

export async function uploadDocumentAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const student = await requireRole("STUDENT");

  const parsed = schema.safeParse({
    projectId: formData.get("projectId"),
    type: formData.get("type"),
  });
  if (!parsed.success) {
    return { error: "Choose a valid document type." };
  }
  const { projectId, type } = parsed.data;

  const project = await getAccessibleProject(projectId, student.id);
  if (!project || project.studentId !== student.id) {
    return { error: "You cannot upload to this project." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Select a file to upload." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "File is too large (max 20 MB)." };
  }

  // Version = one more than the latest document of the same type.
  const latest = await prisma.document.findFirst({
    where: { projectId, type },
    orderBy: { version: "desc" },
  });
  const version = (latest?.version ?? 0) + 1;

  const fileUrl = await saveUpload(file);

  const doc = await prisma.document.create({
    data: {
      projectId,
      type,
      fileName: file.name,
      fileUrl,
      version,
      status: "PENDING_REVIEW",
    },
  });

  const label = DOCUMENT_TYPE_LABELS[type as DocumentType];
  await logEvent({
    projectId,
    actorId: student.id,
    type: "DOCUMENT_UPLOADED",
    summary: `${student.name} uploaded ${label} (v${version}).`,
    refId: doc.id,
  });

  revalidatePath(`/project/${projectId}`);
  return { ok: true };
}
