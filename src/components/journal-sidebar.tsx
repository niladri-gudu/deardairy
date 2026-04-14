"use client";

import { PenLine, X } from "lucide-react";
import Link from "next/link";
import { getLocalDateString } from "@/lib/utils/date";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

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
  onSelect: (entry: Entry) => void;
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
  return new Date(Number(year), Number(month) - 1).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" }
  );
}

export function JournalSidebar({ entries, selectedDate, userName, today, onSelect }: Props) {
  const grouped = groupByMonth(entries);

  return (
    <div className="flex flex-col h-full bg-background/50">
      <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
        <div>
          <p className="text-sm font-bold tracking-tight text-foreground">{userName}</p>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-medium">
            {entries.length} Entries
          </p>
        </div>
        <Link href={`/journal/${today}`}>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent">
            <PenLine className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {Object.entries(grouped).map(([monthKey, monthEntries]) => (
          <div key={monthKey}>
            <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] px-3 mb-2">
              {formatMonthLabel(monthKey)}
            </p>
            <div className="space-y-1">
              {monthEntries.map((entry) => {
                const isSelected = entry.date === selectedDate;
                return (
                  <button
                    key={entry.date}
                    onClick={() => onSelect(entry)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 group",
                      isSelected 
                        ? "bg-accent text-accent-foreground shadow-sm" 
                        : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn("text-sm font-semibold truncate", isSelected ? "text-foreground" : "")}>
                        {entry.title || "Untitled"}
                      </p>
                      {entry.date === today && (
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-xs line-clamp-1 opacity-70 mt-0.5">
                      {entry.preview || "No content yet"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}