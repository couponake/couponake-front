import React, { Suspense } from "react";
import StoresSkeleton from "@/components/loadingUis/StoresSkeleton";
import { getTranslations } from "next-intl/server";
import Stores from "@/components/Pages/Stores";
import StoresStaticGrid from "@/components/Pages/Stores/StaticGrid";
import api from "@/lib/api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getSettingEnabled } from "@/services/getIndexingSettings";
import { SettingsEnum } from "@/types/settingsEnum";

export async function generateMetadata() {
  const locale = "ar"; // site renders in Arabic only (static)
  const isArabic = locale === "ar";
  //get the indexing settings of the Stores page
  const indexingStores = await getSettingEnabled(SettingsEnum.Stores);

  return {
    title: isArabic
      ? "كل المتاجر: كوبونات خصم لجميع متاجر التسوق في الشرق الاوسط"
      : "All Stores: Discount coupons for all Middle Eastern shopping stores",
    description: isArabic
      ? "بعد الدخول يمكنك ايجاد والبحث عن اى متجر تريد له كوبونات خصم بكل سهولة ومجاناً"
      : "Once you log in, you can easily find and search for any store for which you want discount coupons for, free of charge",
    alternates: {
      canonical: "https://coupoonat.com/stores/",
    },
    robots: {
      index: indexingStores,
    },
    openGraph: {
      title: isArabic
        ? "كل المتاجر: كوبونات خصم لجميع متاجر التسوق في الشرق الاوسط"
        : "All Stores: Discount coupons for all Middle Eastern shopping stores",
      description: isArabic
        ? "بعد الدخول يمكنك ايجاد والبحث عن اى متجر تريد له كوبونات خصم بكل سهولة ومجاناً"
        : "Once you log in, you can easily find and search for any store for which you want discount coupons for, free of charge",
      images: [
        {
          url: "https://coupoonat.com/coupoonatLogo.webp",
          alt: "Coupoonat Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isArabic
        ? "كل المتاجر: كوبونات خصم لجميع متاجر التسوق في الشرق الاوسط"
        : "All Stores: Discount coupons for all Middle Eastern shopping stores",
      description: isArabic
        ? "بعد الدخول يمكنك ايجاد والبحث عن اى متجر تريد له كوبونات خصم بكل سهولة ومجاناً"
        : "Once you log in, you can easily find and search for any store for which you want discount coupons for, free of charge",
      images: [
        {
          url: "https://coupoonat.com/coupoonatLogo.webp",
          alt: "Coupoonat Logo",
        },
      ],
    },
  };
}

export default async function StoresPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale;
  const t = await getTranslations({ locale });
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;

  // First page of stores, fetched on the server (Data Cache, 5 min) so that
  // (a) the prerendered HTML carries real store links (Suspense fallback below)
  // and (b) <Stores/> starts from the same data through react-query hydration
  // instead of a skeleton + client fetch. Query key mirrors useStoresQuery()
  // with no filters and no signed-in user; a mismatch only means no hydration.
  const firstPage: any = await api.static("stores/all-stores?page=1", 300);
  const queryClient = new QueryClient();
  if (firstPage?.stores) {
    await queryClient.prefetchQuery({
      queryKey: ["stores", 1, "", null, null, false],
      queryFn: () => Promise.resolve(firstPage),
    });
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}stores/#webpage`,
    name: "كل المتاجر: كوبونات خصم لجميع متاجر التسوق في الشرق الاوسط",
    description: "بعد الدخول يمكنك ايجاد والبحث عن اى متجر تريد له كوبونات خصم بكل سهولة ومجاناً",
    url: `${baseUrl}stores/`,
    inLanguage: locale,
    isPartOf: {
      "@type": "WebSite",
      name: "كوبونات",
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
          {/* Stores reads useSearchParams(); the Suspense boundary lets the page prerender (ISR) */}
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense
              fallback={
                firstPage?.stores?.length ? (
                  <StoresStaticGrid stores={firstPage.stores} />
                ) : (
                  <StoresSkeleton />
                )
              }
            >
              <Stores />
            </Suspense>
          </HydrationBoundary>
        </div>
      </section>
    </>
  );
}
