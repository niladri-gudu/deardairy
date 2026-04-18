import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function Page() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-lg mx-auto px-4">
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}