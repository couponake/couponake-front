import { getSitemapSettingEnabled } from "@/services/getSitemapIndexingSettings";
import { getAllCategories } from "@/lib/sitemap-utils";
import { NextResponse } from "next/server";

export async function GET() {
  const baseURL = "https://coupoonat.com/";
  //get Settings
  const categoriesSettings = await getSitemapSettingEnabled();
  if (!categoriesSettings.categories || !categoriesSettings.superSite) {
    return new NextResponse("", { status: 404 });
  }

  const slugs = await getAllCategories();

  const urls = slugs
    .map(
      (slug) => `
    <url>
      <loc>${baseURL}coupon-category/${encodeURI(slug)}/</loc>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>
  `
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <?xml-stylesheet type="text/xsl" href="/sitemapXSL/sitemap-categories.xsl"?>
  <!-- Categories count: ${slugs.length} -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
