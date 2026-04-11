"use client";

import { useState } from "react";
import Editor from "@/components/editor";
import { SaveIndicator } from "@/components/save-indicator";
import { useAutoSave } from "@/hooks/use-auto-save";
import { ThemePicker } from "@/components/theme-picker";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  date: string;
  initialTitle: string;
  initialContent: any;
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function JournalEditor({ date, initialTitle, initialContent }: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [editorContent, setEditorContent] = useState({
    html: "",
    text: "",
    json: initialContent,
  });

  const saveStatus = useAutoSave({
    date,
    title,
    contentHtml: editorContent.html,
    contentText: editorContent.text,
    contentJson: editorContent.json,
  });

  const isToday = date === new Date().toLocaleDateString("en-CA");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-3 border-b border-border bg-background/80 backdrop-blur">
        <Link
          href="/journal"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Journal
        </Link>

        <div className="flex items-center gap-3">
          <SaveIndicator status={saveStatus} />
          <span className="text-xs text-muted-foreground">
            {isToday ? "Today" : formatDate(date)}
          </span>
          <ThemePicker />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-14">
        <input
          placeholder="Untitled"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-4xl font-bold bg-transparent outline-none text-foreground placeholder:text-muted-foreground/20 tracking-tight mb-3"
        />
        <p className="text-sm text-muted-foreground mb-8">{formatDate(date)}</p>
        <Editor content={initialContent} onChange={setEditorContent} />
      </main>
    </div>
  );
}