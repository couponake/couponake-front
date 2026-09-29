import Main from "@/components/Pages/Home/main";
import { getCachedData } from "@/lib/cached-data";
import ClientSideComponents from "../components/HomePageComponents/ClientSideComponents";
import ScrollTracker from "@/services/ScrollPageAnalytics";

export const experimental_ppr = true;
export const runtime = "nodejs";
// ISR: cache the rendered home page at the edge, refresh in the background.
export const revalidate = 300;

export default async function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;

  const [
    generalBanners = [],
    featuredStores = [],
    latestStores = [],
    testimonials = [],
  ] = await Promise.all([
    getCachedData("home/general-banners"),
    getCachedData("home/featured-stores"),
    getCachedData("home/latest-stores"),
    getCachedData("home/testimonials"),
  ]);

  const calculatingReviewsValue = () => {
    let sum = 0;
    for (let i = 0; i < testimonials.length; i++) {
      sum += Number(testimonials[i].stars);
    }
    return Math.round(sum / testimonials.length);
  }

  const reviewSchemas =
    Array.isArray(testimonials) && testimonials.length > 0
      ? testimonials.map((testimonial) => {
        return {
          "@type": "Review",
          reviewBody: testimonial.description,
          reviewRating: {
            "@type": "Rating",
            ratingValue: Number(testimonial.stars || 5),
            bestRating: 5,
            worstRating: 1,
          },
          author: {
            "@type": "Person",
            name: testimonial?.name || "مستخدم",
          },
          // datePublished: testimonial.created_at.split("T")[0],
        };
      })
      : [];

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "كوبوناك",
    url: `${baseUrl}`,
    logo: `${baseUrl}couponak-logo.svg`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: calculatingReviewsValue(),
      reviewCount: reviewSchemas?.length > 0 ? reviewSchemas?.length : 0,
      bestRating: 5,
      worstRating: 1,
    },
    ...(reviewSchemas?.length > 0 && { review: reviewSchemas }),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "كوبوناك: أكواد خصم مجرّبة اليوم لأشهر متاجر السعودية والخليج",
    description: "كوبوناتك في مكان واحد: أكواد خصم نجرّبها كل يوم على نون وشي إن ونمشي ومئات المتاجر، مع نسبة التوفير وتاريخ آخر تجربة ناجحة. انسخ ووفّر في طلبك التالي.",
    url: `${baseUrl}`,
    publisher: {
      "@type": "Organization",
      name: "كوبوناك",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}couponak-logo.svg`,
      },
    },
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [organizationSchema, websiteSchema],
  };

  return (
    <>
      <ScrollTracker event_name="home_scroll_depth" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
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
