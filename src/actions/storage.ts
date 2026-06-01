/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { connectDB } from "@/lib/mongoose";
import { Entry } from "@/models/entry";
import { safeDecrypt, encrypt } from "@/lib/encryption";
import { invalidateUserEntryCache } from "@/lib/entry-cache";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const isProd = process.env.IS_PROD === "true";
const envPrefix = isProd ? "" : "dev-";

/**
 * Fetches storage statistics for the Media Library
 */
export async function getStorageStats(userId: string) {
  try {
    const category = "journal";
    const prefix = `${envPrefix}${category}/${userId}/`;

    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
      Prefix: prefix,
    });

    const response = await s3.send(command);

    const totalSizeBytes =
      response.Contents?.reduce((acc, obj) => acc + (obj.Size || 0), 0) || 0;
    const fileCount = response.Contents?.length || 0;
    const totalSizeMB = Number((totalSizeBytes / (1024 * 1024)).toFixed(2));

    return {
      usedMB: totalSizeMB,
      fileCount,
      limitMB: 50,
      files:
        response.Contents?.slice(0, 4).map((file) => ({
          key: file.Key,
          url: `https://assets.withink.me/${file.Key}`,
        })) || [],
    };
  } catch (error) {
    console.error("R2 Stats Fetch Error:", error);
    return { usedMB: 0, fileCount: 0, limitMB: 50, files: [] };
  }
}

/**
 * 🚀 NEW: Generates a signed URL for secure Avatar uploads
 */
export async function getAvatarPresignedUrl(
  userId: string,
  contentType: string,
) {
  try {
    const category = "avatars";
    const key = `${envPrefix}${category}/${userId}/${Date.now()}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    return {
      uploadUrl,
      publicUrl: `https://assets.withink.me/${key}`,
    };
  } catch (error) {
    console.error("R2 Presigned URL Error:", error);
    throw new Error("Failed to generate upload authority.");
  }
}

export async function getFullMediaLibrary(userId: string) {
  try {
    const prefix = `${envPrefix}journal/${userId}/`;
    const response = await s3.send(
      new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME,
        Prefix: prefix,
      }),
    );

    return (
      response.Contents?.map((file) => ({
        key: file.Key!,
        url: `https://assets.withink.me/${file.Key}`,
        size: file.Size || 0,
        lastModified: file.LastModified?.toISOString() || null,
      })) || []
    );
  } catch (error) {
    console.error("R2 Media Library Error:", error);
    return [];
  }
}

export async function deleteMediaFile(userId: string, fileKey: string) {
  // Safety check — only allow deleting own files
  if (!fileKey.includes(userId)) throw new Error("Unauthorized");

  // 1. Delete from R2
  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileKey,
    }),
  );

  const publicUrl = `https://assets.withink.me/${fileKey}`;

  // 2. Scrub from all entries
  await connectDB();
  const entries = (await Entry.find({ userId }).lean()) as any[];
  let entriesChanged = false;

  for (const entry of entries) {
    let dirty = false;

    const contentHtml = safeDecrypt(entry.contentHtml) ?? "";
    const contentJsonRaw = safeDecrypt(entry.contentJson) ?? "";

    if (!contentHtml.includes(publicUrl) && !contentJsonRaw.includes(publicUrl))
      continue;

    // Scrub from HTML
    const newHtml = contentHtml.replace(
      new RegExp(`<img[^>]*src="${publicUrl}"[^>]*/?>`, "g"),
      "",
    );

    // Scrub from JSON
    let newJson = contentJsonRaw;
    try {
      const doc = JSON.parse(contentJsonRaw);
      const scrub = (node: any): any => {
        if (node?.type === "image" && node?.attrs?.src === publicUrl)
          return null;
        if (Array.isArray(node?.content)) {
          node.content = node.content.map(scrub).filter(Boolean);
        }
        return node;
      };
      newJson = JSON.stringify(scrub(doc));
    } catch {
      /* malformed, skip */
    }

    dirty = newHtml !== contentHtml || newJson !== contentJsonRaw;

    if (dirty) {
      await Entry.updateOne(
        { _id: entry._id },
        {
          contentHtml: encrypt(newHtml),
          contentJson: encrypt(newJson),
        },
      );
      entriesChanged = true;
    }
  }

  if (entriesChanged) {
    await invalidateUserEntryCache(userId);
  }
}
