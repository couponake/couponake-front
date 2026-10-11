import { StoreResponse } from "@/hooks/useStoreData";
import {
  HOME_CRUMB,
  SITE_URL,
  absoluteUrl,
  breadcrumbNode,
  buildGraph,
  plainText,
  ref,
  stripBrandSuffix,
  webPageNode,
} from "@/lib/structured-data";

/**
 * Store (coupon) page structured data — one @graph:
 *   ItemPage (+ FAQPage when the page shows FAQs) → about → OnlineStore (the brand)
 *   BreadcrumbList: الرئيسية › المتاجر › <store>
 *
 * Deliberately NOT emitted (decision 2026-10-11, see Couponak memory log):
 * - `Store`: a LocalBusiness subtype (physical shop). The brands are online
 *   shops → `OnlineStore` (Google Organization docs recommend it for ecommerce).
 * - `AggregateRating`: there are no genuine user votes yet; the old markup
 *   printed the DB default (1/5 from 1 vote). Stars are switched off until a
 *   real, de-duplicated voting system exists.
 * - `Offer` per coupon: no Google coupon rich result, no schema.org coupon type,
 *   and Couponake publishes no expiry dates (a dead code is replaced).
 */

const storeNames = (storeName?: string, fallback?: string) => {
  // Same convention as the page UI: "<Arabic>-<Latin>" (e.g. "أبرا-abra2").
  const [ar, ...rest] = (storeName || fallback || "").split("-");
  const en = rest.join("-").trim();
  return { ar: ar.trim() || (fallback ?? ""), en };
};

const socialLinksOf = (links: unknown): string[] => {
  const values =
    links && typeof links === "object" ? Object.values(links as Record<string, unknown>) : [];
  return values.filter(
    (link): link is string => typeof link === "string" && /^https?:\/\//.test(link),
  );
};

const getStructuredDataSchemas = (data: StoreResponse) => {
  const store = data.store;
  const url = absoluteUrl(`store/${store.slug}/`);
  const brandId = `${url}#brand`;
  const { ar, en } = storeNames(store.store_name, stripBrandSuffix(store.title));
  const logo = store.image || store.coupon_image || undefined;
  const sameAs = socialLinksOf(store.social_links);

  // Exactly the FAQs the page renders (same filter as components/Pages/Stores/show).
  const faqs = (Array.isArray(data.store_faqs) ? data.store_faqs : []).filter(
    (faq) => Number(faq?.store_id) === Number(store.id) && faq?.question && faq?.answer,
  );

  const brand: Record<string, unknown> = {
    "@type": "OnlineStore",
    "@id": brandId,
    name: ar,
    ...(en ? { alternateName: en } : {}),
    ...(logo ? { logo, image: logo } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };

  const page = webPageNode({
    type: faqs.length ? ["ItemPage", "FAQPage"] : "ItemPage",
    url,
    name: stripBrandSuffix(store.title),
    datePublished: store.created_at,
    dateModified: store.content_updated_at || store.created_at,
    extra: {
      about: ref(brandId),
      ...(logo ? { primaryImageOfPage: { "@type": "ImageObject", url: logo } } : {}),
      ...(faqs.length
        ? {
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: plainText(faq.question),
              acceptedAnswer: { "@type": "Answer", text: plainText(faq.answer) },
            })),
          }
        : {}),
    },
  });

  const breadcrumb = breadcrumbNode(url, [
    HOME_CRUMB,
    { name: "المتاجر", url: `${SITE_URL}stores/` },
    { name: ar, url },
  ]);

  return buildGraph([page, brand, breadcrumb]);
};

export default getStructuredDataSchemas;
