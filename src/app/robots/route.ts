// src/app/robots/route.ts
import { NextResponse } from 'next/server';

export function GET() {
  const content = `
User-agent: *
Allow: /
Disallow: /_next/
Allow: /_next/static/
Allow: /_next/image/

Disallow: /api/
Disallow: /private/
Disallow: /*?couponID=

Sitemap: https://coupoonat.com/sitemap.xml
`.trim();

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
