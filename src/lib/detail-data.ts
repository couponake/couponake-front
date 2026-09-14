import type { CategoryItem, StoreProps } from "@/types";

type ObjectValue = Record<string, unknown>;
export type CountryDetail = { data: {
  country: string;
  country_seo: { title: string; description: string; image: string };
  stores: StoreProps[];
} };
export type CategoryDetail = { category: CategoryItem };

const object = (value: unknown): value is ObjectValue =>
  value !== null && typeof value === "object" && !Array.isArray(value);
const text = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;
export const isDetailSlug = (value: string) =>
  text(value) && value.length <= 250 && !/[\x00-\x1f\x7f/\\?#]/.test(value) && value !== "." && value !== "..";

export function normalizeDetailSlug(value: string): string | null {
  // ISR can supply percent-encoded params while build-time params are decoded.
  // Normalize once before validating, caching or encoding the API path.
  try {
    const slug = decodeURIComponent(value);
    return isDetailSlug(slug) ? slug : null;
  } catch { return null; }
}

function validateSeo(value: unknown) {
  if (!object(value) || !text(value.title) || typeof value.description !== "string" ||
      typeof value.image !== "string") throw new Error("Invalid detail metadata");
}

function validateStores(value: unknown) {
  if (!Array.isArray(value)) throw new Error("Missing detail store list");
  const ids = new Set<number>();
  for (const store of value) {
    if (!object(store) || !Number.isInteger(store.id) || Number(store.id) <= 0 ||
        !text(store.slug) || !isDetailSlug(store.slug) || !text(store.store_name) ||
        !(store.image === null || typeof store.image === "string") ||
        ids.has(Number(store.id))) throw new Error("Invalid detail store");
    // Distinct existing records can share a slug. Preserve the source list;
    // resolving those content duplicates is a separate, reviewed task.
    ids.add(Number(store.id));
  }
}

export function validateCountryDetail(value: unknown, slug: string): CountryDetail {
  if (!object(value) || value.success !== true || !object(value.data) || value.data.country !== slug)
    throw new Error("Invalid country detail");
  validateSeo(value.data.country_seo);
  validateStores(value.data.stores);
  return value as CountryDetail;
}

export function validateCategoryDetail(value: unknown, slug: string): CategoryDetail {
  if (!object(value) || !object(value.category) || value.category.slug !== slug ||
      !Number.isInteger(value.category.id) || Number(value.category.id) <= 0 || !text(value.category.name) ||
      !(value.category.image === null || typeof value.category.image === "string"))
    throw new Error("Invalid category detail");
  validateSeo(value.category.category_seo);
  validateStores(value.category.stores);
  return value as CategoryDetail;
}

// A malformed redirect must never be converted to a cached not-found result.
export function validateDetailRedirect(value: unknown): string {
  if (!object(value) || !text(value.redirect_url) || /[\x00-\x20\x7f\\]/.test(value.redirect_url))
    throw new Error("Invalid detail redirect");
  const url = value.redirect_url;
  if (!(url.startsWith("/") && !url.startsWith("//")) && !/^https?:\/\//i.test(url))
    throw new Error("Invalid detail redirect protocol");
  return encodeURI(url).replace(/%25([0-9a-f]{2})/gi, "%$1");
}

export function isDetailNotFound(value: unknown, kind: "country" | "category") {
  return object(value) && (kind === "country"
    ? value.success === false && value.message === "Country not found"
    : value.status === "error" && value.message === "Category not found");
}
