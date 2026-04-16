import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteEntryButton } from "@/components/journal/delete-entry-button";

interface Props {
  date: string;
  title: string;
  contentHtml: string;
  wordCount: number;
  today: string;
  onDeleteSuccess: () => void;
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

export function EntryPreview({
  date,
  title,
  contentHtml,
  wordCount,
  today,
  onDeleteSuccess,
}: Props) {
  const isToday = date === today;

  return (
    // Added 'group' here so the Delete button knows when to show up
    <div className="max-w-3xl mx-auto space-y-8 group">
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            {isToday && (
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary text-primary-foreground">
                Today
              </span>
            )}
            <p className="text-xs font-medium text-muted-foreground/80">
              {formatDate(date)}
            </p>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground leading-tight">
            {title || "Untitled"}
          </h1>
          <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
            {wordCount} words
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0 mt-2">
          <Link href={`/journal/${date}`}>
            <Button
              size="sm"
              className="rounded-full px-5 shadow-lg shadow-primary/10 font-bold tracking-tight"
            >
              <Pencil className="h-3.5 w-3.5 mr-2" />
              Edit
            </Button>
          </Link>

          <DeleteEntryButton date={date} onSuccess={onDeleteSuccess} />
        </div>
      </div>

      <div
        className="tiptap max-w-none text-foreground/90 text-lg leading-relaxed"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
