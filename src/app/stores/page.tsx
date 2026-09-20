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

type PageProps = { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: PageProps) {
  const query = await searchParams;
  const page = parseStorePage(query.page) ?? 1;
  const locale = "ar"; // site renders in Arabic only (static)
  const isArabic = locale === "ar";
  //get the indexing settings of the Stores page
  const indexingStores = await getSettingEnabled(SettingsEnum.Stores);

  return {
    title: isArabic
      ? "كل المتاجر: كوبونك خصم لجميع متاجر التسوق في الشرق الاوسط"
      : "All Stores: Discount coupons for all Middle Eastern shopping stores",
    description: isArabic
      ? "بعد الدخول يمكنك ايجاد والبحث عن اى متجر تريد له كوبونك خصم بكل سهولة ومجاناً"
      : "Once you log in, you can easily find and search for any store for which you want discount coupons for, free of charge",
    alternates: {
      canonical: `https://couponake.com${storePageHref(page)}`,
    },
    robots: {
      index: indexingStores,
    },
    openGraph: {
      title: isArabic
        ? "كل المتاجر: كوبونك خصم لجميع متاجر التسوق في الشرق الاوسط"
        : "All Stores: Discount coupons for all Middle Eastern shopping stores",
      description: isArabic
        ? "بعد الدخول يمكنك ايجاد والبحث عن اى متجر تريد له كوبونك خصم بكل سهولة ومجاناً"
        : "Once you log in, you can easily find and search for any store for which you want discount coupons for, free of charge",
      images: [
        {
          url: "https://couponake.com/couponakeLogo.webp",
          alt: "Couponake Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isArabic
        ? "كل المتاجر: كوبونك خصم لجميع متاجر التسوق في الشرق الاوسط"
        : "All Stores: Discount coupons for all Middle Eastern shopping stores",
      description: isArabic
        ? "بعد الدخول يمكنك ايجاد والبحث عن اى متجر تريد له كوبونك خصم بكل سهولة ومجاناً"
        : "Once you log in, you can easily find and search for any store for which you want discount coupons for, free of charge",
      images: [
        {
          url: "https://couponake.com/couponakeLogo.webp",
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
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;
  const pageUrl = 'https://couponake.com' + storePageHref(page);
  const queryClient = new QueryClient();
  queryClient.setQueryData(["stores", page, "", null, null, false], firstPage, { updatedAt: firstPage.fetchedAt });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    name: "كل المتاجر: كوبونك خصم لجميع متاجر التسوق في الشرق الاوسط",
    description: "بعد الدخول يمكنك ايجاد والبحث عن اى متجر تريد له كوبونك خصم بكل سهولة ومجاناً",
    url: pageUrl,
    inLanguage: locale,
    isPartOf: {
      "@type": "WebSite",
      name: "كوبونك",
      url: baseUrl,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "الرئيسية",
        item: `${baseUrl}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "المتاجر",
        item: `${baseUrl}stores/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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
