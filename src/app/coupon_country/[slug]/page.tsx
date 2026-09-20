import AddToFavoriteBtn from "@/components/StorePageComponents/AddToFavoriteBtn";
import Empty from "@/components/Empty";
import { getCountryDetail } from "@/services/public-detail-data";
import { Avatar } from "@heroui/avatar";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import React from "react";
import { getSettingEnabled } from "@/services/getIndexingSettings";
import { SettingsEnum } from "@/types/settingsEnum";

// Keep redirects out of Full Route Cache (Next.js #82117). The public data
// loader still caches validated anonymous data for 300 seconds. connection()
// preserves explicit caches in the layout, unlike force-dynamic.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  await connection();
  const { slug } = await params;
  const response = await getCountryDetail(slug);
  if (response.kind === "redirect") return {
    title: "Redirecting...",
    alternates: { canonical: response.redirect_url },
    robots: { index: false, follow: true },
  };
  if (response.kind === "not_found") notFound();
  const country_seo = response.data.data.country_seo;
  //get the indexing settings of the Country page
  const indexingCountry = await getSettingEnabled(SettingsEnum.Countries);


  return {
    title: country_seo?.title,
    description: country_seo?.description,
    alternates: {
      canonical:
        `${process.env.NEXT_PUBLIC_Couponake_WEBSITE_URL}coupon_country/${slug}/` || "",
    },
    robots: {
      index: indexingCountry,
    },
    openGraph: {
      title: country_seo?.title,
      description: country_seo?.description,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_Couponake_WEBSITE_URL}couponakeLogo.webp`,
          alt: "كوبونك",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: country_seo?.title,
      description: country_seo?.description,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_Couponake_WEBSITE_URL}couponakeLogo.webp`,
          alt: "كوبونك",
        },
      ],
    },
  };
}

export default async function CouponCountry({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  await connection();
  const { locale, slug } = await params;
  const response = await getCountryDetail(slug);
  if (response.kind === "redirect") {
    redirect(response.redirect_url);
  }
  if (response.kind === "not_found") notFound();
  const { country, stores } = response.data.data;

  const t = await getTranslations({ locale });
  const baseUrl = process.env.NEXT_PUBLIC_Couponake_WEBSITE_URL;

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
            name: `متاجر دولة ${country}`,
            item: `${baseUrl}coupon_country/${slug}/`,
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
        name: `متاجر دولة ${country}`,
        description: `أكواد خصم وعروض المتاجر ${country}`,
        url: `${baseUrl}coupon_country/${slug}/`,
        isPartOf: {
          "@type": "WebSite",
          name: "كوبونك",
          url: baseUrl,
        },
        publisher: {
          "@type": "Organization",
          name: "كوبونك",
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}couponakeLogo.webp`,
          },
        },
        mainEntity: {
          "@type": "CollectionPage",
          name: `متاجر دولة ${country}`,
          hasPart: stores?.slice(0, 5)?.map((store: any, index: number) => ({
            "@type": "WebPage",
            name: store.store_name,
            url: `${baseUrl}store/${store.slug}/`,
            identifier: store.id,
            position: index + 1,
          })),
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
      <section className="bg-white -mt-9 sm:-mt-7">
        <div className="bg-gradient-to-tr from-blue-200  via-main-600 to-blue-300 pt-5 sm:pt-12">
          <div className="container mx-auto py-8">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h1 className="mb-4 text-4xl font-bold sm:text-6xl sm:leading-[4rem]">
                  {t("The stores of")} {country}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="container mt-8">
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
            {stores && stores.length > 0 ? (
              stores?.map((store) => (
                <div
                  key={store?.id}
                  className="relative flex flex-col sm:flex-row items-center justify-between 
                  rounded-2xl border border-neutral-200 bg-white 
                  shadow-sm hover:shadow-md transition-shadow duration-300 
                  p-4 sm:p-5 gap-y-3 sm:gap-y-0 sm:gap-x-4 
                  w-full max-w-md mx-auto"
                >
                  <Link
                    prefetch={false}
                    target="_self"
                    href={`/store/${store?.slug}`}
                    className="flex items-center w-full gap-4 flex-grow max-sm:flex-col max-sm:justify-center"
                  >
                    <Avatar
                      src={store?.image || "noPreview.webp"}
                      name={store?.store_name}
                      className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0"
                    />

                    <div className="flex-grow min-w-0">
                      <h2
                        className="sm:text-lg md:text-xl font-bold text-neutral-900  max-sm:text-center"
                        title={store?.store_name}
                      >
                        {store?.store_name}
                      </h2>

                      {/* {store?.description && (
                      <p 
                        className="text-sm text-neutral-600 
                          max-h-12 overflow-y-auto break-words"
                        dangerouslySetInnerHTML={{ __html: store?.description }}
                      />
                    )} */}
                    </div>
                  </Link>

                  <div className="flex-shrink-0 sm:ml-4">
                    {store?.id && (
                      <AddToFavoriteBtn
                        storeId={store?.id}
                        isFavoriteInitially={store?.isInFavorites}
                      />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full">
                <Empty />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
