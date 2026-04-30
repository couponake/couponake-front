import Main from "@/components/Pages/Home/main";
import { getData } from "@/lib/actions";
import React from "react";
import ClientSideComponents from "../components/HomePageComponents/ClientSideComponents";
import ScrollTracker from "@/services/ScrollPageAnalytics";

export const experimental_ppr = true;
export const runtime = "nodejs";

export default async function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;

  const [
    generalBanners = [],
    featuredStores = [],
    latestStores = [],
    collectionCount = { stores: 0, coupons: 0, used: 0 },
    testimonials = [],
  ] = await Promise.all([
    getData("home/general-banners"),
    getData("home/featured-stores"),
    getData("home/latest-stores"),
    getData("home/collection-count"),
    getData("home/testimonials"),
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
    name: "كوبونات",
    url: `${baseUrl}`,
    logo: `${baseUrl}coupoonatLogo.webp`,
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
    name: "كوبونات خصم و الاكواد الاصلية المحدثة لأكثر من 10الاف متجر - كوبونات",
    description: "كوبونات و اكواد خصم 2026 الاقوي و الاكثر استخداما لاننا نؤمن بالمصداقية مع عملائنا لذلك نوفر لك جميع كوبونات الخصم الاعلى تخفيضا للمتاجر",
    url: `${baseUrl}`,
    publisher: {
      "@type": "Organization",
      name: "كوبونات",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}coupoonatLogo.webp`,
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
          collection_count={collectionCount}
        />

        <ClientSideComponents />
      </div>
    </>
  );
}
