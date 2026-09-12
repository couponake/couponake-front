import { getSitemapSettingEnabled } from "@/services/getSitemapIndexingSettings";
import { getAllBlogsData } from "@/lib/sitemap-utils";
import { NextResponse } from "next/server";

// <lastmod> only when the API reports a real content change; never a generated timestamp.
const lastmod = (d?: string) => (d ? `<lastmod>${d}</lastmod>` : "");

export async function GET(
  request: Request,
  { params }: { params: Promise<{ page: string }> }
) {
  //get Settings
  const blogSettings = await getSitemapSettingEnabled();
  if (!blogSettings.blogs || !blogSettings.superSite) {
    return new NextResponse("", { status: 404 });
  }

  const resolvedParams = await params;
  const page = resolvedParams?.page;
  const pageNumber = parseInt(page, 10);
  const blogs = await getAllBlogsData(pageNumber);
  const baseURL = "https://coupoonat.com/";

  const urls = blogs.slugs
    .map((slug, i) => {
      return `
    <url>
      <loc>${baseURL}${encodeURI(slug)}/</loc>
      ${lastmod(blogs.lastmods[i])}
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemapXSL/sitemap-blogs.xsl"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
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
