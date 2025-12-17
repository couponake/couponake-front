import { getSitemapSettingEnabled } from "@/hooks/useSitemapIndexingSettings";
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
  const stores = await getAllStoresData(pageNumber);
  const baseURL = "https://coupoonat.com/store/";

  const urls = stores.storesSlugs
    .map((slug) => {
      return `
    <url>
      <loc>${baseURL}${slug}/</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
      <xhtml:link 
        rel="canonical" 
        href="${baseURL}${slug}/"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
      />
    </url>
  `;
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
