import AllCountriesPage from "@/components/Pages/AllCountriesPage";
import { useSettingEnabled } from "@/hooks/useIndexingSettings";
import { SettingsEnum } from "@/types/settingsEnum";
import { useTranslations } from "next-intl";
import { cookies } from "next/headers";
import React from "react";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "ar";
  const isArabic = locale === "ar";

  //get the indexing settings of the all-countries page
  const indexingCountries = await useSettingEnabled(SettingsEnum.Countries);


  return {
    title: isArabic
      ? "كل البلدان: صفحة مخصصة للبحث عن الكوبونات داخل بلدك"
      : "All Countries: A dedicated page for searching for coupons within your country",
    description: isArabic
      ? "نسهل عليك عبر هذة الصفحة البحث والوصول الى كوبونات الخصم باختيار البلد الذي تحب"
      : "This page makes it easy for you to search and access discount coupons by selecting the country you prefer",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}all_countries/` || "",
    },
    robots: {
      index: indexingCountries
    },
    openGraph: {
      title: isArabic
        ? "كل البلدان: صفحة مخصصة للبحث عن الكوبونات داخل بلدك"
        : "All Countries: A dedicated page for searching for coupons within your country",
      description: isArabic
        ? "نسهل عليك عبر هذة الصفحة البحث والوصول الى كوبونات الخصم باختيار البلد الذي تحب"
        : "This page makes it easy for you to search and access discount coupons by selecting the country you prefer",
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
        ? "كل البلدان: صفحة مخصصة للبحث عن الكوبونات داخل بلدك"
        : "All Countries: A dedicated page for searching for coupons within your country",
      description: isArabic
        ? "نسهل عليك عبر هذة الصفحة البحث والوصول الى كوبونات الخصم باختيار البلد الذي تحب"
        : "This page makes it easy for you to search and access discount coupons by selecting the country you prefer",
      images: [
        {
          url: "https://coupoonat.com/coupoonatLogo.webp",
          alt: "Coupoonat Logo",
        },
      ],
    },
  };
}

const AllCountries = () => {
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;
  const t = useTranslations();

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
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
            name: "كوبونات لبلدك",
            item: `${baseUrl}all_countries/`,
          },
        ],
      },
      {
        "@type": "Organization",
        name: "كوبونات",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}coupoonatLogo.webp`,
        },
      },
      {
        "@type": "WebPage",
        name: "كل البلدان: صفحة مخصصة للبحث عن الكوبونات داخل بلدك",
        description: "نسهل عليك عبر هذة الصفحة البحث والوصول الى كوبونات الخصم باختيار البلد الذي تحب",
        url: `${baseUrl}all_countries/`,
        publisher: {
          "@type": "Organization",
          name: "كوبونات",
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}coupoonatLogo.webp`,
          },
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
      <AllCountriesPage />
    </>
  );
};

export default AllCountries;
