import type { StoreProps } from "@/types";

export const STORES_PAGE_SIZE = 50;
export type StoreFilters = { category: string; country: string; search: string; page: number };
export const emptyStoreFilters: StoreFilters = { category: "", country: "", search: "", page: 1 };
export type StoresPageData = { success: true; stores: StoreProps[]; pagination: {
  current_page: number; last_page: number; per_page: number; total: number;
}; filters?: { search: string; country: string; category: string } };

export function parseStorePage(value: string | string[] | undefined): number | null {
  if (value === undefined) return 1;
  if (typeof value !== "string" || !/^[1-9]\d{0,8}$/.test(value)) return null;
  return Number(value);
}
export function storePageHref(page: number) { return page === 1 ? "/stores/" : `/stores/?page=${page}`; }
export function hasStoreFilters(filters: StoreFilters) {
  return Boolean(filters.category || filters.country || filters.search);
}
export function parseStoreFilters(params: URLSearchParams): StoreFilters {
  const category = params.get("category") ?? "";
  return { category: /^[1-9]\d{0,8}$/.test(category) ? category : "",
    country: (params.get("country") ?? "").trim().slice(0,100),
    search: (params.get("search") ?? "").trim().slice(0,200),
    page: parseStorePage(params.get("page") ?? undefined) ?? 1 };
}
export function storeFilterHref(filters: StoreFilters) {
  if (!hasStoreFilters(filters)) return "/stores/";
  const params = new URLSearchParams();
  for (const key of ["category", "country", "search"] as const) if (filters[key]) params.set(key, filters[key]);
  if (filters.page > 1) params.set("page", String(filters.page));
  return `/stores/#${params}`;
}

// Shared by the anonymous server cache and client requests. Never silently
// accept a truncated/error payload as a valid empty page.
export function validateStoresPage(value: unknown, page: number): StoresPageData {
  const data = value as StoresPageData | undefined;
  const p = data?.pagination;
  if (!data || data.success !== true || !Array.isArray(data.stores) || !p ||
      p.current_page !== page || p.per_page !== STORES_PAGE_SIZE ||
      !Number.isInteger(p.total) || p.total < 0 ||
      p.last_page !== Math.max(1, Math.ceil(p.total / STORES_PAGE_SIZE)) ||
      data.stores.length !== Math.max(0, Math.min(STORES_PAGE_SIZE, p.total - (page-1)*STORES_PAGE_SIZE)))
    throw new Error("Invalid stores pagination response");
  const ids = new Set<number>(), slugs = new Set<string>();
  for (const store of data.stores) {
    if (!store || typeof store.id !== "number" || !Number.isInteger(store.id) || store.id <= 0 || typeof store.slug !== "string" ||
        !store.slug.trim() || /[\x00-\x20\x7f/\\?#]/.test(store.slug) ||
        !(store.store_name === null || typeof store.store_name === "string") ||
        !(store.image === null || typeof store.image === "string") || ids.has(store.id) || slugs.has(store.slug))
      throw new Error("Invalid store in pagination response");
    ids.add(store.id); slugs.add(store.slug);
  }
  // An unnamed legacy record must not take the entire directory page down.
  return { ...data, stores: data.stores.map(store => ({ ...store,
    store_name: store.store_name?.trim() || store.slug.replace(/-/g, " "),
  })) };
}
