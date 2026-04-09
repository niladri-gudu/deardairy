import { Loader2, CheckCheck, WifiOff, Dot } from "lucide-react";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;

  return (
    <div className="flex items-center gap-1.5 text-xs tabular-nums transition-all">
      {status === "saving" && (
        <>
          <Loader2 className="h-3 w-3 animate-spin text-zinc-500" />
          <span className="text-zinc-500">Saving...</span>
        </>
      )}
      {status === "saved" && (
        <>
          <CheckCheck className="h-3 w-3 text-emerald-500" />
          <span className="text-emerald-500">Saved</span>
        </>
      )}
      {status === "error" && (
        <>
          <WifiOff className="h-3 w-3 text-red-400" />
          <span className="text-red-400">Save failed</span>
        </>
      )}
    </div>
  );
}