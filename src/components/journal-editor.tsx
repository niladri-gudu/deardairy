/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Editor from "@/components/editor";
import { SaveIndicator } from "@/components/save-indicator";
import { useAutoSave } from "@/hooks/use-auto-save";
import { Toolbar } from "./editor/toolbar";

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
    const viewport = window.visualViewport;
    if (!viewport) return;

    const update = () => {
      const fromBottom =
        window.innerHeight - viewport.height - viewport.offsetTop;
      setToolbarBottom(fromBottom + 24);
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
    <div className="min-h-screen bg-background text-foreground pt-16">
      {/* <div className="fixed left-0 right-0 z-10 flex justify-center pointer-events-none bottom-8">
        {editorInstance && (
          <div
            className="pointer-events-auto max-w-[90vw] overflow-x-auto rounded-xl border border-border bg-background shadow-lg"
            style={{ scrollbarWidth: "none" }}
          >
            <Toolbar editor={editorInstance} />
          </div>
        )}
      </div> */}

      <main className="max-w-3xl mx-auto px-4 pt-14 pb-14">
        <div className="px-4">
          <input
            placeholder="Untitled"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-4xl font-bold bg-transparent outline-none text-foreground placeholder:text-muted-foreground/20 tracking-tight mb-3"
          />
          <p className="text-sm text-muted-foreground mb-8">
            {formatDate(date)}
          </p>
        </div>
        <Editor
          content={initialContent}
          onChange={setEditorContent}
          onEditorReady={setEditorInstance}
        />
      </main>

      <div
        className="fixed left-0 right-0 z-10 flex justify-center pointer-events-none"
        style={{ bottom: toolbarBottom }}
      >
        {editorInstance && (
          <div
            className="pointer-events-auto max-w-[90vw] overflow-x-auto rounded-xl border border-border bg-background shadow-lg"
            style={{ scrollbarWidth: "none" }}
          >
            <Toolbar editor={editorInstance} />
          </div>
        )}
      </div>

      {/* Save indicator — fixed bottom right */}
      <div className="fixed bottom-6 right-6 z-50">
        <SaveIndicator status={saveStatus} />
      </div>
    </div>
  );
}
