import { auth } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const isProtected = request.nextUrl.pathname.startsWith("/journal");

  if (!isProtected) return NextResponse.next();

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("callback", request.nextUrl.pathname);
    return NextResponse.redirect(signinUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/journal/:path*"],
};