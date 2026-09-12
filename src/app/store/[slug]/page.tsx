import ShowStore from "@/components/Pages/Stores/show";
import { StoreResponse } from "@/hooks/useStoreData";
import { api } from "@/lib/MyAxios";
import getStructuredDataSchemas from "@/schema/storeSchema";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import React from "react";
import { getSettingEnabled } from "@/services/getIndexingSettings";
import { SettingsEnum } from "@/types/settingsEnum";

// Store data is cached for 5 minutes (stale-while-revalidate) instead of
// being fetched from the API on every page view.
const STORE_REVALIDATE = 300;

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

async function getStore(slug: string) {
  // MyAxios api.static understands the API's 301-with-JSON redirect_url responses.
  const data = await api.static<StoreResponse>(
    `stores/store/${slug}`,
    STORE_REVALIDATE
  );
  return data;
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

  await queryClient.prefetchQuery({
    queryKey: ["store", slug],
    queryFn: () => Promise.resolve(storeData),
  });

  if ((storeData as any)?.redirect_url) {
    redirect((storeData as any).redirect_url);
  } else if (storeData && storeData.store) {
    schemas = getStructuredDataSchemas(storeData);
  }

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
