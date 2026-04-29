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
import { cn } from "@/lib/utils";

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
      const fromBottom = window.innerHeight - viewport.height - viewport.offsetTop;
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
    contentHtml: editorContent.html,
    contentText: editorContent.text,
    contentJson: editorContent.json,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      
      {/* GHOST HEADER: Background blur */}
      <div className="fixed top-0 left-0 right-0 z-20 h-20 bg-background/60 backdrop-blur-xl pointer-events-none" />

      <main className="max-w-3xl mx-auto px-6 pt-24 pb-[50vh] relative z-30">
        
        {/* 🚀 HEADER LAYOUT: Title/Date on Left, Go Back on Right */}
        <div className="flex items-start justify-between gap-8 mb-12">
          <div className="flex-1 space-y-2">
            <input
              placeholder="Untitled"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-4xl lg:text-5xl font-black bg-transparent outline-none text-foreground placeholder:text-muted-foreground/10 tracking-tighter leading-none"
            />
            <p className="text-sm text-muted-foreground font-medium italic opacity-70">
              {formatDate(date)}
            </p>
          </div>

          <Link href="/home" className="shrink-0 mt-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-full flex items-center gap-2 px-4 py-5 hover:bg-foreground hover:text-background transition-all border border-border/50 group"
            >
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]">Back</span>
            </Button>
          </Link>
        </div>

        <div className="prose-container">
          <Editor
            key={date}
            content={initialContent}
            onChange={setEditorContent}
            onEditorReady={setEditorInstance}
          />
        </div>
      </main>

      {/* Toolbar Container */}
      <div
        className="fixed left-0 right-0 z-40 flex justify-center pointer-events-none transition-[bottom] duration-300 ease-out"
        style={{ bottom: toolbarBottom }}
      >
        {editorInstance && (
          <div className="pointer-events-auto max-w-[95vw] overflow-x-auto rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl p-1 mb-4 no-scrollbar">
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