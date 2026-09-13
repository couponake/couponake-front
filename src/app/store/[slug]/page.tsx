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

// Retry waits for the store fetch. api.coupoonat.com sits behind a Cloudflare
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

type StoreFetchResult = StoreResponse | { redirect_url: string } | null;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetches a store through Next's Data Cache (same key/tag MyAxios used).
 *
 * - 200 → the store payload
 * - 301 with a JSON redirect_url (deleted store with a replacement) → { redirect_url }
 * - 404 → null (the caller answers with a real 404)
 * - anything else (network error, timeout, 429, 5xx) → retried, then thrown.
 *   Throwing matters: a swallowed failure used to become an empty payload and
 *   therefore a 404 cached for the revalidate window — and, at build time, a
 *   static 404 shipped for a real store. A thrown error is an uncached 500 at
 *   runtime and a failed build at build time; neither can be indexed as "gone".
 */
async function getStore(slug: string): Promise<StoreFetchResult> {
  const endpoint = `stores/store/${slug}`;
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
        return null;
      }

      if (response.status === 301) {
        const data = await response.json().catch(() => null);
        return data?.redirect_url ? (data as { redirect_url: string }) : null;
      }

      if (response.ok) {
        return (await response.json()) as StoreResponse;
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Fetch SEO data
  const slug = (await params).slug;

  try {
    const response: { store_seo: storeSeoType } = await api.static(
      `stores/seo/${slug}`,
      STORE_REVALIDATE
    );

    if ((response as any).redirect_url) {
      return {
        title: "Redirecting...",
        description: "You are being redirected to the correct page",
        alternates: {
          canonical: (response as any).redirect_url,
        },
        robots: {
          index: false,
          follow: true,
        },
      };
    }

    const seoData: storeSeoType = response?.store_seo;
    //get the indexing settings of the Store page
    const indexingStore = await getSettingEnabled(SettingsEnum.Stores);

    // Default values in case API fails
    if (!seoData) {
      return {
        title: "كوبونات",
        description: "كوبونات",
      };
    }

    return {
      // Basic metadata
      title: seoData.title || "كوبونات",
      description: seoData.description || "كوبونات",
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}store/${slug}/` || "",
      },
      robots: {
        index: indexingStore,
      },
      // OpenGraph metadata
      openGraph: {
        title: seoData["og:title"] || seoData.title || "كوبونات",
        description:
          seoData["og:description"] || seoData.description || "كوبونات",
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
        title: seoData["twitter:title"] || seoData.title || "كوبونات",
        description:
          seoData["twitter:description"] || seoData.description || "كوبونات",
        images: [
          {
            url: seoData["twitter:image"] || "",
            alt: seoData["twitter:description"] || "",
          },
        ],
      },
    };
  } catch {
    return {
      title: "Error Loading Page",
      description: "An error occurred while loading this page",
    };
  }
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
  const storeData = await getStore(slug);

  if (storeData && "redirect_url" in storeData && storeData.redirect_url) {
    // Deleted store with a replacement: keep the 301 (checked first, as before).
    redirect(storeData.redirect_url);
  } else if (!storeData || !("store" in storeData) || !storeData.store) {
    // Unknown, deleted-without-replacement or unpublished store: a real 404
    // status instead of the store template rendered empty with 200 (soft 404).
    notFound();
  } else {
    schemas = getStructuredDataSchemas(storeData);
  }

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
