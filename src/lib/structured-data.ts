/**
 * Shared JSON-LD building blocks.
 *
 * Every page emits ONE `@graph` whose nodes reference the same stable `@id`s
 * (`/#organization`, `/#website`), so search engines see a single connected
 * entity instead of a slightly different "كوبوناك" on every template.
 *
 * Rules this file encodes (Google structured-data policies):
 * - Mark up only what the visitor can see on the page; no hidden or invented data.
 * - No AggregateRating/Review on Couponake itself (self-serving) and no
 *   ratings that are not genuine user votes.
 * - No Product/Offer/Event markup for coupons: there is no coupon rich result,
 *   and schema.org has no coupon type (DiscountOffer proposal #1742 was closed).
 * - Dates come from real content changes (content_updated_at / updated_at),
 *   never from build time.
 */

const rawSiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || "https://couponake.com/";

/** Canonical site root, always with a trailing slash. */
export const SITE_URL = rawSiteUrl.endsWith("/") ? rawSiteUrl : `${rawSiteUrl}/`;
export const SITE_NAME = "كوبوناك";
export const SITE_ALT_NAME = "Couponake";
export const ORG_ID = `${SITE_URL}#organization`;
export const WEBSITE_ID = `${SITE_URL}#website`;
export const LOGO_ID = `${SITE_URL}#logo`;
/** Square raster logo (512×512). Google: ≥112×112, format supported by Google Images. */
export const LOGO_URL = `${SITE_URL}icons/favicon-512.png`;

type Node = Record<string, unknown>;

/** Drops undefined/null/empty-string/empty-array values so no `null` reaches the markup. */
function clean<T extends Node>(node: T): T {
  const out: Node = {};
  for (const [key, value] of Object.entries(node)) {
    if (value === undefined || value === null) continue;
    if (typeof value === "string" && value.trim() === "") continue;
    if (Array.isArray(value) && value.length === 0) continue;
    out[key] = value;
  }
  return out as T;
}

export const ref = (id: string) => ({ "@id": id });

export function organizationNode(): Node {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    alternateName: SITE_ALT_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      "@id": LOGO_ID,
      url: LOGO_URL,
      contentUrl: LOGO_URL,
      width: 512,
      height: 512,
      caption: SITE_NAME,
    },
    image: ref(LOGO_ID),
  };
}

export function websiteNode(): Node {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    alternateName: SITE_ALT_NAME,
    inLanguage: "ar",
    publisher: ref(ORG_ID),
  };
}

export type Crumb = { name: string; url: string };

export function breadcrumbNode(pageUrl: string, crumbs: Crumb[]): Node {
  return {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

export const HOME_CRUMB: Crumb = { name: "الرئيسية", url: SITE_URL };

export function webPageNode(options: {
  type?: string | string[];
  url: string;
  name?: string;
  description?: string;
  breadcrumb?: boolean;
  datePublished?: string | null;
  dateModified?: string | null;
  extra?: Node;
}): Node {
  const { type = "WebPage", url, name, description, breadcrumb = true, datePublished, dateModified, extra } = options;
  return clean({
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: "ar",
    isPartOf: ref(WEBSITE_ID),
    breadcrumb: breadcrumb ? ref(`${url}#breadcrumb`) : undefined,
    datePublished: datePublished || undefined,
    dateModified: dateModified || undefined,
    ...(extra ?? {}),
  });
}

/** One `@graph` with the site-wide Organization and WebSite nodes always present. */
export function buildGraph(nodes: Node[]): Node {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationNode(), websiteNode(), ...nodes],
  };
}

/** JSON for a <script type="application/ld+json">, safe against `</script>` in content. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

/** Removes the « | كوبوناك » brand suffix that belongs in <title>, not in entity names. */
export function stripBrandSuffix(title?: string | null): string {
  if (!title) return "";
  return title
    .replace(/\s*[|\-–—]\s*(كوبوناك|Couponake)\s*$/u, "")
    .trim();
}

const ENTITIES: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&quot;": '"',
  "&#39;": "'",
  "&lt;": "<",
  "&gt;": ">",
};

/** Plain text from CMS HTML: tags removed, common entities decoded, whitespace collapsed. */
export function plainText(html?: string | null): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&(nbsp|amp|quot|#39|lt|gt);/g, (match) => ENTITIES[match] ?? match)
    .replace(/\s+/g, " ")
    .trim();
}

/** Absolute URL for an internal path (accepts "/store/x/" or "store/x/"). */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.replace(/^\//, "")}`;
}

/** ItemList of store cards (name = Arabic part of "<ar>-<en>", as shown on the card). */
export const storeItemList = (listId: string, stores: any[]): Node | null => {
  const items = (Array.isArray(stores) ? stores : []).filter(
    (store) => store?.slug && store?.store_name,
  );
  return items.length
    ? {
        "@type": "ItemList",
        "@id": listId,
        numberOfItems: items.length,
        itemListElement: items.map((store, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: String(store.store_name).split("-")[0].trim(),
          url: absoluteUrl(`store/${store.slug}/`),
        })),
      }
    : null;
};
