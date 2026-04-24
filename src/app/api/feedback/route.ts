import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Feedback, Issue } from "@/models/feedback";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { createElement } from "react";
import DispatchNotification from "@/components/emails/dispatch-notification";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, text, imageUrl, type } = await req.json();

  if (!type || !["issue", "feedback"].includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
  if (!title || !text) {
    return NextResponse.json(
      { error: "Title and text required" },
      { status: 400 },
    );
  }

  await connectDB();

  const payload = {
    userId: session.user.id,
    email: session.user.email,
    title,
    text,
    imageUrl,
    type,
    status: "pending",
  };

  let doc;
  if (type === "issue") {
    doc = await Issue.create(payload);
  } else {
    doc = await Feedback.create(payload);
  }

  try {
    const emailHtml = await render(
      createElement(DispatchNotification, {
        userName: session.user.name || "Anonymous User",
        userEmail: session.user.email,
        type: type as "issue" | "feedback",
        title,
        text,
        imageUrl,
        traceId: doc._id.toString(),
      }),
    );

    await resend.emails.send({
      from: "withink sanctuary <system@withink.me>",
      to: process.env.CONTACT_EMAIL as string,
      subject: `[${type.toUpperCase()}] ${title}`,
      html: emailHtml,
    });
  } catch (emailError) {
    console.error("Resend Dispatch Error:", emailError);
  }

  return NextResponse.json({ success: true, entry: doc });
}
