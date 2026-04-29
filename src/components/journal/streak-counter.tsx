import { Flame } from "lucide-react";

interface Props {
  currentStreak: number;
  totalEntries: number;
}

export function StreakCounter({ currentStreak, totalEntries }: Props) {
  return (
    <div className="flex items-center gap-6 group">
      <div className="h-16 w-16 rounded-3xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-inner transition-transform group-hover:scale-105">
        <Flame className="h-8 w-8 text-orange-500" />
      </div>
      <div className="text-left">
        <p className="text-[11px] font-mono uppercase tracking-[0.4em] text-muted-foreground/40 mb-1">
          Sanctuary.Streak
        </p>
        <p className="text-4xl font-black leading-none">
          {currentStreak} <span className="text-lg font-bold opacity-30 uppercase tracking-wide">Days</span>
        </p>
      </div>
    </div>
  );
}