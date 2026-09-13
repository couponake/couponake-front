/**
 * Server-side fetch for the Laravel API that tells "not found" apart from
 * "the service failed" — the distinction MyAxios.api.static / api.dynamic
 * erase by returning {} on any failure.
 *
 * - 200 → { kind: "ok", data }
 * - 301 with a JSON redirect_url (deleted entity with a replacement) → { kind: "redirect" }
 * - 404 → { kind: "not_found" }
 * - anything else (network error, timeout, 429, 5xx) → retried, then thrown.
 *
 * Throwing matters: an empty payload used to become notFound(), i.e. a real
 * page served (and, under ISR, cached) as 404 during an API hiccup. A thrown
 * error is an uncached 500 at runtime and a retried/failed build at build
 * time; neither can be indexed as "gone".
 *
 * Retry waits: api.coupoonat.com sits behind a Cloudflare rate limit of
 * 200 requests / 10 s per IP that blocks for 10 s, so the last wait outlasts
 * a block.
 */
export type ApiResult<T> =
  | { kind: "ok"; data: T }
  | { kind: "redirect"; redirect_url: string }
  | { kind: "not_found" };

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const RETRY_DELAYS_MS = [1000, 3000, 11000];
const FETCH_TIMEOUT_MS = 15000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchApi<T>(
  endpoint: string,
  options: { revalidate?: number | false; tags?: string[] } = {}
): Promise<ApiResult<T>> {
  const { revalidate = 300, tags = [endpoint] } = options;
  let lastError: unknown;

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...(revalidate === false
          ? { cache: "no-store" as const }
          : { next: { revalidate, tags } }),
        headers: {
          Accept: "application/json",
          "Accept-Language": "ar",
        },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });

      if (response.status === 404) {
        return { kind: "not_found" };
      }

      if (response.status === 301) {
        const data = await response.json().catch(() => null);
        return data?.redirect_url
          ? { kind: "redirect", redirect_url: String(data.redirect_url) }
          : { kind: "not_found" };
      }

      if (response.ok) {
        return { kind: "ok", data: (await response.json()) as T };
      }

      lastError = new Error(`API error: ${response.status} at ${endpoint}`);
      // Only rate limiting and server-side failures are worth retrying.
      if (response.status !== 429 && response.status < 500) {
        break;
      }
    } catch (error) {
      lastError = error;
    }

    if (attempt < RETRY_DELAYS_MS.length) {
      await sleep(RETRY_DELAYS_MS[attempt]);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`API fetch failed at ${endpoint}`);
}
