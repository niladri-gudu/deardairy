import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongoose";
import { Entry } from "@/models/entry";
import Link from "next/link";
import { PenLine } from "lucide-react";
import { getLocalDateString } from "@/lib/utils/date";

export default async function JournalPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  await connectDB();

  const today = getLocalDateString();

  const entries = await Entry.find(
    { userId: session.user.id },
    { date: 1, title: 1, wordCount: 1 },
  )
    .sort({ date: -1 })
    .limit(10)
    .lean();

  const todayEntry = (entries as any[]).find((e) => e.date === today);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-2xl mx-auto px-6 py-16 space-y-12">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Hey, {session.user.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <Link href={`/journal/${today}`}>
          <div className="group border border-border hover:border-border/80 rounded-2xl p-6 transition-all cursor-pointer bg-card/30 hover:bg-card/60">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-widest">
                  Today
                </p>
                {todayEntry ? (
                  <>
                    <p className="text-lg font-medium text-foreground">
                      {(todayEntry as any).title || "Untitled"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(todayEntry as any).wordCount} words
                    </p>
                  </>
                ) : (
                  <p className="text-lg font-medium text-muted-foreground">
                    Write today&apos;s entry
                  </p>
                )}
              </div>
              <PenLine className="h-5 w-5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
            </div>
          </div>
        </Link>

        {entries.filter((e) => e.date !== today).length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs text-muted-foreground uppercase tracking-widest">
              Recent
            </h2>
            <div className="space-y-1">
              {(entries as any[])
                .filter((e) => e.date !== today)
                .map((entry) => (
                  <Link key={entry.date} href={`/journal/${entry.date}`}>
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-accent/30 transition-all group border border-transparent hover:border-border">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors">
                          {entry.title || "Untitled"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(
                            entry.date + "T00:00:00",
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {entry.wordCount} words
                      </span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
