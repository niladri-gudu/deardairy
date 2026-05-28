"use client";

import { useMemo, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface Entry {
  date: string;
  mood: number | null;
  title: string;
  wordCount: number;
}

interface MoodHeatmapProps {
  entries: Entry[];
  today: string; // YYYY-MM-DD format
}

const moodLabels: Record<number, string> = {
  1: "Angry 😠",
  2: "Sad 😢",
  3: "Neutral 😐",
  4: "Happy 🙂",
  5: "Radiant 🌟",
};

export function MoodHeatmap({ entries, today }: MoodHeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredDay, setHoveredDay] = useState<{
    dateStr: string;
    mood: number | null;
    x: number;
    y: number;
  } | null>(null);

  // Generate 53 weeks of dates ending around today
  const weeks = useMemo(() => {
    const [year, month, day] = today.split("-").map(Number);
    const todayDate = new Date(year, month - 1, day);

    // Calculate start date: 364 days ago, then align to Sunday
    const startDate = new Date(todayDate);
    startDate.setDate(startDate.getDate() - 364);
    const startDayOfWeek = startDate.getDay(); // 0 = Sunday
    startDate.setDate(startDate.getDate() - startDayOfWeek);

    const dates: Date[] = [];
    const temp = new Date(startDate);
    for (let i = 0; i < 371; i++) {
      dates.push(new Date(temp));
      temp.setDate(temp.getDate() + 1);
    }

    const grouped: Date[][] = [];
    for (let i = 0; i < 53; i++) {
      grouped.push(dates.slice(i * 7, (i + 1) * 7));
    }
    return grouped;
  }, [today]);

  const entryMap = useMemo(() => {
    const map = new Map<string, Entry>();
    entries.forEach((e) => map.set(e.date, e));
    return map;
  }, [entries]);

  const monthLabels = useMemo(() => {
    const labels: { index: number; label: string }[] = [];
    let prevMonth = -1;
    weeks.forEach((week, i) => {
      const month = week[0].getMonth();
      if (month !== prevMonth) {
        labels.push({
          index: i,
          label: week[0].toLocaleDateString("en-US", { month: "short" }),
        });
        prevMonth = month;
      }
    });
    return labels;
  }, [weeks]);

  const formatDateString = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const getMoodColorClass = (mood: number | null) => {
    if (mood === null) return "bg-muted/15 border border-border/5 hover:bg-muted/30";
    switch (mood) {
      case 1:
        return "bg-primary/20 border border-primary/10 hover:bg-primary/35";
      case 2:
        return "bg-primary/40 border border-primary/25 hover:bg-primary/50";
      case 3:
        return "bg-primary/60 border border-primary/40 hover:bg-primary/70";
      case 4:
        return "bg-primary/80 border border-primary/60 hover:bg-primary/85";
      case 5:
        return "bg-primary border border-primary/80 hover:brightness-110";
      default:
        return "bg-muted/15 border border-border/5";
    }
  };

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    dateStr: string,
    mood: number | null
  ) => {
    const cell = e.currentTarget;
    const container = containerRef.current;
    if (!cell || !container) return;

    const cellRect = cell.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    setHoveredDay({
      dateStr,
      mood,
      x: cellRect.left - containerRect.left + cellRect.width / 2,
      y: cellRect.top - containerRect.top - 8,
    });
  };

  const formatTooltipDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full p-4 sm:p-6 lg:p-8 rounded-3xl lg:rounded-4xl bg-muted/20 border border-border/40 overflow-hidden"
    >
      <div className="flex flex-col space-y-4 min-w-0">
        {/* Title & Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-[10px] sm:text-xs font-mono font-bold text-muted-foreground/50 uppercase tracking-[0.2em] sm:tracking-[0.3em]">
              Mood.Trend.Telemetry
            </h3>
            <p className="text-xs sm:text-sm font-bold text-foreground mt-1">
              Visualized pattern of daily reflections
            </p>
          </div>

          {/* Simple Legend */}
          <div className="flex flex-wrap items-center justify-end gap-1.5 text-[8px] sm:text-[9px] font-mono text-muted-foreground/40 self-start sm:self-auto select-none">
            <span>Empty</span>
            <div className="h-2.5 w-2.5 rounded-[2px] bg-muted/15 border border-border/5" />
            <div className="h-2.5 w-2.5 rounded-[2px] bg-primary/20 border border-primary/10" />
            <div className="h-2.5 w-2.5 rounded-[2px] bg-primary/45 border border-primary/25" />
            <div className="h-2.5 w-2.5 rounded-[2px] bg-primary/70 border border-primary/45" />
            <div className="h-2.5 w-2.5 rounded-[2px] bg-primary/85 border border-primary/65" />
            <div className="h-2.5 w-2.5 rounded-[2px] bg-primary border border-primary/80" />
            <span>Radiant</span>
          </div>
        </div>

        {/* Heatmap Area */}
        <div className="relative">
          <div className="flex overflow-x-auto pb-2 select-none -mx-1 px-1">
            {/* Day of Week Labels */}
            <div className="grid grid-rows-7 gap-[3px] text-[8px] sm:text-[9px] font-mono text-muted-foreground/35 select-none pr-2 shrink-0 pt-5 sticky left-0 bg-background/80 backdrop-blur-sm z-10">
              <span className="h-2.5 flex items-center leading-none">Sun</span>
              <span className="h-2.5 flex items-center leading-none invisible">Mon</span>
              <span className="h-2.5 flex items-center leading-none">Tue</span>
              <span className="h-2.5 flex items-center leading-none invisible">Wed</span>
              <span className="h-2.5 flex items-center leading-none">Thu</span>
              <span className="h-2.5 flex items-center leading-none invisible">Fri</span>
              <span className="h-2.5 flex items-center leading-none">Sat</span>
            </div>

            {/* Scrolling Grid (Month labels + columns) */}
            <div className="flex flex-col min-w-0">
              {/* Months Row */}
              <div className="h-5 relative text-[9px] font-mono text-muted-foreground/45 shrink-0">
                {monthLabels.map(({ index, label }, i) => {
                  // Avoid overlap on small scroll distances
                  if (i > 0 && index - monthLabels[i - 1].index < 3) return null;
                  return (
                    <span
                      key={index}
                      className="absolute leading-none"
                      style={{ left: `${index * 13}px` }} // 10px cell + 3px gap
                    >
                      {label}
                    </span>
                  );
                })}
              </div>

              {/* Columns Row */}
              <div className="flex gap-[3px] shrink-0">
                {weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="grid grid-rows-7 gap-[3px]">
                    {week.map((day, dayIdx) => {
                      const dateStr = formatDateString(day);
                      const entry = entryMap.get(dateStr);
                      const mood = entry ? entry.mood : null;

                      return (
                        <div
                          key={dayIdx}
                          onMouseEnter={(e) => handleMouseEnter(e, dateStr, mood)}
                          onMouseLeave={() => setHoveredDay(null)}
                          className={cn(
                            "h-2.5 w-2.5 rounded-[2px] cursor-pointer transition-colors duration-150 shrink-0",
                            getMoodColorClass(mood)
                          )}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Tooltip */}
      {hoveredDay && (
        <div
          className="absolute z-50 -translate-x-1/2 -translate-y-full bg-popover border border-border/50 text-popover-foreground text-[10px] font-mono rounded-xl px-3 py-2 shadow-xl pointer-events-none transition-all duration-200"
          style={{ left: hoveredDay.x, top: hoveredDay.y }}
        >
          <p className="font-bold tracking-tight text-foreground">
            {formatTooltipDate(hoveredDay.dateStr)}
          </p>
          <p className="text-[9px] text-muted-foreground mt-0.5 font-medium uppercase tracking-wider">
            {hoveredDay.mood !== null
              ? moodLabels[hoveredDay.mood] || "Logged"
              : "No Entry"}
          </p>
        </div>
      )}
    </div>
  );
}
