"use client";

import { useState } from "react";
import { JournalSidebar } from "@/components/journal-sidebar";
import { EntryPreview } from "@/components/entry-preview";

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

export function JournalHome({ today, entries, userName }: Props) {
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(
    () => entries.find((e) => e.date === today) ?? entries[0] ?? null
  );

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* We use rounded-3xl for that ultra-modern "roundy" feel */}
        <div className="flex gap-6 h-[calc(100vh-8rem)]">

          {/* Sidebar Container */}
          <aside className="w-80 shrink-0 border border-border rounded-[2rem] overflow-hidden flex flex-col bg-card/50">
            <JournalSidebar
              entries={entries}
              selectedDate={selectedEntry?.date ?? null}
              userName={userName}
              today={today}
              onSelect={setSelectedEntry}
              onClose={() => {}}
            />
          </aside>

          {/* Preview Panel Container */}
          <div className="flex-1 border border-border rounded-[2rem] overflow-hidden bg-card/50 flex flex-col">
            <div className="flex-1 overflow-y-auto p-10">
              {selectedEntry ? (
                <EntryPreview
                  date={selectedEntry.date}
                  title={selectedEntry.title}
                  contentHtml={selectedEntry.contentHtml}
                  wordCount={selectedEntry.wordCount}
                  today={today}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">Select an entry to read it.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}