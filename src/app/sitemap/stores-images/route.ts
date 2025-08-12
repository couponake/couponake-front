import { useSitemapSettingEnabled } from "@/hooks/useSitemapIndexingSettings";
import { getAllStoresData } from "@/lib/sitemap-utils";
import { NextResponse } from "next/server";

export async function GET() {
  // const baseURL = "https://couponalyom.com";
  const baseURL = "localhost:3000/";
  //get Settings
  const storesSettings = await useSitemapSettingEnabled();
  if (!storesSettings.stores || !storesSettings.superSite) {
    return new NextResponse("", { status: 404 });
  }

  const slugs = await getAllStoresData(1);

  const pages = slugs.totalPages;
  const urls = [];

  if (!slugs || !slugs.storesSlugs || slugs.storesSlugs.length === 0) {
    return new NextResponse("", { status: 404 });
  }

  for (let page = 1; page <= pages; page++) {
    urls.push(`<url>
    <loc>${baseURL}/stores-images/${page}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemapXSL/sitemap-stores.xsl"?>
<!-- Stores pages: ${pages} -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join("")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
