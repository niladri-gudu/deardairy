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
  1: { icon: Angry, color: "text-red-500", label: "A rough one" },
  2: { icon: Frown, color: "text-orange-500", label: "Feeling a bit down" },
  3: { icon: Meh, color: "text-yellow-500", label: "Just getting by" },
  4: { icon: Smile, color: "text-green-500", label: "Doing pretty well" },
  5: { icon: SmilePlus, color: "text-emerald-500", label: "Best day ever" },
};

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
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
    <div className="max-w-4xl mx-auto pb-32 sm:pb-12 px-5 sm:px-6 md:px-8">
      <article className="space-y-6 sm:space-y-12">
        
        {/* Header Section */}
        <header className="space-y-4 sm:space-y-6 pt-4 sm:pt-0">
          <div className="flex items-center justify-between sm:justify-start sm:gap-4">
            <div className="flex items-center gap-2">
              {isToday && (
                <span className="bg-foreground text-background text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Today
                </span>
              )}
              <time className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-muted-foreground/60">
                {formatDate(date)}
              </time>
            </div>
            
            {MoodIcon && (
              <div className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/20 border border-border/5",
                moodConfig[mood!].color
              )}>
                <MoodIcon className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5px]" />
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-tight">
                  {moodConfig[mood!].label}
                </span>
              </div>
            )}
          </div>

          <h1 className="text-4xl sm:text-7xl font-black tracking-tightest leading-none sm:leading-[0.9] text-foreground wrap-break-word">
            {title || "Untitled"}
          </h1>

          <div className="flex items-center justify-between border-b border-border/10 pb-4 sm:pb-6">
            <span className="text-[9px] sm:text-xs font-mono uppercase tracking-widest opacity-30 italic">
              {wordCount} words
            </span>
            
            {/* Desktop Action Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <Link href={`/journal/${date}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full font-bold tracking-tight px-6 py-5 border border-border/40 hover:bg-foreground hover:text-background transition-all group/edit"
                >
                  <Pencil className="h-3.5 w-3.5 mr-2 group-hover/edit:rotate-12 transition-transform" />
                  <span className="text-[10px] font-mono uppercase tracking-widest">Edit</span>
                </Button>
              </Link>
              <DeleteEntryButton date={date} onSuccess={onDeleteSuccess} />
            </div>
          </div>
        </header>

        {/* Content Section */}
        <section 
          className="tiptap prose prose-neutral dark:prose-invert max-w-none 
          text-base sm:text-xl leading-[1.6] sm:leading-[1.7] text-foreground/90
          prose-p:mb-4 sm:prose-p:mb-6 prose-headings:tracking-tighter prose-headings:font-black"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>

      {/* Mobile Floating Action Bar - More "Dock" style */}
      <div className="sm:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-md z-50">
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-background/95 backdrop-blur-md border border-border/40 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <Link href={`/journal/${date}`} className="flex-2">
            <Button 
              variant="ghost"
              className="w-full rounded-full h-12 font-bold border border-transparent bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-95"
            >
              <Pencil className="h-4 w-4 mr-2" />
              <span className="text-[10px] font-mono uppercase tracking-widest">Edit</span>
            </Button>
          </Link>
          <div className="flex-1">
            <DeleteEntryButton date={date} onSuccess={onDeleteSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
}