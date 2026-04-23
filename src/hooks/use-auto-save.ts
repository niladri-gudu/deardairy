/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface EntryData {
  date: string;
  title: string;
  contentHtml: string;
  contentText: string;
  contentJson: any;
}

export function useAutoSave(data: EntryData, debounceMs = 1500) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const latestData = useRef(data);

  const initialContent = useRef({
    title: data.title,
    html: data.contentHtml,
  });

  const isDirty = useRef(false);

  useEffect(() => {
    latestData.current = data;

    if (
      data.title !== initialContent.current.title ||
      data.contentHtml !== initialContent.current.html
    ) {
      isDirty.current = true;
    }
  }, [data]);

  useEffect(() => {
    if (!isDirty.current) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      setStatus("saving");
      try {
        const userLocalToday = new Date().toLocaleDateString("en-CA");
        const res = await fetch("/api/journal", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...latestData.current,
            userLocalToday,
          }),
        });

        if (!res.ok) throw new Error("Save failed");

        initialContent.current = {
          title: latestData.current.title,
          html: latestData.current.contentHtml,
        };

        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2000);
      } catch (err) {
        console.error("Autosave error:", err);
        setStatus("error");
      }
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data.title, data.contentText, data.contentHtml, debounceMs]);

  return status;
}
