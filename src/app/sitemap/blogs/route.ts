import { useSitemapSettingEnabled } from "@/hooks/useSitemapIndexingSettings";
import { getAllBlogsData } from "@/lib/sitemap-utils";
import { NextResponse } from "next/server";

export async function GET() {
  const baseURL = "https://coupoonat.com/sitemap/";
  //get Settings
  const blogSettings = await useSitemapSettingEnabled();
  if (!blogSettings.blogs || !blogSettings.superSite) {
    return new NextResponse("Sitemap disabled", { status: 404 });
  }

  const blogPages = await getAllBlogsData(1);

  const pages = blogPages.slugs.length === 0 ? 0 : blogPages.totalPages;
  const urls = [];

  for (let page = 1; page <= pages; page++) {
    urls.push(`<url>
    <loc>${baseURL}blogs/${page}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <?xml-stylesheet type="text/xsl" href="/sitemapXSL/sitemap-blogs.xsl"?>
  <!-- Blogs count: ${pages} -->
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
