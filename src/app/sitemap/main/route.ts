import { useSitemapSettingEnabled } from "@/hooks/useSitemapIndexingSettings";
import { NextResponse } from "next/server";

type SitemapEntry = {
  url: string;
  lastModified: Date;
  changeFrequency: "weekly" | "yearly";
  priority: number;
};

export async function GET() {
  const baseURL = "https://couponalyom.com/";
  //get Settings
  const settings = await useSitemapSettingEnabled();
  if (!settings.superSite) {
    return new NextResponse("", { status: 404 });
  }

  const mainPages = [
    {
      url: baseURL,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    settings.countries && {
      url: `${baseURL}all_countries/`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    settings.privacy && {
      url: `${baseURL}privacy-policy/`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    },
    settings.terms && {
      url: `${baseURL}terms/`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    settings.about && {
      url: `${baseURL}about-us/`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    },
    settings.contact && {
      url: `${baseURL}contact/`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    },
    settings.faqs && {
      url: `${baseURL}faq/`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    },
    settings.blogs && {
      url: `${baseURL}blog/`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    },
    settings.stores && {
      url: `${baseURL}stores/`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    },
    settings.categories && {
      url: `${baseURL}categories/`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    },
  ].filter(Boolean) as SitemapEntry[];

  const urls = mainPages
    .map(
      (page) => `
    <url>
      <loc>${page.url}</loc>
      <lastmod>${page.lastModified.toISOString()}</lastmod>
      <changefreq>${page.changeFrequency}</changefreq>
      <priority>${page.priority}</priority>
    </url>
  `
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <?xml-stylesheet type="text/xsl" href="/sitemapXSL/sitemap-main.xsl"?>
  <!-- Pages count: ${mainPages.length} -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
