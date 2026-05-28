/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { getLocalDateString } from "@/lib/utils/date";

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface EntryData {
  date: string;
  title: string;
  mood: number | null;
  contentHtml: string;
  contentText: string;
  contentJson: any;
}

export function useAutoSave(data: EntryData, debounceMs = 1500, enabled = true) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasStartedRef = useRef(false);

  const latestData = useRef(data);

  const initialContent = useRef({
    title: data.title,
    html: data.contentHtml,
    text: data.contentText,
    json: data.contentJson,
    mood: data.mood,
  });

  const isDirty = useRef(false);

  useEffect(() => {
    latestData.current = data;
    if (!enabled) return;

    if (!hasStartedRef.current) {
      initialContent.current = {
        title: data.title,
        html: data.contentHtml,
        text: data.contentText,
        json: data.contentJson,
        mood: data.mood,
      };
      hasStartedRef.current = true;
      return;
    }

    if (
      data.title !== initialContent.current.title ||
      data.contentHtml !== initialContent.current.html ||
      data.contentText !== initialContent.current.text ||
      data.contentJson !== initialContent.current.json ||
      data.mood !== initialContent.current.mood
    ) {
      isDirty.current = true;
    }
  }, [data, enabled]);

  useEffect(() => {
    if (!enabled) return;
    if (!isDirty.current) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      setStatus("saving");
      try {
        const userLocalToday = getLocalDateString();
        const res = await fetch("/api/entries", {
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
          text: latestData.current.contentText,
          json: latestData.current.contentJson,
          mood: latestData.current.mood,
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
  }, [
    data.title,
    data.contentText,
    data.contentHtml,
    data.contentJson,
    data.mood,
    debounceMs,
    enabled,
  ]);

  return status;
}
