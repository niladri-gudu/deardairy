"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { safeDecrypt } from "@/lib/encryption";
import { getCachedFlashbackEntries } from "@/lib/entry-cache";

export async function getRandomEntry() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  const entries = await getCachedFlashbackEntries(session.user.id);
  if (entries.length === 0) return null;

  const entry = entries[Math.floor(Math.random() * entries.length)];

  // 2. Decrypt the sensitive payload before it hits the UI
  // We use safeDecrypt to handle potential nulls or malformed data
  const decryptedEntry = {
    ...entry,
    _id: entry._id.toString(),
    contentText: safeDecrypt(entry.contentText || ""),
    contentHtml: safeDecrypt(entry.contentHtml || ""),
  };

  // 3. Return the clean, readable data
  return JSON.parse(JSON.stringify(decryptedEntry));
}
