"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export function SubmitButton({
  children,
  className = "",
  variant = "primary",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${variant === "primary" ? "btn-primary" : "btn-secondary"} ${className}`}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending ? "Working…" : children}
    </button>
  );
}
