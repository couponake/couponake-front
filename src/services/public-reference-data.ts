import "server-only";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { validateCategories, validateCountries, validateCountryOptions } from "@/lib/reference-data";

// Only fixed, anonymous Arabic lists belong here. Never forward cookies, tokens,
// search parameters or user filters into this shared cache.
export function createPublicListLoader<T>(endpoint: string, tag: string,
  validate: (value: unknown) => T, revalidate: number) {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  return unstable_cache(async () => {
    const response = await fetch(`${base}${endpoint}`, {
      cache: "no-store", redirect: "manual", credentials: "omit",
      headers: { Accept: "application/json", "Accept-Language": "ar" },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error(`Public reference data unavailable: ${response.status}`);
    // Validate BEFORE caching. Throwing keeps the last good value during SWR;
    // a cold failure remains an error rather than an empty successful list.
    return validate(await response.json());
  }, ["public-reference-data-v1", base, endpoint], { revalidate, tags: [tag] });
}

export const getCategories = cache(createPublicListLoader(
  "categories?per_page=50", "public-categories", validateCategories, 300));
export const getCountries = cache(createPublicListLoader(
  "home/countries-meta?page=1&perPage=20", "public-countries", validateCountries, 3600));
export const getCountryOptions = cache(createPublicListLoader(
  // Laravel pagination treats -1 as a negative page size and drops a country.
  "home/countries?per_page=300", "public-country-options", validateCountryOptions, 300));
