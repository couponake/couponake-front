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
      ? "اختار كوبونات الخصم وفق الدولة الخاصة بك من هنا |الأفضل"
      : "Pick Discount Coupons by Your Country | Alafdal",
    description: isArabic
      ? "اختر دولتك لتحصل على أكواد خصم مخصصة لمتاجرك المحلية"
      : "Select your country to unlock tailored discount codes for local stores",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}all_countries/` || "",
    },
    robots: {
      index: indexingCountries
    },
    openGraph: {
      title: isArabic
        ? "اختار كوبونات الخصم وفق الدولة الخاصة بك من هنا |الأفضل"
        : "Pick Discount Coupons by Your Country | Alafdal",
      description: isArabic
        ? "اختر دولتك لتحصل على أكواد خصم مخصصة لمتاجرك المحلية"
        : "Select your country to unlock tailored discount codes for local stores",
      images: [
        {
          url: "https://couponalyom.com/AlafdalNewLogo.webp",
          alt: "Alafdal Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isArabic
        ? "اختار كوبونات الخصم وفق الدولة الخاصة بك من هنا |الأفضل"
        : "Pick Discount Coupons by Your Country | Alafdal",
      description: isArabic
        ? "اختر دولتك لتحصل على أكواد خصم مخصصة لمتاجرك المحلية"
        : "Select your country to unlock tailored discount codes for local stores",
      images: [
        {
          url: "https://couponalyom.com/AlafdalNewLogo.webp",
          alt: "Alafdal Logo",
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
            name: "جميع الدول",
            item: `${baseUrl}all_countries/`,
          },
        ],
      },
      {
        "@type": "Organization",
        name: "الأفضل",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}AlafdalNewLogo.webp`,
        },
      },
      {
        "@type": "WebPage",
        name: "اختار كوبونات الخصم وفق الدولة الخاصة بك من هنا |الأفضل",
        description: "اختر دولتك لتحصل على أكواد خصم مخصصة لمتاجرك المحلية",
        url: `${baseUrl}all_countries/`,
        publisher: {
          "@type": "Organization",
          name: "الأفضل",
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}AlafdalNewLogo.webp`,
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
