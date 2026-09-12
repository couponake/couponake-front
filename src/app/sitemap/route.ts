// app/sitemap.xml/route.ts
import { getSitemapSettingEnabled } from "@/services/getSitemapIndexingSettings";
import { getAllBlogsData, getAllStoresData } from "@/lib/sitemap-utils";
import { NextResponse } from "next/server";

export async function GET() {
  const baseURL = "https://coupoonat.com/sitemap/";
  //get Settings
  const settings = await getSitemapSettingEnabled();
  if (!settings.superSite) {
    return new NextResponse("", { status: 404 });
  }

  //blogs pages
  const blogsURLs = [];
  if (settings.blogs) {
    const blogPages = await getAllBlogsData(1);
    const blogTotalPages = blogPages.slugs.length === 0 ? 0 : blogPages.totalPages;
    for (let page = 1; page <= blogTotalPages; page++) {
      blogsURLs.push(`<sitemap>
        <loc>${baseURL}blogs/${page}/</loc>
        </sitemap>`);
    }
  }

  //stores images & pages
  const StoreImagesURLs = [];
  const storesURLs = [];
  if (settings.stores) {
    const slugs = await getAllStoresData(1);
    const StoresPages = slugs.storesSlugs.length === 0 ? 0 : slugs.totalPages;
    for (let page = 1; page <= StoresPages; page++) {
      StoreImagesURLs.push(`<sitemap>
      <loc>${baseURL}stores-images/${page}/</loc>
    </sitemap>`);

      storesURLs.push(`<sitemap>
      <loc>${baseURL}stores/${page}/</loc>
    </sitemap>`);
    }
  }

  //main urls
  const URLs: string[] = [];

  URLs.push(`${baseURL}main.xml`);
  if (settings.countries) {
    URLs.push(`${baseURL}countries.xml`);
  }
  if (settings.categories) {
    URLs.push(`${baseURL}categories.xml`);
  }

  const urls = URLs.map(
    (url) => `<sitemap>
    <loc>${url}</loc>
  </sitemap>`
  ).join("");

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
  <?xml-stylesheet type="text/xsl" href="/sitemapXSL/sitemap.xsl"?>
<!-- URLs count: ${URLs.length + storesURLs.length + StoreImagesURLs.length + blogsURLs.length} -->
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
  ${storesURLs.join("")}
  ${StoreImagesURLs.join("")}
  ${blogsURLs.join("")}
</sitemapindex>`;

  return new NextResponse(sitemapIndex, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
