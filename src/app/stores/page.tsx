import React from "react";
import { getTranslations } from "next-intl/server";
import Stores from "@/components/Pages/Stores";
import { connection } from "next/server";
import { notFound, permanentRedirect } from "next/navigation";
import { getStoresPage } from "@/services/public-stores-data";
import { parseStorePage, parseStoreFilters, storeFilterHref, storePageHref } from "@/lib/stores-list";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getSettingEnabled } from "@/services/getIndexingSettings";
import { SettingsEnum } from "@/types/settingsEnum";
import JsonLd from "@/components/shared/JsonLd";
import { HOME_CRUMB, SITE_URL, breadcrumbNode, buildGraph, webPageNode } from "@/lib/structured-data";

type PageProps = { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: PageProps) {
  const query = await searchParams;
  const page = parseStorePage(query.page) ?? 1;
  const locale = "ar"; // site renders in Arabic only (static)
  const isArabic = locale === "ar";
  //get the indexing settings of the Stores page
  const indexingStores = await getSettingEnabled(SettingsEnum.Stores);

  return {
    title: isArabic ? "دليل المتاجر: اختر متجرك وخذ كوبونه المجرّب | كوبوناك" : "All stores: pick your store and grab its tested coupon | Couponake",
    description: isArabic ? "تصفّح كل المتاجر التي نغطيها مرتبة بعدد الأكواد الفعّالة، وابحث بالاسم أو الفئة أو الدولة لتصل لكوبون متجرك في ثوانٍ." : "Browse every store we cover, ranked by working codes. Search by name, category or country and reach your store's coupon in seconds.",
    alternates: {
      canonical: `https://couponake.com${storePageHref(page)}`,
    },
    robots: {
      index: indexingStores,
    },
    openGraph: {
      title: isArabic ? "دليل المتاجر: اختر متجرك وخذ كوبونه المجرّب | كوبوناك" : "All stores: pick your store and grab its tested coupon | Couponake",
      description: isArabic ? "تصفّح كل المتاجر التي نغطيها مرتبة بعدد الأكواد الفعّالة، وابحث بالاسم أو الفئة أو الدولة لتصل لكوبون متجرك في ثوانٍ." : "Browse every store we cover, ranked by working codes. Search by name, category or country and reach your store's coupon in seconds.",
      images: [
        {
          url: "https://couponake.com/couponak-logo.svg",
          alt: "Couponake Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isArabic ? "دليل المتاجر: اختر متجرك وخذ كوبونه المجرّب | كوبوناك" : "All stores: pick your store and grab its tested coupon | Couponake",
      description: isArabic ? "تصفّح كل المتاجر التي نغطيها مرتبة بعدد الأكواد الفعّالة، وابحث بالاسم أو الفئة أو الدولة لتصل لكوبون متجرك في ثوانٍ." : "Browse every store we cover, ranked by working codes. Search by name, category or country and reach your store's coupon in seconds.",
      images: [
        {
          url: "https://couponake.com/couponak-logo.svg",
          alt: "Couponake Logo",
        },
      ],
    },
  };
}

export default async function StoresPage({ params, searchParams }: PageProps) {
  await connection(); // Data Cache only; no Full Route ISR redirect path.
  const query = await searchParams;
  const page = parseStorePage(query.page);
  if (page === null) notFound();
  if (["category", "country", "search"].some(key => query[key] !== undefined)) {
    const filters = new URLSearchParams();
    for (const key of ["category", "country", "search", "page"]) {
      if (Array.isArray(query[key])) notFound();
      if (typeof query[key] === "string") filters.set(key, query[key]);
    }
    // Preserve old filter bookmarks without creating crawlable combinations.
    permanentRedirect(storeFilterHref(parseStoreFilters(filters)));
  }
  if (query.page === "1") permanentRedirect("/stores/");
  const firstPage = await getStoresPage(page);
  if (page > firstPage.pagination.last_page) notFound();
  const locale = (await params).locale;
  const t = await getTranslations({ locale });
  const pageUrl = 'https://couponake.com' + storePageHref(page);
  const queryClient = new QueryClient();
  queryClient.setQueryData(["stores", page, "", null, null, false], firstPage, { updatedAt: firstPage.fetchedAt });

  // Name/description mirror this page's <title> and meta description.
  const graph = buildGraph([
    webPageNode({
      type: "CollectionPage",
      url: pageUrl,
      name: "دليل المتاجر: اختر متجرك وخذ كوبونه المجرّب",
      description:
        "تصفّح كل المتاجر التي نغطيها مرتبة بعدد الأكواد الفعّالة، وابحث بالاسم أو الفئة أو الدولة لتصل لكوبون متجرك في ثوانٍ.",
    }),
    breadcrumbNode(pageUrl, [HOME_CRUMB, { name: "المتاجر", url: `${SITE_URL}stores/` }]),
  ]);

  return (
    <>
      <JsonLd data={graph} />
      <section className="bg-white">
        <div className="bg-gradient-to-tr from-blue-200 via-main-600 to-blue-300 pt-4">
          <div className="container mx-auto py-4">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h1 className="mb-4 text-4xl font-bold sm:text-6xl sm:leading-[4rem]">
                  {t("common.stores")}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-8">
          {/* The public page and its navigation remain available before JavaScript. */}
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Stores initialPage={page} />
          </HydrationBoundary>
        </div>
      </section>
    </>
  );
}
