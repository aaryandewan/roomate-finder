// src/middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: any) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Redirect users to complete their profile if it's not complete
  if (
    token &&
    !token.isProfileComplete &&
    req.nextUrl.pathname !== "/complete-profile"
  ) {
    return NextResponse.redirect(new URL("/complete-profile", req.url));
  }

  return NextResponse.next();
}

// Add paths to apply the middleware to (excluding /complete-profile)
export const config = {
  matcher: ["/((?!complete-profile).*)"], // Apply to all pages except "/complete-profile"
};
