import { getSitemapSettingEnabled } from "@/services/getSitemapIndexingSettings";
import { getAllCountries } from "@/lib/sitemap-utils";
import { NextResponse } from "next/server";

export async function GET() {
  const baseURL = "https://coupoonat.com/";
  //get Settings
  const countriesSettings = await getSitemapSettingEnabled();
  if (!countriesSettings.countries || !countriesSettings.superSite) {
    return new NextResponse("", { status: 404 });
  }

  const countries = await getAllCountries();

  const urls = countries
    .map(
      (name) => `
    <url>
      <loc>${baseURL}coupon_country/${name}/</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>
  `
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <?xml-stylesheet type="text/xsl" href="/sitemapXSL/sitemap-countries.xsl"?>
  <!-- Country count: ${countries.length} -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=1800",
    },
  });
}
