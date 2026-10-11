import React, { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getCategories } from "@/services/public-reference-data";
import StoresSkeleton from "@/components/loadingUis/StoresSkeleton";
import Categories from "@/components/Pages/Categories";
import CategoriesStaticGrid from "@/components/Pages/Categories/StaticGrid";
import { getSettingEnabled } from "@/services/getIndexingSettings";
import { SettingsEnum } from "@/types/settingsEnum";
import CuratedStoreWidget from "@/components/shared/CuratedStoreWidget";
import JsonLd from "@/components/shared/JsonLd";
import { HOME_CRUMB, SITE_URL, absoluteUrl, breadcrumbNode, buildGraph, ref, webPageNode } from "@/lib/structured-data";

export const experimental_ppr = true;

export async function generateMetadata() {
  const locale = "ar"; // site renders in Arabic only (static)
  const isArabic = locale === "ar";
  //get the indexing settings of the Category page
  const indexingCategory = await getSettingEnabled(SettingsEnum.Categories);

  return {
    title: isArabic ? "الفئات: أكواد خصم مرتبة حسب ما تشتريه | كوبوناك" : "Categories: discount codes sorted by what you buy | Couponake",
    description: isArabic ? "أزياء، إلكترونيات، جمال، سفر، مطاعم وغيرها: اختر الفئة وشوف المتاجر التي فيها أكواد فعّالة اليوم بدل البحث متجرًا متجرًا." : "Fashion, electronics, beauty, travel, food and more: pick a category and see the stores with working codes today.",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}categories/` || "",
    },
    robots: {
      index: indexingCategory,
    },
    openGraph: {
      title: isArabic ? "الفئات: أكواد خصم مرتبة حسب ما تشتريه | كوبوناك" : "Categories: discount codes sorted by what you buy | Couponake",
      description: isArabic ? "أزياء، إلكترونيات، جمال، سفر، مطاعم وغيرها: اختر الفئة وشوف المتاجر التي فيها أكواد فعّالة اليوم بدل البحث متجرًا متجرًا." : "Fashion, electronics, beauty, travel, food and more: pick a category and see the stores with working codes today.",
      images: [
        {
          url: "https://couponake.com/couponak-logo.svg",
          alt: "Couponake Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isArabic ? "الفئات: أكواد خصم مرتبة حسب ما تشتريه | كوبوناك" : "Categories: discount codes sorted by what you buy | Couponake",
      description: isArabic ? "أزياء، إلكترونيات، جمال، سفر، مطاعم وغيرها: اختر الفئة وشوف المتاجر التي فيها أكواد فعّالة اليوم بدل البحث متجرًا متجرًا." : "Fashion, electronics, beauty, travel, food and more: pick a category and see the stores with working codes today.",
      images: [
        {
          url: "https://couponake.com/couponak-logo.svg",
          alt: "Couponake Logo",
        },
      ],
    },
  };
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale;
  // All 29 categories in one page (the API defaults to 12/page): every category
  // link is in the prerendered HTML and the grid needs no pagination.
  const categories = await getCategories();
  const t = await getTranslations({ locale });

  const pageUrl = `${SITE_URL}categories/`;
  const list: any[] = Array.isArray(categories?.categories) ? categories.categories : [];

  // Name/description mirror this page's <title> and meta description; the
  // ItemList holds the category links rendered in the server HTML grid.
  const graph = buildGraph([
    webPageNode({
      type: "CollectionPage",
      url: pageUrl,
      name: "الفئات: أكواد خصم مرتبة حسب ما تشتريه",
      description:
        "أزياء، إلكترونيات، جمال، سفر، مطاعم وغيرها: اختر الفئة وشوف المتاجر التي فيها أكواد فعّالة اليوم بدل البحث متجرًا متجرًا.",
      extra: list.length ? { mainEntity: ref(`${pageUrl}#list`) } : undefined,
    }),
    ...(list.length
      ? [
          {
            "@type": "ItemList",
            "@id": `${pageUrl}#list`,
            numberOfItems: list.length,
            itemListElement: list
              .filter((category) => category?.slug && category?.name)
              .map((category, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: category.name,
                url: absoluteUrl(`coupon-category/${category.slug}/`),
              })),
          },
        ]
      : []),
    breadcrumbNode(pageUrl, [HOME_CRUMB, { name: "الفئات", url: pageUrl }]),
  ]);

  return (
    <>
      <JsonLd data={graph} />
      <section className="bg-white">
        <div className="bg-gradient-to-tr from-blue-200  via-main-600 to-blue-300 pt-4">
          <div className="container mx-auto py-4">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h1 className="mb-4 text-4xl font-bold sm:text-6xl sm:leading-[4rem]">
                  {t("common.categories")}
                </h1>
              </div>
            </div>
          </div>
        </div>
       <div className="container px-0 py-18 overflow-hidden flex flex-col md:flex-row-reverse gap-5">
          {/* Fallback = server-rendered links (crawlable); <Categories/> is client-rendered (useSearchParams) */}
          <Suspense
            fallback={
              categories?.categories?.length ? (
                <CategoriesStaticGrid categories={categories.categories} />
              ) : (
                <StoresSkeleton hideSideBar />
              )
            }
          >
            <Categories {...categories} />
          </Suspense>
          <CuratedStoreWidget />
        </div>
      </section>
    </>
  );
}
