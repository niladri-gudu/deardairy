"use client";

import { LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface Entry {
  date: string;
  title: string;
  wordCount: number;
  preview: string;
  contentHtml: string;
}

interface Props {
  entries: Entry[];
  selectedDate: string | null;
  userName: string;
  today: string;
  onSelect: (entry: Entry | null) => void;
  onClose: () => void;
}

function groupByMonth(entries: Entry[]) {
  const groups: Record<string, Entry[]> = {};
  for (const entry of entries) {
    const [year, month] = entry.date.split("-");
    const key = `${year}-${month}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(entry);
  }
  return groups;
}

function formatMonthLabel(key: string) {
  const [year, month] = key.split("-");
  return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function JournalSidebar({
  entries,
  selectedDate,
  userName,
  today,
  onSelect,
}: Props) {
  const grouped = groupByMonth(entries);
  const hasTodayEntry = entries.some((e) => e.date === today);

  return (
    <div className="flex flex-col h-full bg-background/50">
      {/* Header */}
      {/* <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
        <div>
          <p className="text-sm font-bold tracking-tight text-foreground">
            {userName}
          </p>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-medium">
            {entries.length} Total Entries
          </p>
        </div>
        <Link href={`/journal/${today}`}>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-accent"
          >
            <PenLine className="h-4 w-4" />
          </Button>
        </Link>
      </div> */}

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 no-scrollbar">
        {/* 1. DASHBOARD SECTION */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] px-3 mb-2">
            Overview
          </p>
          <Button
            variant="ghost"
            onClick={() => onSelect(null)}
            className={cn(
              "w-full justify-start h-auto gap-3 px-4 py-3 rounded-2xl transition-all shadow-none", // Added h-auto and shadow-none
              selectedDate === null
                ? "bg-accent/80 text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="text-sm font-semibold">Dashboard</span>
          </Button>
        </div>

        {/* 2. TODAY SECTION */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] px-3 mb-2">
            Today
          </p>
          <Button
            variant="ghost"
            onClick={() => {
              const existingToday = entries.find((e) => e.date === today);
              onSelect(
                existingToday ?? {
                  date: today,
                  title: "",
                  wordCount: 0,
                  preview: "",
                  contentHtml: "",
                },
              );
            }}
            className={cn(
              "w-full h-auto text-left justify-start px-4 py-5 rounded-3xl transition-all duration-300 group border shadow-none",
              selectedDate === today
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-[0.98] hover:bg-primary/90" // Explicitly control hover when selected
                : hasTodayEntry
                  ? "border-transparent bg-accent/30 hover:bg-accent/60 text-foreground hover:scale-[1.01]"
                  : "border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary/90 hover:scale-[1.01]",
            )}
          >
            <div className="flex items-center justify-between w-full gap-2">
              <div className="flex flex-col gap-1">
                <p
                  className={cn(
                    "text-base font-black tracking-tight", // Larger, bolder text
                    selectedDate === today ? "text-primary-foreground" : "",
                  )}
                >
                  {hasTodayEntry ? "Today's Entry" : "Start Writing"}
                </p>
                <p
                  className={cn(
                    "text-[11px] font-medium opacity-70",
                    selectedDate === today
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground",
                  )}
                >
                  {hasTodayEntry
                    ? "Continue your reflection"
                    : "Capture your thoughts now"}
                </p>
              </div>

              <div
                className={cn(
                  "h-2.5 w-2.5 rounded-full ring-4 transition-all",
                  selectedDate === today
                    ? "bg-primary-foreground ring-primary-foreground/20"
                    : hasTodayEntry
                      ? "bg-primary ring-primary/10"
                      : "bg-primary animate-pulse ring-primary/20",
                )}
              />
            </div>
          </Button>
        </div>

        {/* 3. HISTORY SECTION */}
        <div className="space-y-6">
          {Object.entries(grouped).map(([monthKey, monthEntries]) => {
            const historicalEntries = monthEntries.filter(
              (e) => e.date !== today,
            );
            if (historicalEntries.length === 0) return null;

            return (
              <div key={monthKey} className="space-y-2">
                {/* Month Label */}
                <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] px-3">
                  {formatMonthLabel(monthKey)}
                </p>

                {/* Grouped Container - Optional: add a subtle background or border to group them visually */}
                <div className="space-y-1 bg-accent/5 rounded-3xl p-1.5 border border-border/20">
                  {historicalEntries.map((entry) => {
                    const isSelected = entry.date === selectedDate;

                    // Extract the Day (e.g., "15") from "2026-04-15"
                    const day = entry.date.split("-")[2];

                    return (
                      <Button
                        key={entry.date}
                        variant="ghost"
                        onClick={() => onSelect(entry)}
                        className={cn(
                          "w-full h-auto text-left justify-start px-4 py-3 rounded-[1.25rem] transition-all duration-200 group flex items-center gap-4 shadow-none",
                          isSelected
                            ? "bg-background text-foreground ring-1 ring-border/50"
                            : "hover:bg-background/50 text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {/* Date Circle */}
                        <div
                          className={cn(
                            "shrink-0 w-10 h-10 rounded-xl flex flex-col items-center justify-center border transition-colors",
                            isSelected
                              ? "bg-primary/5 border-primary/20 text-primary"
                              : "bg-muted/30 border-transparent group-hover:border-border",
                          )}
                        >
                          <span className="text-xs font-bold leading-none">
                            {day}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 text-left">
                          {" "}
                          {/* Added text-left */}
                          <p
                            className={cn(
                              "text-sm font-bold truncate leading-tight",
                              isSelected ? "text-foreground" : "",
                            )}
                          >
                            {entry.title || "Untitled"}
                          </p>
                          <p className="text-[11px] line-clamp-1 opacity-60 mt-1 font-medium leading-none">
                            {entry.wordCount} words •{" "}
                            {entry.preview || "No content"}
                          </p>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
