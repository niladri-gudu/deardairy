/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Entry } from "@/models/entry";
import { safeDecrypt } from "@/lib/encryption";
import JSZip from "jszip";

function extractImageUrls(contentHtml: string, contentJsonRaw: string): string[] {
  const urls = new Set<string>();

  // Scan decrypted HTML
  const imgRegex = /https:\/\/assets\.withink\.me\/[^\s"'<>)\\]+/gi;
  for (const url of contentHtml.match(imgRegex) ?? []) {
    urls.add(url);
  }

  // Walk Tiptap JSON tree
  try {
    const walk = (node: Record<string, any>) => {
      if (node?.type === "image" && typeof node?.attrs?.src === "string" && node.attrs.src.includes("assets.withink.me")) {
        urls.add(node.attrs.src);
      }
      if (Array.isArray(node?.content)) node.content.forEach(walk);
    };
    walk(JSON.parse(contentJsonRaw || "{}"));
  } catch {
    // malformed JSON — skip
  }

  return Array.from(urls);
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  try {
    const entries = await Entry.find({ userId: session.user.id }).sort({ date: -1 }).lean();

    const zip = new JSZip();
    const imgFolder = zip.folder("images")!;
    const downloadedImages = new Set<string>();

    for (const entry of entries as any[]) {
      const [year, monthNum] = entry.date.split("-");
      const monthName = new Date(Number(year), Number(monthNum) - 1).toLocaleDateString("en-US", { month: "long" });

      const contentHtml = safeDecrypt(entry.contentHtml) ?? "";
      const contentJsonRaw = safeDecrypt(entry.contentJson) ?? "";
      const contentText = safeDecrypt(entry.contentText) ?? "";

      zip.folder(year)?.folder(monthName)?.file(
        `${entry.date}.txt`,
        `TITLE: ${entry.title || "Untitled"}\n\n${contentText}`
      );

      for (const url of extractImageUrls(contentHtml, contentJsonRaw)) {
        if (downloadedImages.has(url)) continue;
        try {
          const res = await fetch(url, { cache: "no-store" });
          if (res.ok) {
            const buffer = await res.arrayBuffer();
            const fileName = new URL(url).pathname.split("/").pop() ?? `img-${Date.now()}.png`;
            imgFolder.file(fileName, buffer);
            downloadedImages.add(url);
          }
        } catch {
          // skip failed image
        }
      }
    }

    zip.file("metadata_backup.json", JSON.stringify(entries, null, 2));

    const blob = await zip.generateAsync({ type: "uint8array" });

    return new NextResponse(Buffer.from(blob), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="withink-sanctuary-export.zip"`,
      },
    });
  } catch (error: any) {
    console.error("Export error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}