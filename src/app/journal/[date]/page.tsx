/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { JournalEditor } from "@/components/journal/journal-editor";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongoose";
import { Entry } from "@/models/entry";
import { safeDecrypt } from "@/lib/encryption";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ date: string }>;
  searchParams: Promise<{ today?: string }>;
}

export default async function JournalDatePage({ params, searchParams }: Props) {
  const { date } = await params;
  const { today: clientToday } = await searchParams;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) redirect("/home");

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  const today = clientToday || new Date().toISOString().split("T")[0];

  if (date > today) {
    return (
      <div className="min-h-[85vh] flex flex-col justify-center py-12 px-8 antialiased">
        <div className="w-full max-w-sm mx-auto space-y-10">
          <div className="space-y-3">
            <h1 className="text-5xl font-black tracking-tighter leading-[0.85]">
              Future is <br />
              <span className="text-primary/60 italic font-serif font-light text-6xl">
                unwritten.
              </span>
            </h1>
            <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.2em]">
              Time_Lock // Access_Denied
            </p>
          </div>

          <div className="space-y-8">
            <p className="text-muted-foreground font-mono text-xs tracking-widest leading-relaxed">
              This day hasn&apos;t arrived in your sanctuary yet. <br />
              <span className="text-foreground block mt-2 underline decoration-primary/40 underline-offset-4 italic">
                Patience is a form of ink.
              </span>
            </p>

            <div className="pt-4 space-y-4 text-center">
              <Link href={`/journal/${today}?today=${today}`} className="block">
                <Button className="w-full h-14 rounded-full font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden">
                  Return to Present
                </Button>
              </Link>

              <Link
                href="/home"
                className="inline-block text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors italic"
              >
                // Back_to_Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  await connectDB();

  const entry = await Entry.findOne({
    userId: session.user.id,
    date,
  }).lean();

  let decryptedContent = "";

  if (entry) {
    const rawJson = safeDecrypt((entry as any).contentJson);
    try {
      decryptedContent =
        (typeof rawJson === "string" && rawJson.startsWith("{")) ||
        rawJson.startsWith("[")
          ? JSON.parse(rawJson)
          : rawJson;
    } catch (e) {
      console.error("Failed to parse entry JSON:", e);
      decryptedContent = rawJson;
    }
  }

  return (
    <JournalEditor
      date={date}
      initialTitle={(entry as any)?.title ?? ""}
      initialContent={decryptedContent ?? ""}
    />
  );
}
