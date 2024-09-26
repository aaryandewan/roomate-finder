// pages/_middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl.clone();

  if (token && !token.isProfileComplete && url.pathname !== "/profile/create") {
    // Redirect to profile creation page
    url.pathname = "/profile/create";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
