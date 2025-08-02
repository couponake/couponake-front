// src/app/robots/route.ts
import { NextResponse } from 'next/server';

export function GET() {
  const content = `
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /private/
Disallow: /*?couponID=

Sitemap: https://el-afdl.com/sitemap.xml
`.trim();

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
