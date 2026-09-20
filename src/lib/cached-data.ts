import { api } from "@/lib/MyAxios";

/**
 * Default revalidation window (seconds) for home-page data.
 * Vercel serves the cached response and refreshes it in the background
 * once it is older than this, so visitors never wait for the API.
 */
export const HOME_REVALIDATE = 300;

/**
 * Cached replacement for the axios-based getData() in lib/actions.
 *
 * Same return shape as getData(), but the request goes through Next's
 * Data Cache (fetch + next.revalidate) instead of an uncached axios call,
 * so SSR renders reuse the response instead of hitting api.couponake.com
 * on every page view. See PR #109 for the measurements behind this.
 */
export async function getCachedData<T = any>(
  url: string,
  revalidate: number = HOME_REVALIDATE,
): Promise<T> {
  try {
    const data: any = await api.static(url, revalidate);
    if (url === "home/featured-stores") {
      // The home page needs the whole payload here (data + categories).
      return (data || []) as T;
    }
    return (data?.data || []) as T;
  } catch (error) {
    console.error(`Error fetching cached data from ${url}:`, error);
    // Return empty array as fallback to prevent page crashes
    return [] as T;
  }
}
