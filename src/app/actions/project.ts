"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { logEvent } from "@/lib/timeline";

export type FormState = { error?: string } | undefined;

const optionalUrl = z
  .string()
  .trim()
  .url("Enter a valid URL (including https://).")
  .optional()
  .or(z.literal("").transform(() => undefined));

const projectSchema = z.object({
  title: z.string().trim().min(3, "Give your project a title."),
  description: z.string().trim().min(10, "Add a short description."),
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  adviserCode: z.string().trim().min(1, "Enter your adviser's code."),
});

export async function createProjectAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const student = await requireRole("STUDENT");

  const parsed = projectSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    githubUrl: formData.get("githubUrl"),
    liveUrl: formData.get("liveUrl"),
    adviserCode: formData.get("adviserCode"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { title, description, githubUrl, liveUrl, adviserCode } = parsed.data;

  const adviser = await prisma.user.findUnique({
    where: { adviserCode: adviserCode.toUpperCase() },
  });
  if (!adviser || adviser.role !== "ADVISER") {
    return { error: "No adviser found with that code. Double-check it." };
  }

  const project = await prisma.project.create({
    data: {
      title,
      description,
      githubUrl,
      liveUrl,
      studentId: student.id,
      adviserId: adviser.id,
    },
  });

  await logEvent({
    projectId: project.id,
    actorId: student.id,
    type: "PROJECT_CREATED",
    summary: `${student.name} created the project and linked adviser ${adviser.name}.`,
  });

  redirect(`/project/${project.id}`);
}
