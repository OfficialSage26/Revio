import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { localUploadPath } from "@/lib/storage";
import { ALLOWED_UPLOAD_EXTENSIONS } from "@/lib/constants";

// Streams a locally stored document. Only the project's owning student or
// its linked adviser may download; everyone else gets 404 (no existence leak).
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;

  const session = await getSession();
  if (!session) return new NextResponse("Not found", { status: 404 });

  const document = await prisma.document.findFirst({
    where: { fileUrl: `/api/files/${key}` },
    include: { project: { select: { studentId: true, adviserId: true } } },
  });
  if (
    !document ||
    (document.project.studentId !== session.userId &&
      document.project.adviserId !== session.userId)
  ) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filePath = localUploadPath(key);
  if (!filePath) return new NextResponse("Not found", { status: 404 });

  let data: Buffer;
  try {
    data = await readFile(filePath);
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }

  const ext = key.split(".").pop()?.toLowerCase() ?? "";
  const contentType =
    ALLOWED_UPLOAD_EXTENSIONS[ext] ?? "application/octet-stream";
  const inline = ["pdf", "png", "jpg", "jpeg", "gif", "webp", "txt", "md"];

  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `${inline.includes(ext) ? "inline" : "attachment"}; filename="${encodeURIComponent(document.fileName)}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, max-age=0",
    },
  });
}
