/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Editor from "@/components/editor";
import { SaveIndicator } from "@/components/journal/save-indicator";
import { useAutoSave } from "@/hooks/use-auto-save";
import { Toolbar } from "../editor/toolbar";
import Link from "next/link";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { MoodSelector } from "@/components/journal/mood-selector";

interface Props {
  date: string;
  initialTitle: string;
  initialContent: any;
  initialMood?: number;
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

export function JournalEditor({
  date,
  initialTitle,
  initialContent,
  initialMood,
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [mood, setMood] = useState<number | null>(initialMood || null);
  const [editorContent, setEditorContent] = useState({
    html: "",
    text: "",
    json: initialContent,
  });
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [toolbarBottom, setToolbarBottom] = useState(32);

  useEffect(() => {
    const topBuffer = 100;
    const bottomBuffer = toolbarBottom + 120;
    document.documentElement.style.scrollPaddingTop = `${topBuffer}px`;
    document.documentElement.style.scrollPaddingBottom = `${bottomBuffer}px`;

    const style = document.createElement("style");
    style.innerHTML = `
      .prose-container p, .prose-container div[contenteditable] > * {
        scroll-margin-top: ${topBuffer}px;
        scroll-margin-bottom: ${bottomBuffer}px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.documentElement.style.scrollPaddingTop = "0px";
      document.documentElement.style.scrollPaddingBottom = "0px";
      document.head.removeChild(style);
    };
  }, [toolbarBottom]);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const update = () => {
      const fromBottom =
        window.innerHeight - viewport.height - viewport.offsetTop;
      setToolbarBottom(Math.max(fromBottom, 0) + 24);
    };
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    update();
    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, []);

  const saveStatus = useAutoSave({
    date,
    title,
    mood,
    contentHtml: editorContent.html,
    contentText: editorContent.text,
    contentJson: editorContent.json,
  });

return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <div className="fixed top-0 left-0 right-0 z-20 h-20 bg-background/60 backdrop-blur-xl pointer-events-none" />

      <main className="max-w-3xl mx-auto px-6 pt-28 sm:pt-36 pb-[50vh] relative z-30">
        {/* 🚀 Main Vertical Stack */}
        <div className="flex flex-col">
          
          {/* 1. HEADER ROW: Title + Back Button */}
          <div className="flex items-start justify-between gap-4 w-full">
            <div className="flex-1">
              <input
                placeholder="Log_Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-4xl sm:text-6xl font-black bg-transparent outline-none text-foreground placeholder:text-muted-foreground/5 tracking-tighter leading-tight"
              />
            </div>

            <Link href="/home" className="shrink-0 mt-1 sm:mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-10 w-10 sm:h-12 sm:w-12 p-0 border border-border/40 bg-background/50 group hover:bg-foreground hover:text-background transition-all"
              >
                <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* 📊 METADATA BAR: Tucked directly under Title with mt-4/mt-6 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border/10 mt-4 sm:mt-6 pt-4 sm:pt-5">
            <div className="flex items-center gap-3">
              <div className="h-px w-6 bg-primary/30" />
              <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground/50 italic">
                // {formatDate(date)}
              </p>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 py-1.5 sm:px-0 sm:py-0 rounded-2xl bg-muted/5 sm:bg-transparent border border-border/5 sm:border-0 w-fit">
              <MoodSelector selected={mood} onSelect={setMood} />
            </div>
          </div>

          {/* ✍️ EDITOR AREA: Minimal gap from metadata bar */}
          <div className="prose-container mt-8 sm:mt-10">
            <Editor
              content={initialContent}
              onChange={setEditorContent}
              onEditorReady={setEditorInstance}
            />
          </div>
        </div>
      </main>

      {/* Floating Toolbar & Indicator */}
      <div className="fixed left-0 right-0 z-40 flex justify-center pointer-events-none transition-[bottom] duration-300 ease-out" style={{ bottom: toolbarBottom }}>
        {editorInstance && (
          <div className="pointer-events-auto max-w-[95vw] sm:max-w-prose overflow-x-auto rounded-2xl border border-border/50 bg-background/90 backdrop-blur-xl shadow-2xl p-1 mb-4 no-scrollbar">
            <Toolbar editor={editorInstance} />
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <SaveIndicator status={saveStatus} />
      </div>
    </div>
  );
}