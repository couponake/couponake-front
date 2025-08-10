import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;
  const searchParams = req.nextUrl.searchParams;

  // 🔐 1. Auth Logic
  if (!session) {
    if (pathname.startsWith("/profile")) {
      return NextResponse.redirect(
        new URL(`/auth/login?redirect=/profile`, req.url)
      );
    }
  } else {
    if (pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL(`/`, req.url));
    }
  }

  // 🎟️ 2. Store Route Coupon Check
  if (pathname.startsWith("/store/")) {
    const hasSearchParams = req.nextUrl.searchParams.size > 0;

    if (hasSearchParams) {
      const url = req.nextUrl.clone();
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/profile/:path*", "/auth/:path*", "/store/:path*"],
};
