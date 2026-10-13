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

  // Image sitemap: each image sits under its store page (an image URL is never a <loc>).
  const urls = slugs.images
    .map((img, i) => (img ? `
  <url>
    <loc>https://couponake.com/store/${encodeURI(slugs.storesSlugs[i])}/</loc>
    <image:image><image:loc>${escapeXml(encodeURI(img))}</image:loc></image:image>
  </url>` : ""))
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemapXSL/sitemap-stores.xsl"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
  ${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
