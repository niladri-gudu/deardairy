/* eslint-disable react-hooks/purity */
"use client";
import { useMemo, useState } from "react";
import { JournalSidebar } from "@/components/journal/journal-sidebar";
import { EntryPreview } from "@/components/journal/entry-preview";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Loader2,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  PenLine,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
}

export function JournalHome({ today, entries: serverEntries, userName }: Props) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isFetchingEntry, setIsFetchingEntry] = useState(false);
  
  // 🚀 Cache to store full decrypted entries fetched during this session
  const [entryCache, setEntryCache] = useState<Record<string, Entry>>({});

  // 🏛️ Deduplicate entries to prevent key errors
  const entries = useMemo(() => {
    const map = new Map<string, Entry>();
    serverEntries.forEach(e => map.set(e.date, e));
    return Array.from(map.values());
  }, [serverEntries]);

  const todayEntry = useMemo(
    () => entries.find((e) => e.date === today),
    [entries, today],
  );

  const handleSelect = async (entry: Entry | null) => {
    setIsMobileSidebarOpen(false);

    if (!entry) {
      setSelectedEntry(null);
      return;
    }

    // 1. New/Empty entry check
    if (!entry.title && !entry.contentHtml && entry.wordCount === 0) {
      setSelectedEntry(entry);
      return;
    }

    // 2. Cache Hit check
    if (entryCache[entry.date]) {
      setSelectedEntry(entryCache[entry.date]);
      return;
    }

    // 3. Option B: Targeted Fetch
    if (!entry.contentHtml) {
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
        toast.error("Decryption protocol failed.");
        setSelectedEntry(entry);
      } finally {
        setIsFetchingEntry(false);
      }
    } else {
      setSelectedEntry(entry);
    }
  };

  const isTodaySelected = selectedEntry?.date === today;
  const showStartWriting = !todayEntry && isTodaySelected;
  const showDashboard = selectedEntry === null;

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

  const handleDeleteSuccess = () => {
    if (selectedEntry) {
      const newCache = { ...entryCache };
      delete newCache[selectedEntry.date];
      setEntryCache(newCache);
    }
    setSelectedEntry(null);
  };

  const userLocalToday = new Date().toLocaleDateString("en-CA");

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6 h-[calc(100vh-6rem)]">
          {isMobileSidebarOpen && (
            <div
              className="fixed inset-0 bg-background/90 backdrop-blur-md z-40 lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}

          <aside
            className={cn(
              "flex-col overflow-hidden transition-all duration-300",
              "fixed inset-y-0 left-0 z-50 w-80 lg:relative lg:z-auto lg:inset-auto",
              isMobileSidebarOpen
                ? "flex translate-x-0"
                : "-translate-x-full lg:translate-x-0",
              isDesktopSidebarOpen ? "lg:flex lg:w-80" : "lg:hidden lg:w-0",
            )}
          >
            <div className="lg:hidden flex justify-end p-4 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

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

          <div className="flex-1 min-w-0 flex flex-col gap-3">
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsDesktopSidebarOpen((o) => !o)}
                className="hidden cursor-pointer lg:flex p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              >
                {isDesktopSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
              </button>

              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden flex p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar px-2 lg:px-4">
              {isFetchingEntry ? (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto animate-in fade-in duration-500">
                  <div className="space-y-4 opacity-40">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="text-[10px] font-mono uppercase tracking-[0.3em]">Decrypting Archive...</p>
                  </div>
                </div>
              ) : showDashboard ? (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                  <div className="bg-primary/5 p-8 rounded-full mb-6">
                    <LayoutDashboard className="h-10 w-10 text-primary opacity-40" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-black tracking-tight">Hey, {userName}</h2>
                  <p className="text-muted-foreground mt-3 text-lg leading-relaxed">
                    Ready to reflect? Select a past entry or start something new for today.
                  </p>
                </div>
              ) : showStartWriting ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-8 max-w-md mx-auto">
                  <div className="space-y-3">
                    <h2 className="text-3xl lg:text-4xl font-black tracking-tight">Today is a fresh start.</h2>
                    <p className="text-muted-foreground text-lg italic">&quot;{randomPrompt}&quot;</p>
                  </div>
                  <Link href={`/journal/${today}?today=${userLocalToday}`}>
                    <Button size="lg" className="rounded-full px-10 h-14 text-base font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-transform">
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