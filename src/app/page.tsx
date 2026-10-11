import Main from "@/components/Pages/Home/main";
import { getCachedData } from "@/lib/cached-data";
import ClientSideComponents from "../components/HomePageComponents/ClientSideComponents";
import ScrollTracker from "@/services/ScrollPageAnalytics";
import JsonLd from "@/components/shared/JsonLd";
import { ORG_ID, SITE_NAME, SITE_URL, buildGraph, ref, webPageNode } from "@/lib/structured-data";

export const experimental_ppr = true;
export const runtime = "nodejs";
// ISR: cache the rendered home page at the edge, refresh in the background.
export const revalidate = 300;

export default async function Home() {
  // home/testimonials is no longer fetched here: it only fed a self-serving
  // Organization AggregateRating (Couponake rating itself), which Google
  // excludes from review stars. The testimonials section loads its own data.
  const [generalBanners = [], featuredStores = [], latestStores = []] =
    await Promise.all([
      getCachedData("home/general-banners"),
      getCachedData("home/featured-stores"),
      getCachedData("home/latest-stores"),
    ]);

  const graph = buildGraph([
    webPageNode({
      url: SITE_URL,
      name: SITE_NAME,
      breadcrumb: false,
      extra: { about: ref(ORG_ID) },
    }),
  ]);

  return (
    <>
      <ScrollTracker event_name="home_scroll_depth" />
      <JsonLd data={graph} />
      <div className="w-full h-full overflow-x-hidden">
        <Main
          hero_banners={generalBanners}
          featured_stores={featuredStores}
          latest_stores={latestStores}
        />

        <ClientSideComponents />
      </div>
    </>
  );
}
