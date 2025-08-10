import { useSitemapSettingEnabled } from "@/hooks/useSitemapIndexingSettings";
import { getAllBlogsData } from "@/lib/sitemap-utils";
import { NextResponse } from "next/server";

export async function GET() {
  const baseURL = "https://couponalyom.com";
  //get Settings
  const blogSettings = await useSitemapSettingEnabled();
  if (!blogSettings.blogs || !blogSettings.superSite) {
    return new NextResponse("", { status: 404 });
  }
  
  const blogPages = await getAllBlogsData(1);
  const pages = blogPages.totalPages;
  const urls = [];

  if (!blogPages || !blogPages.slugs || blogPages.slugs.length === 0) {
    return new NextResponse("", { status: 404 });
  }

  for (let page = 1; page <= pages; page++) {
    urls.push(`<url>
    <loc>${baseURL}/sitemap-blogs/${page}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <?xml-stylesheet type="text/xsl" href="/sitemap-blogs.xsl"?>
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
