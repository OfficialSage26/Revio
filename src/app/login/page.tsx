import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AuthShell } from "@/components/AuthShell";
import { LoginForm } from "@/components/forms/LoginForm";

export default async function LoginPage() {
  if (await getSession()) redirect("/dashboard");

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your Revio account.">
      <LoginForm />
    </AuthShell>
  );
}
