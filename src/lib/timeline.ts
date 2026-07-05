import { prisma } from "./prisma";
import type { TimelineType } from "./constants";

// Records a single event on a project's chronological timeline.
// Called by the same server action that performs the underlying mutation.
export async function logEvent(params: {
  projectId: string;
  actorId: string;
  type: TimelineType;
  summary: string;
  refId?: string;
}) {
  await prisma.timelineEvent.create({
    data: {
      projectId: params.projectId,
      actorId: params.actorId,
      type: params.type,
      summary: params.summary,
      refId: params.refId,
    },
  });
}

// Generates a unique, human-shareable adviser code, e.g. "ADV-7QK2ML".
export async function generateAdviserCode(): Promise<string> {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  for (let attempt = 0; attempt < 10; attempt++) {
    let code = "ADV-";
    for (let i = 0; i < 6; i++) {
      code += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    const existing = await prisma.user.findUnique({
      where: { adviserCode: code },
    });
    if (!existing) return code;
  }
  throw new Error("Could not generate a unique adviser code");
}
