import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { parseStorePage, validateStoresPage } from "@/lib/stores-list";

export function createStoresPageLoader(revalidate = 300) {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  const load = unstable_cache(async (page: number) => {
    const response = await fetch(`${base}stores/all-stores?page=${page}&per_page=50`, {
      cache: "no-store", redirect: "manual", credentials: "omit",
      headers: { Accept: "application/json", "Accept-Language": "ar" },
      signal: AbortSignal.timeout(10000),
    });
    if (response.status !== 200) throw new Error(`Public stores unavailable: ${response.status}`);
    return { ...validateStoresPage(await response.json(), page), fetchedAt: Date.now() };
  }, ["public-stores-pages-v1", base], { revalidate, tags: ["public-stores-pages"] });
  return (page: number) => {
    if (parseStorePage(String(page)) !== page) throw new Error("Invalid store page");
    return load(page);
  };
}
export const getStoresPage = cache(createStoresPageLoader());
