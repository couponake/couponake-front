"use client";
import ShowCouponDetails from "@/components/Modals/ShowCouponDetails";
import FAQ from "@/components/Pages/Home/FAQ";
import Author from "@/components/StorePageComponents/Author";
import FollowStore from "@/components/StorePageComponents/FollowStore";
import StoreCharts from "@/components/StorePageComponents/StoreCharts/StoreCharts";
import StoreCoupons from "@/components/StorePageComponents/StoreCoupons";
import StoreHeader from "@/components/StorePageComponents/StoreHeader";
import StoreRatingCard from "@/components/StorePageComponents/StoreRatingCard";
import StoreSidePart from "@/components/StorePageComponents/StoreSidePart";
import { Skeleton } from "@/components/ui/skeleton";
import useDetectMobile from "@/hooks/useDetectMobile";
import { useStoreData } from "@/hooks/useStoreData";
import { getContentDirection, secureStoreHtmlLinks } from "@/lib/storeHtmlUtils";
import ScrollTracker from "@/services/ScrollPageAnalytics";
import { CategoryItem, InfoItem, statisticsType } from "@/types";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { useLocale, useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import Link from "next/link";
import React from "react";
import styles from "@/styles/htmlTablesScroll.module.css";
import Image from "next/image";

import Hero from "../../Home/Hero";

declare module "react-window";

const CustomersReviews = dynamic(
  () => import("@/components/Pages/Home/CustomersReviews"),
  {
    loading: () => <Skeleton className="rounded-md w-full h-[400px]" />,
    ssr: false,
  },
);

const ShowStore = ({ slug }: { slug: string }) => {
  const isMobile = useDetectMobile();
  const t = useTranslations();
  const locale = useLocale();
  // const setSelectedCoupon = useStore((store) => store.setSelectedCoupon);
  // Fetch store data using React Query
  const { data, isLoading, isError } = useStoreData(slug);

  // Destructure data for easier access
  const {
    store,
    similarStores = [],
    store_reviews = [],
    store_banner = null,
    store_faqs = [],
    store_infos = [],
    side_table = null,
  } = data || {};

  const store_name_lang: string =
    locale === "ar"
      ? (store?.store_name?.split("-")[0] ?? "")
      : store?.store_name?.split("-")[1] || store?.store_name || "";

  const statistics: statisticsType = {
    store_love: store?.store_love ?? "0%",
    currency: store?.currency ?? "",
    saved_price: Number(store?.saved_price) ?? 0,
    orders_number: store?.orders_number ?? 0,
    total_used_coupons: store?.total_used_coupons ?? 0,
    max_coupon_discount: data?.max_coupon_discount ?? "null",
    max_coupon_used: data?.max_coupon_used ?? "null",
    popular_category: data?.popular_category ?? {
      count: 0,
      category: {} as CategoryItem,
    },
    returned_visitors: data?.returned_visitors ?? "0%",
    coupon_peak_times: store?.coupon_peak_times ?? "null",
    popular_discounts: store?.popular_discounts ?? "null",
    coupon_share_rate: store?.coupon_share_rate ?? "0",
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container pt-5 pb-10">
        <div className="flex flex-col gap-4">
          <div className="h-20 bg-gray-200 rounded-lg animate-pulse" />
          <div className="flex gap-6">
            <div className="w-1/4 h-96 bg-gray-200 rounded-lg animate-pulse hidden md:block" />
            <div className="flex-1 space-y-4">
              <div className="h-40 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-20 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-60 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="container pt-6 md:pt-10 lg:pt-10 pb-5 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          {"Error Loading Store"}
        </h2>
        <p className="text-gray-700 mb-4">
          {"We couldn't load the store information. Please try again later."}
        </p>
        <Button color="primary" as={Link} href="/stores">
          {"Browse All Stores"}
        </Button>
      </div>
    );
  }

  // If no store data is available
  if (!store) {
    return (
      <div className="container pt-6 md:pt-10 lg:pt-10 pb-5 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {t("Store Not Found")}
        </h2>
        <p className="text-gray-700 mb-4">
          {t(
            "The store you are looking for does not exist or has been removed",
          )}
        </p>
        <Button color="primary" as={Link} href="/stores">
          {t("Browse All Stores")}
        </Button>
      </div>
    );
  }

  function makeSafeHtml(content: string | null): { __html: string } {
    return { __html: secureStoreHtmlLinks(content ?? "") };
  }

  return (
    <div id="show store" className="relative">
      <ScrollTracker event_name={`${store?.slug}_page_depth`} />
      <ShowCouponDetails storeName={store?.store_name} />
      <FollowStore links={store?.social_links} storeName={store?.slug} />
      <Author author={store?.responsible} storeName={store?.slug} />
      <StoreHeader
        store_id={store.id as number}
        store_slug={store.slug}
        store_image={store.image}
        store_title={store.title}
        isMobile={isMobile}
        store_rate={store.rate}
        store_voters={store.voters}
        store_isInFavorites={store.isInFavorites}
        locale={locale}
        t={t}
      />
      <section className="container flex flex-col md:flex-row-reverse gap-10 pt-6 md:pt-10 lg:pt-10 pb-5">
        {/* main content */}
        <div className="w-full sm:w-full md:w-fit lg:w-fit xl:w-fit 2xl:w-fit min-h-150 h-fit flex-1 space-y-5 overflow-hidden">
          <StoreRatingCard
            store_id={store?.id as number}
            store_slug={store?.slug}
            store_title={store?.title}
            store_rate={store?.rate}
            store_voters={store?.voters}
            store_isInFavorites={store?.isInFavorites}
            isMobile={isMobile}
            t={t}
          />
          {store?.description && (
            <div
              className="prose max-w-none mb-5"
              dangerouslySetInnerHTML={makeSafeHtml(store?.description)}
            />
          )}
          {store_banner?.some(
            (banner) => banner?.location === "coupon_block",
          ) && (
            <>
              <Hero
                storeName={store.slug}
                carouselItemClassName="basis-full md:basis-full lg:basis-full"
                banners={store_banner?.filter(
                  (banner) => banner?.location === "coupon_block",
                )}
                location="coupon_block"
                className="mt-7"
              />
            </>
          )}
          {store?.about_store && (
            <div className="space-y-5 my-10">
              {/* <h2 className="text-lg md:text-2xl font-semibold text-neutral-900 sm:text-xl">
                {t("About The store")} {": " + store?.store_name}
              </h2> */}
              <div className="w-full h-fit bg-white rounded-md p-4 border-1">
                <div className="overflow-x-auto overflow-y-hidden px-1 w-full">
                  <div
                    dir="rtl"
                    className={`${styles.prose} prose prose-sm max-w-none leading-relaxed font-cairo [&_*]:font-cairo [&_table]:w-full`}
                    dangerouslySetInnerHTML={makeSafeHtml(store?.about_store)}
                  />
                </div>
              </div>
            </div>
          )}
          <StoreCoupons
            store_coupons={store?.coupons}
            store_image={store?.image}
          />
          <StoreCharts statistics={statistics} storeName={store.slug} />
          {store?.coupon_image && (
            <div className="flex justify-center">
              <div className="relative w-full max-w-[430px] overflow-hidden rounded-lg shadow-md">
                <Image
                  src={store.coupon_image}
                  alt={store.slug}
                  width={430}
                  height={241.88}
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 376px, 430px"
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>
          )}
          {store_infos?.length > 0 && (
            <div className="space-y-5 pt-5">
              <p className="font-bold text-gray-700 text-lg">
                {t("aboutStore")} {" " + store_name_lang}
              </p>
              {store_infos?.map((info: InfoItem) => {
                // 1. Ensure it's an array, then filter out empty/null content
                const cleanDesc2 = (
                  Array.isArray(info?.description_2) ? info?.description_2 : []
                ).filter(
                  (item) => item?.content && item?.content.trim() !== "",
                );

                // 2. If no valid content blocks exist, skip this InfoItem entirely
                if (cleanDesc2.length === 0) return null;

                // 3. Map over the cleaned data
                return (
                  <div
                    key={info.id}
                    dir={getContentDirection(cleanDesc2.map((item) => item.content).join(" "))}
                    className="overflow-x-auto overflow-y-hidden h-fit bg-white rounded-md p-4 border-1"
                  >
                    {cleanDesc2.map((item, idx) => (
                      <div
                        key={`desc2-${idx}`}
                        dir={getContentDirection(item.content)}
                        className={`${styles.prose} prose prose-sm max-w-none font-cairo mb-4`}
                        dangerouslySetInnerHTML={makeSafeHtml(item.content)}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          )}
          {store_faqs && (
            <FAQ
              title={t("FAQS")}
              className="!pt-0"
              storeName={store_name_lang}
              faqs={store_faqs.filter(
                (faq) => Number(faq?.store_id) === Number(store?.id),
              )}
            />
          )}
          {store_reviews && store_reviews.length > 0 && (
            <CustomersReviews
              className="max-w-[87vw]"
              reviews={store_reviews}
              page={store?.slug}
            />
          )}
          {store_banner?.some(
            (banner) => banner?.location === "above_texts",
          ) && (
            <>
              <Divider />
              <Hero
                storeName={store.slug}
                carouselItemClassName="basis-full md:basis-full lg:basis-full"
                banners={store_banner?.filter(
                  (banner) => banner?.location === "above_texts",
                )}
                location="above_texts"
                className="mt-7"
              />
              <Divider />
            </>
          )}
          {!isMobile && (
            <div className="w-full h-fit text-xs bg-white/75 p-4 rounded-lg">
              {t("Affiliate links")}
            </div>
          )}
        </div>
        <div className="w-full md:w-70 lg:w-80 xl:w-80 2xl:w-100">
          <StoreSidePart
            storeName={store_name_lang}
            storeSlug={store?.slug}
            couponsLength={store?.coupons?.length}
            sideTable={side_table}
            similarStores={similarStores}
            storeBanners={store_banner}
            storeInfo={store_infos}
          />
        </div>
        {isMobile && (
          <div className="w-full h-fit text-xs bg-white/75 p-4 rounded-lg">
            {t("Affiliate links")}
          </div>
        )}
      </section>
    </div>
  );
};

export default ShowStore;
