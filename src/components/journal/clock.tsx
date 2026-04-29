"use client";
import { useState, useEffect } from "react";

export function DigitalClock() {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { 
        hour: "2-digit", 
        minute: "2-digit",
        hour12: true 
      }).toUpperCase());
      setDate(now.toLocaleDateString("en-US", {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }).toUpperCase());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-end">
      <p className="text-[11px] font-mono uppercase tracking-[0.4em] text-muted-foreground/40 mb-1">
        {date || "LOADING..."}
      </p>
      <span className="text-4xl font-mono font-black tracking-tighter tabular-nums leading-none">
        {time || "00:00"}
      </span>
    </div>
  );
}