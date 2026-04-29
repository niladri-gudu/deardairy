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

  const todayEntry = useMemo(
    () => entries.find((e) => e.date === today),
    [entries, today],
  );

  const handleSelect = async (entry: Entry | null) => {
    setIsMobileSidebarOpen(false);
    if (!entry) { setSelectedEntry(null); return; }
    if (!entry.title && !entry.contentHtml && entry.wordCount === 0) {
      setSelectedEntry(entry); return;
    }
    if (entryCache[entry.date]) {
      setSelectedEntry(entryCache[entry.date]); return;
    }
    if (!entry.contentHtml) {
      setIsFetchingEntry(true);
      try {
        const res = await fetch(`/api/entries?date=${entry.date}`);
        const data = await res.json();
        if (data.entry) {
          setEntryCache((prev) => ({ ...prev, [entry.date]: data.entry }));
          setSelectedEntry(data.entry);
        } else { setSelectedEntry(entry); }
      } catch (err) {
        toast.error("Decryption protocol failed.");
        setSelectedEntry(entry);
      } finally { setIsFetchingEntry(false); }
    } else { setSelectedEntry(entry); }
  };

  const handleDeleteSuccess = () => {
    if (selectedEntry) {
      const deletedDate = selectedEntry.date;
      const newCache = { ...entryCache };
      delete newCache[deletedDate];
      setEntryCache(newCache);
      toast.success("Archive purged.");

      // 🚀 LOGIC: If we deleted TODAY's entry, show the 'Start Writing' view
      if (deletedDate === today) {
        setSelectedEntry({
            date: today,
            title: "",
            wordCount: 0,
            preview: "",
            contentHtml: "",
          });
      } else {
        setSelectedEntry(null); // Otherwise go back to dashboard
      }
    }
  };

  const isTodaySelected = selectedEntry?.date === today;
  const showStartWriting = !todayEntry && isTodaySelected;
  const showDashboard = selectedEntry === null;
  const userLocalToday = new Date().toLocaleDateString("en-CA");

  const prompts = [
    "What's one thing you're grateful for today?",
    "Describe a small win from the last 24 hours.",
    "What's been on your mind lately?",
    "If today was a movie, what would the title be?",
  ];

  const randomPrompt = useMemo(
    () => prompts[Math.floor(Math.random() * prompts.length)],
    [],
  );

  return (
    <div className="h-screen bg-background text-foreground overflow-hidden flex flex-col">
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 mt-16 overflow-hidden">
        <div className="flex gap-6 h-full">
          
          {isMobileSidebarOpen && (
            <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-40 lg:hidden" onClick={() => setIsMobileSidebarOpen(false)} />
          )}

          <aside className={cn(
            "flex-col overflow-hidden transition-all duration-300",
            "fixed inset-x-0 top-16 bottom-0 z-50 w-[85vw] max-w-[320px] lg:relative lg:top-0 lg:z-auto lg:inset-auto",
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
            isDesktopSidebarOpen ? "lg:flex lg:w-80" : "lg:hidden lg:w-0",
          )}>
            <div className="flex-1 overflow-hidden">
              <JournalSidebar entries={entries} selectedDate={selectedEntry?.date ?? null} userName={userName} today={today} onSelect={handleSelect} onClose={() => setIsMobileSidebarOpen(false)} />
            </div>
          </aside>

          <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-3 shrink-0 mb-2 lg:mb-4">
              <button onClick={() => setIsDesktopSidebarOpen((o) => !o)} className="hidden lg:flex p-2 rounded-xl text-muted-foreground hover:bg-muted/50 transition-all">
                {isDesktopSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
              </button>
              <button onClick={() => setIsMobileSidebarOpen(true)} className="lg:hidden flex p-2.5 rounded-xl bg-muted/50 text-foreground transition-all">
                <Menu className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar px-1 lg:px-4 pb-10">
              {isFetchingEntry ? (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto animate-in fade-in duration-500">
                  <div className="space-y-4 opacity-40">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="text-[10px] font-mono uppercase tracking-[0.3em]">Decrypting...</p>
                  </div>
                </div>
              ) : showDashboard ? (
                <div className="min-h-full flex flex-col">
                  
                  <div className="flex items-center justify-between py-6 lg:py-8 border-b border-border/40">
                    <div className="flex justify-start">
                      <StreakCounter currentStreak={streak} totalEntries={totalEntries} />
                    </div>
                    <div className="hidden md:flex justify-end">
                      <DigitalClock />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4 mt-8 lg:mt-12 px-2 md:px-0">
                    <div className="p-6 lg:p-8 rounded-[2rem] bg-muted/20 border border-border/40 transition-all opacity-60">
                      <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-background flex items-center justify-center mb-4 border border-border/50">
                        <Search className="h-5 w-5 opacity-20" />
                      </div>
                      <p className="text-[9px] lg:text-[10px] font-mono uppercase tracking-[0.4em] opacity-30">Archive.Search</p>
                      <p className="text-sm mt-1 font-medium italic opacity-40 leading-tight">Indexing pending...</p>
                    </div>

                    <div 
                      onClick={async () => {
                        setIsFetchingEntry(true);
                        try {
                          const randomEntry = await getRandomEntry();
                          if (randomEntry) handleSelect(randomEntry);
                        } finally {
                          setIsFetchingEntry(false);
                        }
                      }}
                      className="p-6 lg:p-8 rounded-[2rem] bg-muted/20 border border-border/40 hover:bg-muted/50 hover:border-primary/20 transition-all cursor-pointer group active:scale-95"
                    >
                      <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-background flex items-center justify-center mb-4 border border-border/50 group-hover:border-primary/30">
                        <History className="h-5 w-5 opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all" />
                      </div>
                      <p className="text-[9px] lg:text-[10px] font-mono uppercase tracking-[0.4em] opacity-30">Archive.Flashback</p>
                      <p className="text-sm mt-1 font-medium italic opacity-60 leading-tight">Retrieve random node...</p>
                    </div>

                    <div className="p-6 lg:p-8 rounded-[2rem] bg-muted/20 border border-border/40 transition-all">
                      <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-background flex items-center justify-center mb-4 border border-border/50">
                        <Zap className="h-5 w-5 text-yellow-500/60" />
                      </div>
                      <p className="text-[9px] lg:text-[10px] font-mono uppercase tracking-[0.4em] opacity-30 mb-2">System.Analysis</p>
                      <div className="space-y-1">
                        <p className="text-sm font-medium italic opacity-60 leading-tight">
                          <span className="font-bold text-foreground opacity-100">{stats.total.toLocaleString()}</span> words
                        </p>
                        <p className="text-[9px] font-mono uppercase tracking-widest opacity-30">Avg: {stats.avg} / log</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center text-center mt-10 lg:mt-12 pb-16">
                    <div className="max-w-xs space-y-4 lg:space-y-6">
                      <p className="text-xs lg:text-sm italic text-muted-foreground/60 leading-relaxed px-6">
                        &quot;{randomPrompt}&quot;
                      </p>
                      <div className="opacity-10 pointer-events-none flex items-center justify-center gap-4">
                        <div className="h-px w-8 lg:w-12 bg-foreground" />
                        <p className="text-[8px] lg:text-[10px] font-mono uppercase tracking-[1em] ml-[1em]">Encrypted</p>
                        <div className="h-px w-8 lg:w-12 bg-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : showStartWriting ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-8 max-w-md mx-auto animate-in fade-in zoom-in duration-500">
                  <div className="space-y-3">
                    <h2 className="text-3xl lg:text-4xl font-black tracking-tight">Today is a fresh start.</h2>
                    <p className="text-muted-foreground text-lg italic">&quot;{randomPrompt}&quot;</p>
                  </div>
                  <Link href={`/journal/${today}?today=${userLocalToday}`}>
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