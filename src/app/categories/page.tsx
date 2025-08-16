import React, { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import api from "@/lib/api";
import StoresSkeleton from "@/components/loadingUis/StoresSkeleton";
import Categories from "@/components/Pages/Categories";
import { cookies } from "next/headers";
import { useSettingEnabled } from "@/hooks/useIndexingSettings";
import { SettingsEnum } from "@/types/settingsEnum";

export const experimental_ppr = true;

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "ar";
  const isArabic = locale === "ar";
  //get the indexing settings of the Category page
  const indexingCategory = await useSettingEnabled(SettingsEnum.Categories);

  return {
    title: isArabic
      ? "تصنيفات المتاجر لفئات لسهولة الحصول على الكوبونات |الأفضل"
      : "Store Categories for Easy Coupon Discovery | Alafdal",
    description: isArabic
      ? "استعرض المتاجر حسب الفئة وحدد الكوبون المناسب دون عناء"
      : "Browse stores by category and spot the right coupon effortlessly",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}categories/` || "",
    },
    robots: {
      index: indexingCategory,
    },
    openGraph: {
      title: isArabic
        ? "تصنيفات المتاجر لفئات لسهولة الحصول على الكوبونات |الأفضل"
        : "Store Categories for Easy Coupon Discovery | Alafdal",
      description: isArabic
        ? "استعرض المتاجر حسب الفئة وحدد الكوبون المناسب دون عناء"
        : "Browse stores by category and spot the right coupon effortlessly",
      images: [
        {
          url: "https://couponalyom.com/coupoonatLogo.webp",
          alt: "Alafdal Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isArabic
        ? "تصنيفات المتاجر لفئات لسهولة الحصول على الكوبونات |الأفضل"
        : "Store Categories for Easy Coupon Discovery | Alafdal",
      description: isArabic
        ? "استعرض المتاجر حسب الفئة وحدد الكوبون المناسب دون عناء"
        : "Browse stores by category and spot the right coupon effortlessly",
      images: [
        {
          url: "https://couponalyom.com/coupoonatLogo.webp",
          alt: "Alafdal Logo",
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
  const categories: any = await api.static("categories");
  const t = await getTranslations({ locale });
  const isArabic = locale === "ar";
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;

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
    name: "الأفضل",
    url: `${baseUrl}`,
    logo: `${baseUrl}coupoonatLogo.webp`,
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "تصنيفات المتاجر لفئات لسهولة الحصول على الكوبونات |الأفضل",
    description: "استعرض المتاجر حسب الفئة وحدد الكوبون المناسب دون عناء",
    url: `${baseUrl}categories/`,
    publisher: {
      "@type": "Organization",
      name: "الأفضل",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}coupoonatLogo.webp`,
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
      <section className="bg-white -mt-9 sm:-mt-7">
        <div className="bg-gradient-to-tr from-blue-200  via-main-600 to-blue-300 pt-5 sm:pt-12">
          <div className="container mx-auto py-8">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h1 className="mb-4 text-4xl font-bold sm:text-6xl sm:leading-[4rem]">
                  {t("common.categories")}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-8">
          <Suspense fallback={<StoresSkeleton hideSideBar />}>
            <Categories {...categories} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
