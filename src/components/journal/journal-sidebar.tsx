/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/jsx-no-comment-textnodes */
"use client";

import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, LayoutDashboard, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const CACHE_KEY = "withink_journal_buffer";
const BUFFER_SIZE = 20;

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
  entries: initialEntries,
  selectedDate,
  today,
  onSelect,
}: Props) {
  const [loadedEntries, setLoadedEntries] = useState<Entry[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(CACHE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Entry[];
        setLoadedEntries(parsed);
      } catch (e) {
        console.error("Archive hydration failed", e);
      }
    }
  }, []);

  const allEntries = useMemo(() => {
    const map = new Map<string, Entry>();

    loadedEntries.forEach((e) => map.set(e.date, e));

    initialEntries.forEach((e) => map.set(e.date, e));

    return Array.from(map.values()).sort((a, b) =>
      b.date.localeCompare(a.date),
    );
  }, [initialEntries, loadedEntries]);

  useEffect(() => {
    if (allEntries.length > 0) {
      const buffer = allEntries.slice(0, BUFFER_SIZE);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(buffer));
      } catch (e) {
        console.warn("Storage quota exceeded, purging oldest entries...");
        localStorage.removeItem(CACHE_KEY);
      }
    }
  }, [allEntries]);

  const fetchMoreEntries = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/entries?page=${nextPage}&limit=15`);
      const data = await res.json();

      if (data.entries.length === 0) {
        setHasMore(false);
      } else {
        setLoadedEntries((prev) => [...prev, ...data.entries]);
        setPage(nextPage);
        if (data.pagination && nextPage >= data.pagination.totalPages) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Failed to load more entries:", error);
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMoreEntries();
        }
      },
      { threshold: 1.0 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [fetchMoreEntries]);

  const grouped = groupByMonth(allEntries);
  const hasTodayEntry = allEntries.some((e) => e.date === today);

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 no-scrollbar pb-20">
        {/* DASHBOARD SECTION */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] px-2">
            Overview
          </p>
          <Button
            variant="ghost"
            onClick={() => onSelect(null)}
            className={cn(
              "w-full justify-start h-auto gap-4 px-4 py-4 rounded-2xl transition-all duration-300 shadow-none border border-transparent",
              selectedDate === null
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted/50",
            )}
          >
            <div
              className={cn(
                "p-2 rounded-xl",
                selectedDate === null ? "bg-background/10" : "bg-muted",
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-bold tracking-tight">
                Dashboard
              </span>
              <span className="text-[10px] opacity-60">System status</span>
            </div>
          </Button>
        </div>

        {/* TODAY SECTION */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] px-2">
            Active Entry
          </p>
          <Button
            variant="ghost"
            onClick={() => {
              const existingToday = allEntries.find((e) => e.date === today);
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
              "w-full h-auto text-left justify-start px-5 py-6 rounded-[1.75rem] transition-all duration-300 border shadow-none",
              selectedDate === today
                ? "bg-primary text-primary-foreground border-primary"
                : hasTodayEntry
                  ? "border-transparent bg-muted/40"
                  : "border-dashed border-border",
            )}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-0.5">
                <p className="text-base font-black tracking-tight">
                  {hasTodayEntry ? "Today's Log" : "New Archive"}
                </p>
                <p className="text-[11px] opacity-60">
                  {hasTodayEntry ? "Syncing thoughts..." : "Capture stream"}
                </p>
              </div>
              <div
                className={cn(
                  "h-2 w-2 rounded-full",
                  selectedDate === today
                    ? "bg-primary-foreground ring-4 ring-primary-foreground/20"
                    : "bg-primary ring-4 ring-primary/10",
                )}
              />
            </div>
          </Button>
        </div>

        {/* HISTORY SECTION */}
        <div className="space-y-4">
          {Object.entries(grouped).map(([monthKey, monthEntries]) => {
            const historicalEntries = monthEntries.filter(
              (e) => e.date !== today,
            );
            if (historicalEntries.length === 0) return null;

            const [tYear, tMonth] = today.split("-");
            const isCurrentMonth = monthKey === `${tYear}-${tMonth}`;
            const containsSelected = historicalEntries.some(
              (e) => e.date === selectedDate,
            );

            return (
              <Collapsible
                key={monthKey}
                defaultOpen={isCurrentMonth || containsSelected}
                className="space-y-2 group"
              >
                <div className="flex items-center justify-between px-2">
                  <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em]">
                    {formatMonthLabel(monthKey)}
                  </p>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]:rotate-180" />
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="space-y-1">
                  {historicalEntries.map((entry) => {
                    const isSelected = entry.date === selectedDate;
                    return (
                      <Button
                        key={entry.date}
                        variant="ghost"
                        onClick={() => onSelect(entry)}
                        className={cn(
                          "w-full h-auto text-left justify-start px-3 py-3 rounded-2xl transition-all flex items-center gap-4 border border-transparent shadow-none",
                          isSelected
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "hover:bg-muted/50 text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <div
                          className={cn(
                            "shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border transition-colors text-xs font-bold",
                            isSelected
                              ? "bg-primary-foreground/20 border-primary-foreground/20"
                              : "bg-muted border-transparent text-foreground",
                          )}
                        >
                          {entry.date.split("-")[2]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate leading-tight">
                            {entry.title || "Untitled Archive"}
                          </p>
                          <p
                            className={cn(
                              "text-[10px] truncate mt-1 opacity-60",
                              isSelected
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground",
                            )}
                          >
                            {entry.wordCount} words •{" "}
                            {entry.preview || "Empty.Archive"}
                          </p>
                        </div>
                      </Button>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>

        {/* INFINITE SCROLL LOADER */}
        <div ref={observerRef} className="py-4 flex justify-center">
          {isLoading && (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground opacity-50" />
          )}
          {!hasMore && allEntries.length > 10 && (
            <p className="text-[10px] font-mono text-muted-foreground/30 uppercase tracking-widest">
              // End_of_Sanctuary
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
