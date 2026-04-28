import { Flame } from "lucide-react";

interface StreakCounterProps {
  currentStreak: number;
  totalEntries: number;
}

export function StreakCounter({ currentStreak, totalEntries }: StreakCounterProps) {
  return (
    <div className="p-6 rounded-4xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-4 animate-in fade-in zoom-in duration-700">
      <div className="h-12 w-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
        <Flame className="text-white h-6 w-6" />
      </div>
      <div className="text-left">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-orange-500/60">
          Sanctuary.Streak
        </p>
        <h3 className="text-2xl font-black tracking-tight">
          {currentStreak}{" "}
          <span className="text-sm font-medium opacity-60">days</span>
        </h3>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {totalEntries} total archives synced
        </p>
      </div>
    </div>
  );
}