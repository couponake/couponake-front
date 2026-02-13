import { getSitemapSettingEnabled } from "@/services/getSitemapIndexingSettings";
import { getAllStoresData } from "@/lib/sitemap-utils";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ page: string }> }
) {
  //get Settings
  const storesSettings = await getSitemapSettingEnabled();
  if (!storesSettings.stores || !storesSettings.superSite) {
    return new NextResponse("", { status: 404 });
  }

  const resolvedParams = await params;
  const page = resolvedParams?.page;
  const pageNumber = parseInt(page, 10);
  const slugs = await getAllStoresData(pageNumber);

  function escapeXml(unsafe: string) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  const urls = slugs.images
    .map((slug) => {
      const safeSlug = escapeXml(slug);
      return `
  <url>
    <loc>${safeSlug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemapXSL/sitemap-stores.xsl"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
  ${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
