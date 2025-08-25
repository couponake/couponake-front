import ShowStore from '@/components/Pages/Stores/show';
import { useSettingEnabled } from '@/hooks/useIndexingSettings';
import { StoreResponse } from '@/hooks/useStoreData';
import api from '@/lib/api';
import { SettingsEnum } from '@/types/settingsEnum';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
};

interface storeSeoType {
  title: string;
  description: string;
  image: string;
  "twitter:title": string;
  "twitter:description": string;
  "twitter:image": string;
  "og:title": string;
  "og:description": string;
  "og:image": string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Fetch SEO data
  const slug = (await params).slug;

  const headerList = await headers();
  const url = headerList.get("x-url") || ""; // optional: inject from middleware
  const hasCouponID = url.includes("couponID="); // OR parse from searchParams if available

  if (hasCouponID) {
    return {
      title: "Redirecting...",
      description: "Invalid URL with coupon ID",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  try {
    const response: { store_seo: storeSeoType } = await api.static(`stores/seo/${slug}`);

    if ((response as any).redirect_url) {
      return {
        title: "Redirecting...",
        description: "You are being redirected to the correct page",
        alternates: {
          canonical: (response as any).redirect_url,
        },
        robots: {
          index: false,
          follow: true,
        },
      };
    }

    const seoData: storeSeoType = response?.store_seo;
    //get the indexing settings of the Store page
    const indexingStore = await useSettingEnabled(SettingsEnum.Stores);

    // Default values in case API fails
    if (!seoData) {
      return {
        title: "كوبونات",
        description: "كوبونات",
      };
    }

    return {
      // Basic metadata
      title: seoData.title || "كوبونات",
      description: seoData.description || "كوبونات",
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}store/${slug}/` || "",
      },
      robots: {
        index: indexingStore
      },
      // OpenGraph metadata
      openGraph: {
        title: seoData["og:title"] || seoData.title || "كوبونات",
        description: seoData["og:description"] || seoData.description || "كوبونات",
        images: [
          {
            url: seoData["og:image"] || "",
            alt: seoData["og:description"] || "",
          },
        ],
      },

      // Twitter metadata
      twitter: {
        card: "summary_large_image",
        title: seoData["twitter:title"] || seoData.title || "كوبونات",
        description: seoData["twitter:description"] || seoData.description || "كوبونات",
        images: [
          {
            url: seoData["twitter:image"] || "",
            alt: seoData["twitter:description"] || "",
          },
        ],
      },
    };
  } catch (error) {
    return {
      title: "Error Loading Page",
      description: "An error occurred while loading this page",
    };
  }
}

const getStructuredDataSchemas = (store: StoreResponse) => {
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;

  const reviewsSchema =
    Array.isArray(store.store_reviews) && store.store_reviews.length > 0
      ? store.store_reviews.slice(0, 20).map((review) => {
        const cleanDescription = review.description
          ? review.description.replace(/https?:\/\/[^\s]+/g, "").trim()
          : "";

        return {
          "@type": "Review",
          author: {
            "@type": "Person",
            name: review.name || "مستخدم",
          },
          reviewBody: review?.description || "No review text provided",
          reviewRating: {
            "@type": "Rating",
            ratingValue: parseFloat(review.rate) || 1,
            bestRating: "5",
            worstRating: "1",
          },
          datePublished: review.created_at,
        };
      })
      : [];

  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: store?.store?.title,
    image: store?.store?.image || `${baseUrl}noPreview.webp`,
    description: store?.store_seo.description,
    slogan: stripHtml(store?.store?.description ? store?.store?.description : ""),
    url: `${baseUrl}store/${store?.store?.slug}/`,
    "@id": `${baseUrl}store/${store?.store?.slug}/#store`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: parseFloat(store?.store?.rate) || 1,
      ratingCount: store?.store?.voters || 1,
      bestRating: 5,
      worstRating: 1,
    },
    sameAs: Array.isArray(store?.store?.social_links)
      ? store?.store?.social_links.filter(
        (link) => typeof link === "string" && /^https?:\/\//.test(link)
      )
      : [],
    ...(reviewsSchema.length > 0 && { review: reviewsSchema }),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "الرئيسية",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "المتاجر",
        item: `${baseUrl}stores/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: store.store.title,
        item: `${baseUrl}store/${store.store.slug}/`,
      },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}store/${store?.store?.slug}/#webpage`,
    url: `${baseUrl}store/${store?.store?.slug}/`,
    name: store?.store?.title,
    description: store?.store_seo.description,
    isPartOf: {
      "@type": "WebSite",
      "@id": baseUrl,
      name: "كوبونات",
      url: baseUrl,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: store?.store?.image || `${baseUrl}noPreview.webp`,
    },
    datePublished: store?.store?.created_at,
    dateModified: store?.store?.updated_at || store?.store?.created_at,
    mainEntity: {
      "@id": `${baseUrl}store/${store?.store?.slug}/#store`,
    },
  };

  const faqItems =
    Array.isArray(store?.store_faqs) && store?.store_faqs.length > 0
      ? store?.store_faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: stripHtml(faq.answer),
        },
      }))
      : [];

  const faqSchema =
    faqItems.length > 0
      ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems,
      }
      : null;

  const couponsSchema =
    Array.isArray(store?.store?.coupons) && store?.store?.coupons.length > 0
      ? store?.store?.coupons.slice(0, 3).map((coupon, index) => ({
        "@context": "https://schema.org",
        "@type": "Offer",
        "@id": `${baseUrl}store/${store?.store?.slug}/#coupon-${index}`,
        name: coupon.title,
        description: stripHtml(coupon.description || ""),
        url: coupon.url || `${baseUrl}store/${store?.store?.slug}/`,
        validFrom: coupon.created_at,
        validThrough: coupon.expire_date || coupon.updated_at,
        availability: "https://schema.org/InStock",
        identifier: coupon.code,
        seller: {
          "@id": `${baseUrl}store/${store?.store?.slug}/#store`,
        },
        image:
          coupon?.store_image ||
          store?.store?.image ||
          `${baseUrl}noPreview.webp`,
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          description: `خصم بقيمة ${coupon?.discount_value}`,
          eligibleQuantity: {
            "@type": "QuantitativeValue",
            value: coupon?.discount_value,
          },
        },
      }))
      : [];

  const statisticsSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}store/${store?.store?.slug}/#stats`,
    name: `${store?.store?.title} - Store Statistics`,
    url: `${baseUrl}store/${store?.store?.slug}/`,
    hasPart: [
      {
        "@type": "WebPageElement",
        name: "Love Score",
        text: `${store?.store?.store_love}%` || "0%",
      },
      {
        "@type": "WebPageElement",
        name: "Saved Price",
        text: `${store?.store?.saved_price} ${store?.store?.currency}`,
      },
      {
        "@type": "WebPageElement",
        name: "Orders Number",
        text: `${store?.store?.orders_number}`,
      },
      {
        "@type": "WebPageElement",
        name: "Total Used Coupons",
        text: `${store?.store?.total_used_coupons}`,
      },
      {
        "@type": "WebPageElement",
        name: "Maximum Coupon Discount",
        text: `${store?.max_coupon_discount || "N/A"}`,
      },
      {
        "@type": "WebPageElement",
        name: "Most Used Coupon",
        text: `${store?.max_coupon_used || "N/A"}`,
      },
      {
        "@type": "WebPageElement",
        name: "Returned Visitors Rate",
        text: `${store?.returned_visitors}%` || "0%",
      },
      {
        "@type": "WebPageElement",
        name: "Most Popular Category",
        text: `${store?.popular_category?.category?.name} (${store?.popular_category?.count})`,
      },
    ],
  };


  return faqSchema
    ? [
      storeSchema,
      breadcrumbSchema,
      faqSchema,
      webPageSchema,
      ...couponsSchema,
      statisticsSchema
    ]
    : [storeSchema, breadcrumbSchema, webPageSchema, ...couponsSchema, statisticsSchema];
};

const ShowStorePage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = (await params).slug;
  let schemas: any = [];

  const storeData = await api.request.get(`stores/store/${slug}`);

  if ((storeData as any)?.redirect_url) {
    redirect((storeData as any).redirect_url);
  } else if (storeData && storeData.store) {
    schemas = getStructuredDataSchemas(storeData);
  }


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemas),
        }}
      />
      <ShowStore slug={slug} />
    </>
  );
};

export default ShowStorePage;
