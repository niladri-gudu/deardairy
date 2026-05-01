/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteEntryButton } from "@/components/journal/delete-entry-button";
import { Frown, Meh, Smile, SmilePlus, Angry } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  date: string;
  title: string;
  contentHtml: string;
  wordCount: number;
  mood: number | null;
  today: string;
  onDeleteSuccess: () => void;
}

const moodConfig: Record<number, { icon: any; color: string; label: string }> = {
  1: { icon: Angry, color: "text-red-500", label: "Critical" },
  2: { icon: Frown, color: "text-orange-500", label: "Low" },
  3: { icon: Meh, color: "text-yellow-500", label: "Neutral" },
  4: { icon: Smile, color: "text-green-500", label: "Stable" },
  5: { icon: SmilePlus, color: "text-emerald-500", label: "Optimal" },
};

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function EntryPreview({
  date,
  title,
  contentHtml,
  wordCount,
  mood,
  today,
  onDeleteSuccess,
}: Props) {
  const isToday = date === today;
  const MoodIcon = mood ? moodConfig[mood].icon : null;

  return (
    <div className="max-w-3xl mx-auto group px-4 sm:px-0 selection:bg-primary/10">
      <div className="flex flex-col gap-6 sm:gap-8">
        
        {/* 🏛️ HEADER BLOCK: Structured Meta & Title */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex-1 space-y-3 sm:space-y-4">
            
            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-3">
              {isToday && (
                <span className="text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-primary text-primary-foreground shadow-sm">
                  Active
                </span>
              )}
              <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground/40 italic">
                // {formatDate(date)}
              </p>

              {MoodIcon && (
                <>
                  <div className="hidden sm:block h-3 w-px bg-border/20" />
                  <div className={cn("flex items-center gap-2 px-2 py-0.5 rounded-md bg-muted/5 border border-border/5", moodConfig[mood!].color)}>
                    <MoodIcon className="h-3.5 w-3.5 stroke-[2.5px]" />
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest opacity-70">
                      {moodConfig[mood!].label}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-foreground leading-[1.1] sm:leading-[0.95] wrap-break-word">
              {title || "Untitled_Log"}
            </h1>

            {/* Word Count / Status */}
            <div className="flex items-center gap-3">
              <div className="h-px w-6 bg-primary/20" />
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.4em] text-muted-foreground/30 font-bold">
                {wordCount} Words Recorded
              </span>
            </div>
          </div>

          {/* 🛠️ ACTION GROUP */}
          <div className="flex items-center gap-2 sm:shrink-0 sm:pt-2">
            <Link href={`/journal/${date}`} className="flex-1 sm:flex-none">
              <Button
                variant="ghost"
                size="sm"
                className="w-full rounded-full font-bold tracking-tight px-6 py-5 border border-border/40 hover:bg-foreground hover:text-background transition-all group/btn"
              >
                <Pencil className="h-3.5 w-3.5 mr-2 group-hover/btn:rotate-12 transition-transform" />
                <span className="text-[10px] font-mono uppercase tracking-widest">Edit</span>
              </Button>
            </Link>
            <DeleteEntryButton date={date} onSuccess={onDeleteSuccess} />
          </div>
        </div>

        {/* ✍️ CONTENT AREA: Refined Typography */}
        <div
          className="tiptap max-w-none text-foreground/90 text-lg leading-relaxed border-t border-border/10 pt-8 sm:pt-12"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </div>
  );
}