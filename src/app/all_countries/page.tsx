import AllCountriesPage from "@/components/Pages/AllCountriesPage";
import { getCountries } from "@/services/public-reference-data";
import React from "react";
import { getSettingEnabled } from "@/services/getIndexingSettings";
import { SettingsEnum } from "@/types/settingsEnum";
import CuratedStoreWidget from "@/components/shared/CuratedStoreWidget";

export async function generateMetadata() {
  const locale = "ar"; // site renders in Arabic only (static)
  const isArabic = locale === "ar";

  //get the indexing settings of the all-countries page
  const indexingCountries = await getSettingEnabled(SettingsEnum.Countries);

  return {
    title: isArabic
      ? "كل البلدان: صفحة مخصصة للبحث عن الكوبونك داخل بلدك"
      : "All Countries: A dedicated page for searching for coupons within your country",
    description: isArabic
      ? "نسهل عليك عبر هذة الصفحة البحث والوصول الى كوبونك الخصم باختيار البلد الذي تحب"
      : "This page makes it easy for you to search and access discount coupons by selecting the country you prefer",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_Couponake_WEBSITE_URL}all_countries/` || "",
    },
    robots: {
      index: indexingCountries,
    },
    openGraph: {
      title: isArabic
        ? "كل البلدان: صفحة مخصصة للبحث عن الكوبونك داخل بلدك"
        : "All Countries: A dedicated page for searching for coupons within your country",
      description: isArabic
        ? "نسهل عليك عبر هذة الصفحة البحث والوصول الى كوبونك الخصم باختيار البلد الذي تحب"
        : "This page makes it easy for you to search and access discount coupons by selecting the country you prefer",
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
        ? "كل البلدان: صفحة مخصصة للبحث عن الكوبونك داخل بلدك"
        : "All Countries: A dedicated page for searching for coupons within your country",
      description: isArabic
        ? "نسهل عليك عبر هذة الصفحة البحث والوصول الى كوبونك الخصم باختيار البلد الذي تحب"
        : "This page makes it easy for you to search and access discount coupons by selecting the country you prefer",
      images: [
        {
          url: "https://couponake.com/couponakeLogo.webp",
          alt: "Couponake Logo",
        },
      ],
    },
  };
}

const AllCountries = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_Couponake_WEBSITE_URL;
  // First page of countries fetched on the server so the 12 country links are
  // in the prerendered HTML. The client component fetched them through
  // /api/home/countries-meta, which robots.txt disallows — so even after
  // rendering, crawlers saw an empty list (audit finding F-04).
  const countriesRes = await getCountries();
  const initialCountries = Array.isArray(countriesRes?.data)
    ? countriesRes.data
    : null;
  const initialPagination = countriesRes?.meta ?? null;

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
            name: "كوبونك لبلدك",
            item: `${baseUrl}all_countries/`,
          },
        ],
      },
      {
        "@type": "Organization",
        name: "كوبونك",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}couponakeLogo.webp`,
        },
      },
      {
        "@type": "WebPage",
        name: "كل البلدان: صفحة مخصصة للبحث عن الكوبونك داخل بلدك",
        description:
          "نسهل عليك عبر هذة الصفحة البحث والوصول الى كوبونك الخصم باختيار البلد الذي تحب",
        url: `${baseUrl}all_countries/`,
        publisher: {
          "@type": "Organization",
          name: "كوبونك",
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}couponakeLogo.webp`,
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
      <section className="container flex flex-col md:flex-row-reverse gap-5 py-4 overflow-hidden">
        <AllCountriesPage
        initialCountries={initialCountries}
        initialPagination={initialPagination}
      />
        <CuratedStoreWidget />
      </section>
    </>
  );
};

export default AllCountries;
