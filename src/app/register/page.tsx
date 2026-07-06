import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AuthShell } from "@/components/AuthShell";
import { RegisterForm } from "@/components/forms/RegisterForm";

export default async function RegisterPage() {
  if (await getSession()) redirect("/dashboard");

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start supervising or submitting capstone work."
    >
      <RegisterForm />
    </AuthShell>
  );
}
