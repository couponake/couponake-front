import AllCountriesPage from "@/components/Pages/AllCountriesPage";
import { getCountries } from "@/services/public-reference-data";
import React from "react";
import { getSettingEnabled } from "@/services/getIndexingSettings";
import { SettingsEnum } from "@/types/settingsEnum";
import CuratedStoreWidget from "@/components/shared/CuratedStoreWidget";
import JsonLd from "@/components/shared/JsonLd";
import { HOME_CRUMB, SITE_URL, breadcrumbNode, buildGraph, webPageNode } from "@/lib/structured-data";

export async function generateMetadata() {
  const locale = "ar"; // site renders in Arabic only (static)
  const isArabic = locale === "ar";

  //get the indexing settings of the all-countries page
  const indexingCountries = await getSettingEnabled(SettingsEnum.Countries);

  return {
    title: isArabic ? "اختر دولتك: أكواد خصم تعمل في بلدك | كوبوناك" : "Pick your country: discount codes that work where you are | Couponake",
    description: isArabic ? "الكود الذي يعمل في السعودية قد لا يعمل في مصر. اختر دولتك لترى فقط المتاجر والأكواد التي جرّبناها على عنوان شحن محلي." : "A code that works in Saudi Arabia may fail in Egypt. Pick your country to see only stores and codes we tested with a local address.",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}all_countries/` || "",
    },
    robots: {
      index: indexingCountries,
    },
    openGraph: {
      title: isArabic ? "اختر دولتك: أكواد خصم تعمل في بلدك | كوبوناك" : "Pick your country: discount codes that work where you are | Couponake",
      description: isArabic ? "الكود الذي يعمل في السعودية قد لا يعمل في مصر. اختر دولتك لترى فقط المتاجر والأكواد التي جرّبناها على عنوان شحن محلي." : "A code that works in Saudi Arabia may fail in Egypt. Pick your country to see only stores and codes we tested with a local address.",
      images: [
        {
          url: "https://couponake.com/couponak-logo.svg",
          alt: "Couponake Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isArabic ? "اختر دولتك: أكواد خصم تعمل في بلدك | كوبوناك" : "Pick your country: discount codes that work where you are | Couponake",
      description: isArabic ? "الكود الذي يعمل في السعودية قد لا يعمل في مصر. اختر دولتك لترى فقط المتاجر والأكواد التي جرّبناها على عنوان شحن محلي." : "A code that works in Saudi Arabia may fail in Egypt. Pick your country to see only stores and codes we tested with a local address.",
      images: [
        {
          url: "https://couponake.com/couponak-logo.svg",
          alt: "Couponake Logo",
        },
      ],
    },
  };
}

const AllCountries = async () => {
  // First page of countries fetched on the server so the 12 country links are
  // in the prerendered HTML. The client component fetched them through
  // /api/home/countries-meta, which robots.txt disallows — so even after
  // rendering, crawlers saw an empty list (audit finding F-04).
  const countriesRes = await getCountries();
  const initialCountries = Array.isArray(countriesRes?.data)
    ? countriesRes.data
    : null;
  const initialPagination = countriesRes?.meta ?? null;

  const pageUrl = `${SITE_URL}all_countries/`;
  // Name/description mirror this page's <title> and meta description.
  const graph = buildGraph([
    webPageNode({
      type: "CollectionPage",
      url: pageUrl,
      name: "اختر دولتك: أكواد خصم تعمل في بلدك",
      description:
        "الكود الذي يعمل في السعودية قد لا يعمل في مصر. اختر دولتك لترى فقط المتاجر والأكواد التي جرّبناها على عنوان شحن محلي.",
    }),
    breadcrumbNode(pageUrl, [HOME_CRUMB, { name: "خصومات حسب بلدك", url: pageUrl }]),
  ]);

  return (
    <>
      <JsonLd data={graph} />
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
