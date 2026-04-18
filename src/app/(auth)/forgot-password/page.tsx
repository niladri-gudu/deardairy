import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function Page() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-lg mx-auto px-4">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}