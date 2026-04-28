import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function JournalLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6 h-[calc(100vh-6rem)]">
          
          {/* Sidebar Skeleton - Matches JournalSidebar structure */}
          <aside className="hidden lg:flex flex-col w-80 shrink-0 gap-6 border-r border-border/10 pr-6">
            <div className="flex items-center justify-between px-2 mb-4">
              <div className="space-y-2">
                 <Skeleton className="h-6 w-24 rounded-md opacity-20" />
                 <Skeleton className="h-3 w-16 opacity-10" />
              </div>
              <Skeleton className="h-10 w-10 rounded-xl opacity-20" />
            </div>

            <div className="space-y-4 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className="p-5 space-y-3 border border-border/40 bg-card/30 backdrop-blur-sm rounded-[24px]"
                >
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-3 w-20 opacity-20" />
                    <Skeleton className="h-2 w-8 opacity-10" />
                  </div>
                  <Skeleton className="h-4 w-full opacity-10" />
                  <Skeleton className="h-3 w-2/3 opacity-5" />
                </div>
              ))}
            </div>
          </aside>

          {/* Main Content Skeleton - Matches JournalHome layout */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Header toggle area */}
            <div className="flex items-center gap-3 shrink-0 h-10">
              <Skeleton className="h-8 w-8 rounded-xl opacity-20" />
            </div>

            {/* Centered Dashboard Placeholder */}
            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto w-full">
              {/* Pulsing Icon Circle */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl animate-pulse" />
                <Skeleton className="relative h-28 w-28 rounded-full opacity-10 border border-primary/10" />
              </div>

              <div className="space-y-4 w-full">
                {/* Greeting Line */}
                <Skeleton className="h-10 w-2/3 mx-auto opacity-20 rounded-xl" />
                
                {/* Description Lines */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full mx-auto opacity-10" />
                  <Skeleton className="h-4 w-[85%] mx-auto opacity-10" />
                </div>

                {/* Optional: Placeholder for the 'Start Writing' button area */}
                <div className="pt-6">
                  <Skeleton className="h-14 w-44 mx-auto rounded-full opacity-10" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}