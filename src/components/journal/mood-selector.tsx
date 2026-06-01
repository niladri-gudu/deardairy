"use client";

import { Frown, Meh, Smile, SmilePlus, Angry } from "lucide-react";
import { cn } from "@/lib/utils";

const moods = [
  {
    value: 1,
    label: "Angry",
    icon: Angry,
    color: "hover:text-red-500",
    active: "text-red-500 bg-red-500/10",
  },
  {
    value: 2,
    label: "Sad",
    icon: Frown,
    color: "hover:text-orange-500",
    active: "text-orange-500 bg-orange-500/10",
  },
  {
    value: 3,
    label: "Neutral",
    icon: Meh,
    color: "hover:text-yellow-500",
    active: "text-yellow-500 bg-yellow-500/10",
  },
  {
    value: 4,
    label: "Happy",
    icon: Smile,
    color: "hover:text-green-500",
    active: "text-green-500 bg-green-500/10",
  },
  {
    value: 5,
    label: "Radiant",
    icon: SmilePlus,
    color: "hover:text-emerald-500",
    active: "text-emerald-500 bg-emerald-500/10",
  },
];

export function MoodSelector({
  selected,
  onSelect,
}: {
  selected: number | null;
  onSelect: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {moods.map((m) => (
        <button
          key={m.value}
          onClick={() => onSelect(m.value)}
          className={cn(
            "p-2 rounded-xl transition-all duration-300",
            selected === m.value
              ? m.active
              : "text-muted-foreground/30 hover:bg-muted",
          )}
        >
          <m.icon className="h-6 w-6" />
        </button>
      ))}
    </div>
  );
}