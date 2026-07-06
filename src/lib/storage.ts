import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { uploadExtension } from "./constants";

// Local uploads live OUTSIDE public/ so they are never served directly by the
// static file server. They are streamed through /api/files/[key], which checks
// the session and project membership first.
const LOCAL_UPLOADS_DIR = path.join(process.cwd(), "uploads");

export class StorageError extends Error {}

// Saves an uploaded file and returns the URL to reach it.
// Uses Vercel Blob when BLOB_READ_WRITE_TOKEN is set (production),
// otherwise writes to ./uploads for local development.
export async function saveUpload(file: File): Promise<string> {
  const ext = uploadExtension(file.name);
  if (!ext) {
    throw new StorageError(
      "That file type isn't allowed. Upload a document, image, or archive (pdf, docx, pptx, xlsx, txt, md, csv, png, jpg, gif, webp, zip).",
    );
  }

  const key = `${randomUUID()}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`documents/${key}`, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: undefined, // let Blob infer from extension
    });
    return blob.url;
  }

  // Serverless filesystems are read-only — fail clearly instead of crashing.
  if (process.env.VERCEL) {
    throw new StorageError(
      "File storage is not configured. Add a Vercel Blob store and set BLOB_READ_WRITE_TOKEN.",
    );
  }

  await mkdir(LOCAL_UPLOADS_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(LOCAL_UPLOADS_DIR, key), buffer);
  return `/api/files/${key}`;
}

// Resolves a stored key to its on-disk path, refusing path traversal.
export function localUploadPath(key: string): string | null {
  if (!/^[a-f0-9-]+\.[a-z0-9]+$/i.test(key)) return null;
  const resolved = path.resolve(LOCAL_UPLOADS_DIR, key);
  if (!resolved.startsWith(path.resolve(LOCAL_UPLOADS_DIR))) return null;
  return resolved;
}
