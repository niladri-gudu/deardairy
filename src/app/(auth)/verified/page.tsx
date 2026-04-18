import { Suspense } from "react";
import { VerifiedContent } from "@/components/auth/verified-content";

export default function VerifiedPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-lg mx-auto px-4">
        <Suspense>
          <VerifiedContent />
        </Suspense>
      </div>
    </div>
  );
}