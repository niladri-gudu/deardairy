import { SigninForm } from "@/components/auth/signin-form";

export default function Page() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-lg mx-auto px-4">
        <SigninForm />
      </div>
    </div>
  );
}