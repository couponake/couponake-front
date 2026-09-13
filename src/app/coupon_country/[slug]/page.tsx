import AddToFavoriteBtn from "@/components/StorePageComponents/AddToFavoriteBtn";
import Empty from "@/components/Empty";
import api from "@/lib/api";
import { StoreProps } from "@/types";
import { Avatar } from "@heroui/avatar";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { getSettingEnabled } from "@/services/getIndexingSettings";
import { SettingsEnum } from "@/types/settingsEnum";

export const experimental_ppr = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const response: any = await api.dynamic(`home/country/${slug}`);
  const country_seo: any = response?.data?.country_seo;
  //get the indexing settings of the Country page
  const indexingCountry = await getSettingEnabled(SettingsEnum.Countries);


  return {
    title: country_seo?.title,
    description: country_seo?.description,
    alternates: {
      canonical:
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}coupon_country/${slug}/` || "",
    },
    robots: {
      index: indexingCountry,
    },
    openGraph: {
      title: country_seo?.title,
      description: country_seo?.description,
      images: [
        {
          url: country_seo?.image,
          alt: country_seo?.description,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: country_seo?.title,
      description: country_seo?.description,
      images: [
        {
          url: country_seo?.image,
          alt: country_seo?.description,
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
  const { locale, slug } = await params;
  const response: any = await api.dynamic(`home/country/${slug}`);
  const country: string = response?.data?.country;
  const stores: StoreProps[] = response?.data?.stores;

  // Unknown country (API 404): a real 404 page/status instead of an empty
  // "متاجر دولة undefined" page served with 200 (soft 404).
  if (!country) {
    notFound();
  }

  const t = await getTranslations({ locale });
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;

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
        name: "كوبونات",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}coupoonatLogo.webp`,
        },
      },
      {
        "@type": "WebPage",
        name: `متاجر دولة ${country}`,
        description: `أكواد خصم وعروض المتاجر ${country}`,
        url: `${baseUrl}coupon_country/${slug}/`,
        isPartOf: {
          "@type": "WebSite",
          name: "كوبونات",
          url: baseUrl,
        },
        publisher: {
          "@type": "Organization",
          name: "كوبونات",
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}coupoonatLogo.webp`,
          },
        },
        mainEntity: {
          "@type": "CollectionPage",
          name: `متاجر دولة ${country}`,
          hasPart: stores?.slice(0, 5)?.map((store: any, index: number) => ({
            "@type": "WebPage",
            name: store.store_name,
            url: `${baseUrl}store/${store.slug}`,
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
