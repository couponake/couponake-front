import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(req: NextRequest) {
  // 🌍 1. Run next-intl middleware first to handle locale detection & redirects
  const response = intlMiddleware(req);
  // Return immediately if next-intl triggered a locale redirect (3xx status)
  if (response.status >= 300 && response.status < 400) {
    return response;
  }

  const pathname = req.nextUrl.pathname;

  // 🌍 2. Extract locale and normalize pathname (strip /en or /ar prefix)
  const localeMatch = pathname.match(/^\/(ar|en)(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
  const pathnameWithoutLocale = pathname.replace(/^\/(ar|en)/, "") || "/";

  // 🔑 3. Fetch NextAuth session
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 🔐 4. Auth Logic
  if (!session) {
    if (pathnameWithoutLocale.startsWith("/profile")) {
      const fullPath = pathname + req.nextUrl.search;
      return NextResponse.redirect(
        new URL(`/${locale}/auth/login?redirect=${encodeURIComponent(fullPath)}`, req.url)
      );
    }
  } else {
    if (pathnameWithoutLocale.startsWith("/auth")) {
      return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }
  }

  // 🎟️ 5. Store Route Coupon Check
  if (pathnameWithoutLocale.startsWith("/store/")) {
    const hasSearchParams = req.nextUrl.searchParams.size > 0;

    if (hasSearchParams) {
      const url = req.nextUrl.clone();
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // 🌐 6. Return the next-intl response (preserves cookies and locale state)
  return response;
}

export const config = {
  // Matches all routes except static files, _next, and API routes
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};