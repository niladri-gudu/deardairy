/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Entry } from "@/models/entry";
import { encrypt, safeDecrypt } from "@/lib/encryption";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { date, title, contentHtml, contentText, contentJson, userLocalToday } =
    await req.json();

  if (!date || !userLocalToday)
    return NextResponse.json({ error: "Date information missing" }, { status: 400 });

  await connectDB();

  // 🏛️ 1. Check if the entry already exists
  const existingEntry = await Entry.findOne({ userId: session.user.id, date });

  // 🏛️ 2. Apply Grace Period ONLY for NEW entries
  if (!existingEntry) {
    const todayDate = new Date(userLocalToday);
    const yesterdayDate = new Date(todayDate);
    yesterdayDate.setDate(todayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

    // Block future dates
    if (date > userLocalToday) {
      return NextResponse.json({ error: "The future is unwritten." }, { status: 403 });
    }

    // Block creation of old entries
    if (date < yesterdayStr) {
      return NextResponse.json({ error: "Grace period expired for new entries." }, { status: 403 });
    }
  }

  // 🏛️ 3. Proceed with Update or Create
  const updateFields: any = {};
  if (title !== undefined) updateFields.title = title;
  
  if (contentHtml) {
    updateFields.contentHtml = encrypt(contentHtml);
  }
  
  if (contentText) {
    updateFields.contentText = encrypt(contentText);
    updateFields.wordCount = contentText.trim().split(/\s+/).filter(Boolean).length;
  }

  if (contentJson) {
    updateFields.contentJson = encrypt(JSON.stringify(contentJson));
  }

  const entry = await Entry.findOneAndUpdate(
    { userId: session.user.id, date },
    {
      $set: updateFields,
      $setOnInsert: { userId: session.user.id, date },
    },
    { upsert: true, new: true, lean: true },
  );

  // Decrypt for response
  if (entry) {
    entry.contentHtml = safeDecrypt(entry.contentHtml);
    entry.contentText = safeDecrypt(entry.contentText);
    const decryptedJson = safeDecrypt(entry.contentJson);
    try {
      entry.contentJson = decryptedJson ? JSON.parse(decryptedJson) : null;
    } catch (e) {
      entry.contentJson = decryptedJson;
    }
  }

  return NextResponse.json({ entry });
}

// GET handler remains largely the same but ensure userLocalToday is handled if needed
export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  await connectDB();

  if (date) {
    const entry = await Entry.findOne({ userId: session.user.id, date }).lean();
    if (entry) {
      entry.contentHtml = safeDecrypt(entry.contentHtml);
      entry.contentText = safeDecrypt(entry.contentText);
      const decryptedJson = safeDecrypt(entry.contentJson);
      try {
        entry.contentJson = decryptedJson ? JSON.parse(decryptedJson) : null;
      } catch (e) {
        entry.contentJson = decryptedJson;
      }
    }
    return NextResponse.json({ entry });
  }

  const [entries, total] = await Promise.all([
    Entry.find(
      { userId: session.user.id },
      { date: 1, title: 1, wordCount: 1, contentText: 1, contentHtml: 1 },
    )
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Entry.countDocuments({ userId: session.user.id }),
  ]);

  const decryptedEntries = entries.map((entry) => {
    const decryptedText = safeDecrypt(entry.contentText || "");
    return {
      ...entry,
      contentHtml: safeDecrypt(entry.contentHtml || ""),
      contentText: decryptedText,
      preview: decryptedText.length > 100 ? decryptedText.substring(0, 100) + "..." : decryptedText,
    };
  });

  return NextResponse.json({
    entries: decryptedEntries,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}