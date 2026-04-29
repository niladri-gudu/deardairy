"use server";

import { connectDB } from "@/lib/mongoose";
import { Entry } from "@/models/entry";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { safeDecrypt } from "@/lib/encryption"; 

export async function getRandomEntry() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  await connectDB();

  // 1. Pick a random archive from the user's collection
  const randomEntries = await Entry.aggregate([
    { $match: { userId: session.user.id } },
    { $sample: { size: 1 } },
    { 
      $project: { 
        date: 1, 
        title: 1, 
        wordCount: 1, 
        contentText: 1, 
        contentHtml: 1 
      } 
    }
  ]);

  if (randomEntries.length === 0) return null;

  const entry = randomEntries[0];

  // 2. Decrypt the sensitive payload before it hits the UI
  // We use safeDecrypt to handle potential nulls or malformed data
  const decryptedEntry = {
    ...entry,
    _id: entry._id.toString(), // Ensure ID is a string for Next.js Client Components
    contentText: safeDecrypt(entry.contentText || ""),
    contentHtml: safeDecrypt(entry.contentHtml || ""),
  };

  // 3. Return the clean, readable data
  return JSON.parse(JSON.stringify(decryptedEntry));
}