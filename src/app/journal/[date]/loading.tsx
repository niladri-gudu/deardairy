import { Skeleton } from "@/components/ui/skeleton";

export default function EditorLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-16 overflow-hidden">
      <main className="max-w-3xl mx-auto px-4 pt-14 pb-40">
        {/* Header Skeleton: Title and Back Button */}
        <div className="flex items-start justify-between gap-4 px-4 mb-8">
          <div className="flex-1 space-y-3">
            {/* Title Placeholder */}
            <Skeleton className="h-10 w-3/4 opacity-20 rounded-lg" />
            {/* Date Placeholder */}
            <Skeleton className="h-4 w-40 opacity-10 rounded-md" />
          </div>

          {/* Back Button Placeholder */}
          <Skeleton className="h-9 w-24 rounded-full opacity-20 shrink-0" />
        </div>

        {/* Editor Body Skeleton */}
        <div className="px-4 space-y-6">
          <Skeleton className="h-5 w-full opacity-10" />
          <Skeleton className="h-5 w-[92%] opacity-10" />
          <Skeleton className="h-5 w-[96%] opacity-10" />
          <div className="pt-4 space-y-6">
            <Skeleton className="h-5 w-[88%] opacity-10" />
            <Skeleton className="h-5 w-full opacity-10" />
            <Skeleton className="h-5 w-[94%] opacity-10" />
          </div>
        </div>
      </main>

      {/* Floating Toolbar Placeholder */}
      <div className="fixed bottom-12 left-0 right-0 flex justify-center">
        <Skeleton className="h-14 w-[320px] max-w-[85vw] rounded-2xl border border-border/40 opacity-20 shadow-lg" />
      </div>

      {/* Save Indicator Placeholder */}
      <div className="fixed bottom-6 right-6">
        <Skeleton className="h-10 w-10 rounded-full opacity-10" />
      </div>
    </div>
  );
}