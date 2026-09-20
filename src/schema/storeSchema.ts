import { StoreResponse } from "@/hooks/useStoreData";

const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
};

const getStructuredDataSchemas = (store: StoreResponse) => {
  const baseUrl = process.env.NEXT_PUBLIC_Couponake_WEBSITE_URL;

  const statisticsProperties = [
    {
      "@type": "PropertyValue",
      name: "Love Score",
      value: `${store?.store?.store_love}%`,
    },
    {
      "@type": "PropertyValue",
      name: "Saved Price",
      value: `${store?.store?.saved_price} ${store?.store?.currency}`,
    },
    {
      "@type": "PropertyValue",
      name: "Orders Number",
      value: store?.store?.orders_number,
    },
    {
      "@type": "PropertyValue",
      name: "Total Used Coupons",
      value: store?.store?.total_used_coupons,
    },
    {
      "@type": "PropertyValue",
      name: "Maximum Coupon Discount",
      value: store?.max_coupon_discount || "N/A",
    },
    {
      "@type": "PropertyValue",
      name: "Most Used Coupon",
      value: store?.max_coupon_used || "N/A",
    },
    {
      "@type": "PropertyValue",
      name: "Returned Visitors Rate",
      value: `${store?.returned_visitors}%`,
    },
    {
      "@type": "PropertyValue",
      name: "Most Popular Category",
      value: store?.popular_category?.category?.name,
    },
  ];

  const socialLinks = store?.store?.social_links
    ? Object.values(store.store.social_links).filter(
        (link) => typeof link === "string" && link.startsWith("http"),
      )
    : [];

  const imageObject = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "@id": `${baseUrl}store/${store?.store?.slug}/#logo`,
    url:
      (store?.store?.coupon_image
        ? store?.store?.coupon_image
        : store?.store?.image) || `${baseUrl}noPreview.webp`,
    contentUrl:
      (store?.store?.coupon_image
        ? store?.store?.coupon_image
        : store?.store?.image) || `${baseUrl}noPreview.webp`,
    caption: store?.store?.title,
  };

  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "Store",
    url: `${baseUrl}store/${store?.store?.slug}/`,
    name: store?.store?.title,
    image: { "@id": `${baseUrl}store/${store?.store?.slug}/#logo` },
    description: stripHtml(
      store?.store?.description ? store?.store?.description : "",
    ),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: parseFloat(store?.store?.rate) || 1,
      ratingCount: store?.store?.voters || 1,
      bestRating: 5,
      worstRating: 1,
    },
    additionalProperty: statisticsProperties,
    sameAs: socialLinks,
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
        name: store.store.title,
        item: `${baseUrl}store/${store.store.slug}/`,
      },
    ],
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
            (store?.store?.coupon_image
              ? store?.store?.coupon_image
              : store?.store?.image) || `${baseUrl}noPreview.webp`,
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

  return faqSchema
    ? [storeSchema, imageObject, breadcrumbSchema, faqSchema, ...couponsSchema]
    : [storeSchema, imageObject, breadcrumbSchema, ...couponsSchema];
};

export default getStructuredDataSchemas;
