import "server-only";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import type { ApiResult } from "@/lib/api-result";
import { isDetailNotFound, normalizeDetailSlug, validateCategoryDetail,
  validateCountryDetail, validateDetailRedirect } from "@/lib/detail-data";

// Only anonymous Arabic content is shared. Slugs are encoded as ONE segment;
// cookies, auth headers, search parameters and user preferences never enter it.
export function createDetailLoader<T>(kind: "country" | "category",
  validate: (value: unknown, slug: string) => T, revalidate = 300) {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  const loader = unstable_cache(async (slug: string): Promise<ApiResult<T>> => {
    const endpoint = (kind === "country" ? "home/country/" : "categories/") + encodeURIComponent(slug);
    for (let attempt = 0; ; attempt++) {
      let response: Response;
      try {
        response = await fetch(base + endpoint, {
          cache: "no-store", redirect: "manual", credentials: "omit",
          headers: { Accept: "application/json", "Accept-Language": "ar" },
          signal: AbortSignal.timeout(10000),
        });
      } catch (error) {
        if (attempt > 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 11000));
        continue;
      }
      if ((response.status === 429 || response.status >= 500) && attempt === 0) {
        await response.body?.cancel();
        // Outlast the API's 10-second rate-limit block, with one bounded retry.
        await new Promise(resolve => setTimeout(resolve, 11000));
        continue;
      }
      if (![200, 301, 404].includes(response.status))
        throw new Error(`Public ${kind} detail unavailable: ${response.status}`);
      const value: unknown = await response.json();
      if (response.status === 404) {
        if (!isDetailNotFound(value, kind)) throw new Error("Unrecognized detail 404");
        return { kind: "not_found" };
      }
      if (response.status === 301) return { kind: "redirect", redirect_url: validateDetailRedirect(value) };
      // Validation happens before Data Cache is written. Failed regeneration
      // preserves the last good data/HTML; a cold failure remains an error.
      return { kind: "ok", data: validate(value, slug) };
    }
  }, ["public-detail-v1", base, kind], { revalidate, tags: [`public-${kind}-details`] });
  return (value: string): Promise<ApiResult<T>> => {
    const slug = normalizeDetailSlug(value);
    return slug === null ? Promise.resolve({ kind: "not_found" }) : loader(slug);
  };
}

export const getCountryDetail = cache(createDetailLoader("country", validateCountryDetail));
export const getCategoryDetail = cache(createDetailLoader("category", validateCategoryDetail));
