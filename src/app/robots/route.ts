// src/app/robots/route.ts
import { NextResponse } from "next/server";

export function GET() {
  const content = `
User-agent: *
Disallow: /
Disallow: /_next/
Allow: /_next/static/
Allow: /_next/image/

Disallow: /api/
Disallow: /private/
Disallow: /*?couponID=

Sitemap: https://couponake.com/sitemap.xml
`.trim();

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
