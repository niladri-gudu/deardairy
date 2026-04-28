import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/png",
  "image/gif",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const {
    filename,
    contentType,
    size,
    folder: customFolder,
  } = await req.json();

  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json(
      { error: "Unsupported file type" },
      { status: 400 },
    );
  }

  if (size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File too large (max 5MB)" },
      { status: 400 },
    );
  }

  const isProduction = process.env.IS_PROD === "true";
  const envPrefix = isProduction ? "" : "dev-";

  let category = "uploads";
  if (customFolder === "issue" || customFolder === "feedback") {
    category = "system";
  } else if (customFolder === "avatar") {
    category = "avatars";
  }

  const ext = filename.split(".").pop();
  const subPath = customFolder ? `${customFolder}/` : "";

  const key = `${envPrefix}${category}/${session.user.id}/${subPath}${randomUUID()}.${ext}`;
  
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
    ContentLength: size,
  });

  const presignedUrl = await getSignedUrl(r2, command, { expiresIn: 60 });
  const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

  return NextResponse.json({ presignedUrl, publicUrl });
}
