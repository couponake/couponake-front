import React from "react";
import { getTranslations } from "next-intl/server";
import Stores from "@/components/Pages/Stores";
import { cookies } from "next/headers";
import { useSettingEnabled } from "@/hooks/useIndexingSettings";
import { SettingsEnum } from "@/types/settingsEnum";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "ar";
  const isArabic = locale === "ar";
  //get the indexing settings of the Stores page
  const indexingStores = await useSettingEnabled(SettingsEnum.Stores);

  return {
    title: isArabic
      ? "كوبونات خصم لكل متاجر التسوق الالكتروني في السعودية |كوبونات"
      : "Coupoonat | Discount Coupons for Saudi Online Stores",
    description: isArabic
      ? "وفّر في كل عملية شراء عبر الإنترنت مع كوبونات حصرية لمتاجر السعودية"
      : "Save on every online order with exclusive Saudi e-store coupons",
    alternates: {
      canonical: "https://couponalyom.com/stores/",
    },
    robots: {
      index: indexingStores,
    },
    openGraph: {
      title: isArabic
        ? "كوبونات خصم لكل متاجر التسوق الالكتروني في السعودية |كوبونات"
        : "Coupoonat | Discount Coupons for Saudi Online Stores",
      description: isArabic
        ? "وفّر في كل عملية شراء عبر الإنترنت مع كوبونات حصرية لمتاجر السعودية"
        : "Save on every online order with exclusive Saudi e-store coupons",
      images: [
        {
          url: "https://couponalyom.com/coupoonatLogo.webp",
          alt: "Coupoonat Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isArabic
        ? "كوبونات خصم لكل متاجر التسوق الالكتروني في السعودية |كوبونات"
        : "Coupoonat | Discount Coupons for Saudi Online Stores",
      description: isArabic
        ? "وفّر في كل عملية شراء عبر الإنترنت مع كوبونات حصرية لمتاجر السعودية"
        : "Save on every online order with exclusive Saudi e-store coupons",
      images: [
        {
          url: "https://couponalyom.com/coupoonatLogo.webp",
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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}stores/#webpage`,
    name: "كوبونات خصم لكل متاجر التسوق الالكتروني في السعودية |كوبونات",
    description:
      "وفّر في كل عملية شراء عبر الإنترنت مع كوبونات حصرية لمتاجر السعودية",
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
      <section className="bg-white -mt-9 sm:-mt-7">
        <div className="bg-gradient-to-tr from-blue-200 via-main-600 to-blue-300 pt-5 sm:pt-12">
          <div className="container mx-auto py-8">
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
          <Stores />
        </div>
      </section>
    </>
  );
}
