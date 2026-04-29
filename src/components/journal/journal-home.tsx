/* eslint-disable react-hooks/purity */
"use client";
import { useMemo, useState } from "react";
import { JournalSidebar } from "@/components/journal/journal-sidebar";
import { EntryPreview } from "@/components/journal/entry-preview";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  PenLine,
  X,
  Search,
  History,
  Zap,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { StreakCounter } from "./streak-counter";
import { DigitalClock } from "./clock";
import { getRandomEntry } from "@/actions/flashback";
import Link from "next/link";

interface Entry {
  date: string;
  title: string;
  wordCount: number;
  preview: string;
  contentHtml: string;
}

interface Props {
  today: string;
  todayHtml: string;
  todayTitle: string;
  entries: Entry[];
  userName: string;
  streak: number;
  totalEntries: number;
}

export function JournalHome({
  today,
  entries: serverEntries,
  userName,
  streak,
  totalEntries,
}: Props) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isFetchingEntry, setIsFetchingEntry] = useState(false);
  const [entryCache, setEntryCache] = useState<Record<string, Entry>>({});

  const entries = useMemo(() => {
    const map = new Map<string, Entry>();
    serverEntries.forEach((e) => map.set(e.date, e));
    return Array.from(map.values());
  }, [serverEntries]);

  const stats = useMemo(() => {
    const total = entries.reduce((acc, curr) => acc + (curr.wordCount || 0), 0);
    const avg = entries.length > 0 ? Math.round(total / entries.length) : 0;
    return { total, avg };
  }, [entries]);

  const yesterdayDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  }, [today]);

  const todayEntry = useMemo(
    () => entries.find((e) => e.date === today),
    [entries, today],
  );
  const yesterdayEntry = useMemo(
    () => entries.find((e) => e.date === yesterdayDate),
    [entries, yesterdayDate],
  );

  const isExistingEntry = useMemo(() => {
    if (!selectedEntry) return false;
    return entries.some(
      (e) => e.date === selectedEntry.date && e.wordCount > 0,
    );
  }, [selectedEntry, entries]);

  const isWithinGracePeriod = useMemo(() => {
    if (!selectedEntry) return false;
    const entryDate = new Date(selectedEntry.date);
    const todayD = new Date(today);
    todayD.setHours(0, 0, 0, 0);
    const yesterdayD = new Date(todayD);
    yesterdayD.setDate(todayD.getDate() - 1);
    return (
      entryDate.toDateString() === todayD.toDateString() ||
      entryDate.toDateString() === yesterdayD.toDateString()
    );
  }, [selectedEntry, today]);

  const showDashboard = selectedEntry === null;
  const showEntryPreview = isExistingEntry && selectedEntry !== null;
  const showStartWriting =
    !isExistingEntry && isWithinGracePeriod && selectedEntry !== null;
  const showLockedState =
    !isExistingEntry && !isWithinGracePeriod && selectedEntry !== null;

  const handleSelect = async (entry: Entry | null) => {
    setIsMobileSidebarOpen(false);
    if (!entry) {
      setSelectedEntry(null);
      return;
    }
    if (entryCache[entry.date]) {
      setSelectedEntry(entryCache[entry.date]);
      return;
    }
    if (!entry.contentHtml && entry.wordCount > 0) {
      setIsFetchingEntry(true);
      try {
        const res = await fetch(`/api/entries?date=${entry.date}`);
        const data = await res.json();
        if (data.entry) {
          setEntryCache((prev) => ({ ...prev, [entry.date]: data.entry }));
          setSelectedEntry(data.entry);
        } else {
          setSelectedEntry(entry);
        }
      } catch (err) {
        toast.error("Protocol error.");
        setSelectedEntry(entry);
      } finally {
        setIsFetchingEntry(false);
      }
    } else {
      setSelectedEntry(entry);
    }
  };

  const handleDeleteSuccess = () => {
    if (selectedEntry) {
      const deletedDate = selectedEntry.date;
      const newCache = { ...entryCache };
      delete newCache[deletedDate];
      setEntryCache(newCache);
      toast.success("Archive purged.");
      if (deletedDate === today) {
        setSelectedEntry({
          date: today,
          title: "",
          wordCount: 0,
          preview: "",
          contentHtml: "",
        });
      } else {
        setSelectedEntry(null);
      }
    }
  };

  const userLocalToday = new Date().toLocaleDateString("en-CA");
  const randomPrompt = useMemo(
    () =>
      [
        "What was your biggest win today?",
        "What made you truly grateful?",
        "What's been on your mind lately?",
        "If today was a movie, what's its title?",
      ][Math.floor(Math.random() * 4)],
    [],
  );

  return (
    <div className="h-screen bg-background text-foreground overflow-hidden flex flex-col">
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 mt-16 overflow-hidden">
        <div className="flex gap-6 h-full">
          {isMobileSidebarOpen && (
            <div
              className="fixed inset-0 bg-background/90 backdrop-blur-md z-40 lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}
          <aside
            className={cn(
              "flex-col overflow-hidden transition-all duration-300 fixed inset-x-0 top-16 bottom-0 z-50 w-[85vw] max-w-[320px] lg:relative lg:top-0 lg:z-auto lg:inset-auto",
              isMobileSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0",
              isDesktopSidebarOpen ? "lg:flex lg:w-80" : "lg:hidden lg:w-0",
            )}
          >
            <div className="flex-1 overflow-hidden">
              <JournalSidebar
                entries={entries}
                selectedDate={selectedEntry?.date ?? null}
                userName={userName}
                today={today}
                onSelect={handleSelect}
                onClose={() => setIsMobileSidebarOpen(false)}
              />
            </div>
          </aside>

          <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-3 shrink-0 mb-2 lg:mb-4">
              <button
                onClick={() => setIsDesktopSidebarOpen((o) => !o)}
                className="hidden lg:flex p-2 rounded-xl text-muted-foreground hover:bg-muted/50 transition-all"
              >
                {isDesktopSidebarOpen ? (
                  <PanelLeftClose className="h-4 w-4" />
                ) : (
                  <PanelLeftOpen className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden flex p-2.5 rounded-xl bg-muted/50 text-foreground transition-all"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar px-1 lg:px-4 pb-10">
              {isFetchingEntry ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
                </div>
              ) : showDashboard ? (
                <div className="min-h-full flex flex-col space-y-12">
                  <div className="flex items-center justify-between py-6 lg:py-8 border-b border-border/40">
                    <StreakCounter
                      currentStreak={streak}
                      totalEntries={totalEntries}
                    />
                    <div className="hidden md:flex">
                      <DigitalClock />
                    </div>
                  </div>

                  {/* 🏛️ YESTERDAY ALERT: Only shows if Yesterday was missed */}
                  {!yesterdayEntry && (
                    <div className="animate-in slide-in-from-top-4 duration-700">
                      <Link
                        href={`/journal/${yesterdayDate}?today=${userLocalToday}`}
                      >
                        <Button
                          variant="ghost"
                          className="w-full bg-primary/3 border border-primary/10 rounded-4xl p-8 h-auto flex flex-col items-center gap-4 hover:bg-primary/[0.06] transition-all group"
                        >
                          <div className="flex items-center gap-3 text-primary">
                            <History className="h-5 w-5" />
                            <span className="text-xs font-mono uppercase tracking-[0.4em] font-bold">
                              Yesterday&apos;s node is still open
                            </span>
                          </div>
                          <p className="text-sm italic text-muted-foreground/60 px-4 text-center">
                            The system allows a 24-hour grace period. Would you
                            like to finalize this entry?
                          </p>
                          <div className="flex items-center gap-2 text-primary/40 group-hover:text-primary transition-colors">
                            <span className="text-[10px] font-mono uppercase tracking-widest">
                              Initialize.Session
                            </span>
                            <ArrowRight className="h-3 w-3 group-hover:translate-x-2 transition-transform" />
                          </div>
                        </Button>
                      </Link>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4 mt-8 lg:mt-12 px-2 md:px-0">
                    {/* ...cards logic same as before... */}
                    <div className="p-6 lg:p-8 rounded-[2rem] bg-muted/20 border border-border/40 opacity-60">
                      <Search className="h-5 w-5 mb-4 opacity-20" />
                      <p className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-30">
                        Archive.Search
                      </p>
                      <p className="text-sm mt-1 italic opacity-40 leading-tight">
                        Indexing pending...
                      </p>
                    </div>
                    <div
                      onClick={async () => {
                        setIsFetchingEntry(true);
                        const random = await getRandomEntry();
                        if (random) handleSelect(random);
                        setIsFetchingEntry(false);
                      }}
                      className="p-6 lg:p-8 rounded-[2rem] bg-muted/20 border border-border/40 hover:bg-muted/50 hover:border-primary/20 transition-all cursor-pointer group active:scale-95"
                    >
                      <History className="h-5 w-5 mb-4 opacity-40 group-hover:text-primary transition-colors" />
                      <p className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-30">
                        Archive.Flashback
                      </p>
                      <p className="text-sm mt-1 italic opacity-60 leading-tight">
                        Retrieve random node...
                      </p>
                    </div>
                    <div className="p-6 lg:p-8 rounded-[2rem] bg-muted/20 border border-border/40">
                      <Zap className="h-5 w-5 mb-4 text-yellow-500/60" />
                      <p className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-30">
                        System.Analysis
                      </p>
                      <p className="text-sm font-bold opacity-60">
                        {stats.total.toLocaleString()} words
                      </p>
                    </div>
                  </div>

                  {/* Clean footer - branding removed as requested */}
                  <div className="flex-1 flex flex-col items-center justify-center text-center mt-10 lg:mt-12 pb-16">
                    <div className="max-w-xs space-y-4">
                      <p className="text-xs italic text-muted-foreground/40 leading-relaxed px-6">
                        &quot;{randomPrompt}&quot;
                      </p>
                      <div className="opacity-10 pointer-events-none flex items-center justify-center gap-4">
                        <div className="h-px w-8 lg:w-12 bg-foreground" />
                        <p className="text-[8px] lg:text-[10px] font-mono uppercase tracking-[1em] ml-[1em]">
                          Encrypted
                        </p>
                        <div className="h-px w-8 lg:w-12 bg-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : showLockedState ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-700">
                  <div className="h-16 w-16 rounded-3xl bg-muted/50 flex items-center justify-center border border-border/50 opacity-20">
                    <X className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-black uppercase tracking-widest opacity-40">
                      Vault Locked
                    </h2>
                    <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground/60">
                      Historical creation protocol disabled.
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedEntry(null)}
                    className="rounded-full px-8 opacity-60 hover:bg-muted"
                  >
                    Return to Dashboard
                  </Button>
                </div>
              ) : showStartWriting ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-500">
                  <h2 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                    Today is a fresh start.
                  </h2>
                  <p className="text-sm lg:text-base italic text-muted-foreground/60 leading-relaxed px-4">
                    &quot;{randomPrompt}&quot;
                  </p>{" "}
                  <Link
                    href={`/journal/${selectedEntry?.date}?today=${userLocalToday}`}
                  >
                    <Button
                      size="lg"
                      className="rounded-full px-10 h-16 text-base font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-transform"
                    >
                      <PenLine className="mr-2 h-5 w-5" /> Start writing
                    </Button>
                  </Link>
                </div>
              ) : (
                <EntryPreview
                  date={selectedEntry!.date}
                  title={selectedEntry!.title}
                  contentHtml={selectedEntry!.contentHtml}
                  wordCount={selectedEntry!.wordCount}
                  today={today}
                  onDeleteSuccess={handleDeleteSuccess}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
