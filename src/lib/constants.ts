// Enum-like domain values. Stored as strings in SQLite, validated here.

export const ROLES = ["STUDENT", "ADVISER"] as const;
export type Role = (typeof ROLES)[number];

export const DOCUMENT_TYPES = [
  "PROPOSAL",
  "CHAPTER_1",
  "CHAPTER_2",
  "CHAPTER_3",
  "CHAPTER_4",
  "CHAPTER_5",
  "OTHER",
] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  PROPOSAL: "Proposal",
  CHAPTER_1: "Chapter 1",
  CHAPTER_2: "Chapter 2",
  CHAPTER_3: "Chapter 3",
  CHAPTER_4: "Chapter 4",
  CHAPTER_5: "Chapter 5",
  OTHER: "Other",
};

export const DOCUMENT_STATUSES = [
  "PENDING_REVIEW",
  "APPROVED",
  "REVISION_REQUIRED",
] as const;
export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number];

export const STATUS_LABELS: Record<DocumentStatus, string> = {
  PENDING_REVIEW: "Pending Review",
  APPROVED: "Approved",
  REVISION_REQUIRED: "Revision Required",
};

// Tailwind classes for status badges.
export const STATUS_STYLES: Record<DocumentStatus, string> = {
  PENDING_REVIEW: "bg-amber-100 text-amber-800 border-amber-200",
  APPROVED: "bg-green-100 text-green-800 border-green-200",
  REVISION_REQUIRED: "bg-red-100 text-red-800 border-red-200",
};

export const TIMELINE_TYPES = [
  "DOCUMENT_UPLOADED",
  "PROGRESS_POSTED",
  "FEEDBACK_GIVEN",
  "STATUS_CHANGED",
] as const;
export type TimelineType = (typeof TIMELINE_TYPES)[number];
