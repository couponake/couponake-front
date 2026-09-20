import React, { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getCategories } from "@/services/public-reference-data";
import StoresSkeleton from "@/components/loadingUis/StoresSkeleton";
import Categories from "@/components/Pages/Categories";
import CategoriesStaticGrid from "@/components/Pages/Categories/StaticGrid";
import { getSettingEnabled } from "@/services/getIndexingSettings";
import { SettingsEnum } from "@/types/settingsEnum";
import CuratedStoreWidget from "@/components/shared/CuratedStoreWidget";

export const experimental_ppr = true;

export async function generateMetadata() {
  const locale = "ar"; // site renders in Arabic only (static)
  const isArabic = locale === "ar";
  //get the indexing settings of the Category page
  const indexingCategory = await getSettingEnabled(SettingsEnum.Categories);

  return {
    title: isArabic
      ? "الفئات: صفحة لتصنيف الكوبونك وفق فئات المنتجات"
      : "Categories: A page that categorizes coupons by product category",
    description: isArabic
      ? "يتم تصنيف اكواد و كوبونك الخصم وفق فئات المنتجات حتى يسهل الوصول للكوبونك التى تريدها باقل مجهود"
      : "Discount codes and coupons are categorized by product category, making it easy to find the coupons you want with minimal effort",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_Couponake_WEBSITE_URL}categories/` || "",
    },
    robots: {
      index: indexingCategory,
    },
    openGraph: {
      title: isArabic
        ? "الفئات: صفحة لتصنيف الكوبونك وفق فئات المنتجات"
        : "Categories: A page that categorizes coupons by product category",
      description: isArabic
        ? "يتم تصنيف اكواد و كوبونك الخصم وفق فئات المنتجات حتى يسهل الوصول للكوبونك التى تريدها باقل مجهود"
        : "Discount codes and coupons are categorized by product category, making it easy to find the coupons you want with minimal effort",
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
        ? "الفئات: صفحة لتصنيف الكوبونك وفق فئات المنتجات"
        : "Categories: A page that categorizes coupons by product category",
      description: isArabic
        ? "يتم تصنيف اكواد و كوبونك الخصم وفق فئات المنتجات حتى يسهل الوصول للكوبونك التى تريدها باقل مجهود"
        : "Discount codes and coupons are categorized by product category, making it easy to find the coupons you want with minimal effort",
      images: [
        {
          url: "https://couponake.com/couponakeLogo.webp",
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
  const baseUrl = process.env.NEXT_PUBLIC_Couponake_WEBSITE_URL;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "الرئيسية",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "الفئات",
        item: `${baseUrl}categories/`,
      },
    ],
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "كوبونك",
    url: `${baseUrl}`,
    logo: `${baseUrl}couponakeLogo.webp`,
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "الفئات: صفحة لتصنيف الكوبونك وفق فئات المنتجات",
    description: "يتم تصنيف اكواد و كوبونك الخصم وفق فئات المنتجات حتى يسهل الوصول للكوبونك التى تريدها باقل مجهود",
    url: `${baseUrl}categories/`,
    publisher: {
      "@type": "Organization",
      name: "كوبونك",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}couponakeLogo.webp`,
      },
    },
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [breadcrumbSchema, organizationSchema, websiteSchema],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
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
