import ShowStore from "@/components/Pages/Stores/show";
import { StoreResponse } from "@/hooks/useStoreData";
import { api } from "@/lib/MyAxios";
import getStructuredDataSchemas from "@/schema/storeSchema";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { getSettingEnabled } from "@/services/getIndexingSettings";
import { SettingsEnum } from "@/types/settingsEnum";

// ISR: every published store is rendered once at build time and served from
// the edge from the first request; pages are refreshed in the background
// every `revalidate` seconds. Stores created after the build are rendered on
// demand (dynamicParams is true by default) and cached the same way.
export const revalidate = 300;
export const dynamicParams = true;

// Store data is cached for 5 minutes (stale-while-revalidate) instead of
// being fetched from the API on every page view.
const STORE_REVALIDATE = 300;
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

// Retry waits for the store fetches. api.couponake.com sits behind a Cloudflare
// rate limit of 200 requests / 10 s per IP that blocks for 10 s, so the last
// wait outlasts a block.
const RETRY_DELAYS_MS = [1000, 3000, 11000];
const FETCH_TIMEOUT_MS = 15000;

export async function generateStaticParams() {
  const slugs: string[] = [];

  try {
    const perPage = 100;
    let page = 1;
    let lastPage = 1;

    do {
      // Same endpoint and pagination shape the sitemap uses (only is_deleted = 0).
      const res: any = await api.static(
        `stores/all-stores?page=${page}&per_page=${perPage}`,
        3600
      );
      const stores: any[] = Array.isArray(res?.stores) ? res.stores : [];
      if (stores.length === 0) break;

      slugs.push(
        ...stores
          .map((s) => s?.slug)
          .filter((s): s is string => typeof s === "string" && s.length > 0)
      );

      lastPage = Number(res?.pagination?.last_page) || page;
      page++;
    } while (page <= lastPage && page <= 50);
  } catch (error) {
    // Never fail the build over the list: fall back to on-demand rendering.
    console.error(
      "generateStaticParams(store): could not list stores, falling back to on-demand rendering:",
      error
    );
  }

  return slugs.map((slug) => ({ slug }));
}

interface storeSeoType {
  title: string;
  description: string;
  image: string;
  "twitter:title": string;
  "twitter:description": string;
  "twitter:image": string;
  "og:title": string;
  "og:description": string;
  "og:image": string;
}

type ApiResult<T> =
  | { kind: "ok"; data: T }
  | { kind: "redirect"; redirect_url: string }
  | { kind: "not_found" };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetches a store endpoint through Next's Data Cache (same key/tag MyAxios used).
 *
 * - 200 → { kind: "ok", data }
 * - 301 with a JSON redirect_url (deleted store with a replacement) → { kind: "redirect" }
 * - 404 → { kind: "not_found" }
 * - anything else (network error, timeout, 429, 5xx) → retried, then thrown.
 *   Throwing matters: MyAxios.api.static swallows every failure into {}, which
 *   turned a transient API error into a real store served as a 404 (or with
 *   fallback metadata) cached for the revalidate window — and, at build time,
 *   shipped that way to every region. A thrown error is an uncached 500 at
 *   runtime and a retried/failed build at build time; neither can be indexed.
 */
async function fetchStoreApi<T>(endpoint: string): Promise<ApiResult<T>> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        next: { revalidate: STORE_REVALIDATE, tags: [endpoint] },
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
    : new Error(`Store fetch failed at ${endpoint}`);
}

async function getStore(slug: string) {
  return fetchStoreApi<StoreResponse>(`stores/store/${slug}`);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Fetch SEO data
  const slug = (await params).slug;

  const response = await fetchStoreApi<{ store_seo: storeSeoType }>(
    `stores/seo/${slug}`
  );

  if (response.kind === "redirect") {
    return {
      title: "Redirecting...",
      description: "You are being redirected to the correct page",
      alternates: {
        canonical: response.redirect_url,
      },
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const seoData: storeSeoType | undefined =
    response.kind === "ok" ? response.data?.store_seo : undefined;
  //get the indexing settings of the Store page
  const indexingStore = await getSettingEnabled(SettingsEnum.Stores);

  // Default values when the store does not exist (the page itself answers 404)
  if (!seoData) {
    return {
      title: "كوبونك",
      description: "كوبونك",
    };
  }

  return {
    // Basic metadata
    title: seoData.title || "كوبونك",
    description: seoData.description || "كوبونك",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}store/${slug}/` || "",
    },
    robots: {
      index: indexingStore,
    },
    // OpenGraph metadata
    openGraph: {
      title: seoData["og:title"] || seoData.title || "كوبونك",
      description:
        seoData["og:description"] || seoData.description || "كوبونك",
      images: [
        {
          url: seoData["og:image"] || "",
          alt: seoData["og:description"] || "",
        },
      ],
    },

    // Twitter metadata
    twitter: {
      card: "summary_large_image",
      title: seoData["twitter:title"] || seoData.title || "كوبونك",
      description:
        seoData["twitter:description"] || seoData.description || "كوبونك",
      images: [
        {
          url: seoData["twitter:image"] || "",
          alt: seoData["twitter:description"] || "",
        },
      ],
    },
  };
}

const ShowStorePage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = (await params).slug;
  let schemas: any = [];

  const queryClient = new QueryClient();

  // fetch store once
  const result = await getStore(slug);

  if (result.kind === "redirect") {
    // Deleted store with a replacement: keep the 301 (checked first, as before).
    redirect(result.redirect_url);
  }

  if (result.kind !== "ok" || !result.data?.store) {
    // Unknown, deleted-without-replacement or unpublished store: a real 404
    // status instead of the store template rendered empty with 200 (soft 404).
    notFound();
  }

  const storeData = result.data;
  schemas = getStructuredDataSchemas(storeData);

  await queryClient.prefetchQuery({
    queryKey: ["store", slug],
    queryFn: () => Promise.resolve(storeData),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemas),
        }}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ShowStore slug={slug} />
      </HydrationBoundary>
    </>
  );
};

export default ShowStorePage;
