import { SignupForm } from "@/components/auth/signup-form";

export default function Page() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-lg mx-auto px-4">
        <SignupForm />
      </div>
    </div>
  );
}