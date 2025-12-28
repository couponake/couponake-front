"use client";
import ShowCouponDetails from '@/components/Modals/ShowCouponDetails';
import CustomersReviews from '@/components/Pages/Home/CustomersReviews';
import FAQ from '@/components/Pages/Home/FAQ';
import Author from '@/components/StorePageComponents/Author';
import FollowStore from '@/components/StorePageComponents/FollowStore';
import StoreCharts from '@/components/StorePageComponents/StoreCharts/StoreCharts';
import StoreCoupon from '@/components/StorePageComponents/StoreCoupon';
import StoreCoupons from '@/components/StorePageComponents/StoreCoupons';
import StoreHeader from '@/components/StorePageComponents/StoreHeader';
import StoreRatingCard from '@/components/StorePageComponents/StoreRatingCard';
import StoreSidePart from '@/components/StorePageComponents/StoreSidePart';
import StoreTable from '@/components/StorePageComponents/StoreTable';
import useDetectMobile from '@/hooks/useDetectMobile';
import { useStoreData } from '@/hooks/useStoreData';
import { secureHtmlLinks } from '@/lib/htmlUtils';
import ScrollTracker from '@/services/ScrollPageAnalytics';
import { CategoryItem, statisticsType } from '@/types';
import { Accordion, AccordionItem } from '@heroui/accordion';
import { Button } from '@heroui/button';
import { Divider } from '@heroui/divider';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';

import CompetitorsStores from '../../Home/CompetitorsStores';
import Hero from '../../Home/Hero';

declare module "react-window";

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
    expiredCoupons = [],
    store_brands = [],
    similarStores = [],
    store_reviews = [],
    store_banner = null,
    related_coupons = [],
    related_stores = [],
    store_faqs = [],
    similar_coupons_table = [],
    store_infos = [],
    side_table = null,
  } = data || {};

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
      <div className="container pt-24 pb-10 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          {'Error Loading Store'}
        </h2>
        <p className="text-gray-700 mb-4">
          {'We couldn\'t load the store information. Please try again later.'}
        </p>
        <Button color="primary" as={Link} href="/stores">
          {'Browse All Stores'}
        </Button>
      </div>
    );
  }

  // If no store data is available
  if (!store) {
    return (
      <div className="container pt-24 pb-10 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {t("Store Not Found")}
        </h2>
        <p className="text-gray-700 mb-4">
          {t(
            "The store you are looking for does not exist or has been removed"
          )}
        </p>
        <Button color="primary" as={Link} href="/stores">
          {t("Browse All Stores")}
        </Button>
      </div>
    );
  }

  function makeSafeHtml(content: string | null): { __html: string } {
    return { __html: secureHtmlLinks(content ?? "") };
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
      <section className="container flex flex-col-reverse sm:flex-col-reverse md:flex-row lg:flex-row xl:flex-row 2xl:flex-row gap-10 pt-20 sm:pt-40 md:pt-30 lg:pt-24 pb-5">
        {/* sidebar */}
        <aside className="w-full md:w-70 lg:w-80 xl:w-80 2xl:w-100 mt-7">
          <StoreSidePart
            storeTitle={store?.title}
            couponImage={store?.coupon_image}
            storeName={store?.store_name}
            storeSlug={store?.slug}
            couponsLength={store?.coupons?.length}
            sideTable={side_table}
            similar_stores={similarStores}
            storeBrands={store_brands}
            storeBanners={store_banner}
            similarCoupons={similar_coupons_table}
          />
        </aside>
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
              className="prose max-w-none my-5"
              dangerouslySetInnerHTML={makeSafeHtml(store?.description)}
            />
          )}
          {store_banner?.some(
            (banner) => banner?.location === "coupon_block"
          ) && (
              <>
                <Hero
                  storeName={store.slug}
                  carouselItemClassName="basis-full md:basis-full lg:basis-full"
                  banners={store_banner?.filter(
                    (banner) => banner?.location === "coupon_block"
                  )}
                  location="coupon_block"
                  className="mt-7"
                />
                <Divider />
              </>
            )}
          <StoreCoupons
            store_coupons={store?.coupons}
            store_image={store?.image}
          />
          <StoreCharts
            statistics={statistics}
            storeName={store.slug}
          />
          {related_stores && related_stores.length > 0 && (
            <CompetitorsStores
              title={store.store_name}
              stores={data?.related_stores || []}
            />
          )}
          {/* expiredCoupons */}
          {expiredCoupons?.length > 0 && (
            <>
              <Divider />
              <div className="space-y-5 mt-5">
                <h3 className="text-lg font-semibold sm:text-xl">
                  {t("Expired coupons")}
                </h3>
                {expiredCoupons?.map((coupon) => (
                  <StoreCoupon
                    key={coupon?.id}
                    coupon={coupon}
                    isExpired
                    className="overflow-hidden relative bg-gray-50"
                  />
                ))}
              </div>
            </>
          )}
          {/* related_coupons */}
          {related_coupons && related_coupons.length > 0 && (
            <>
              <Divider />
              <div className="space-y-5 mt-5 ">
                <h3 className="text-lg font-semibold sm:text-xl">
                  {t("Related coupons")}
                </h3>
                {related_coupons?.map((coupon) => (
                  <StoreCoupon key={coupon?.id} coupon={coupon} />
                ))}
              </div>
            </>
          )}
          {store?.store_table && store?.store_table.length > 0 && (
            <>
              <Divider />
              <StoreTable store={store?.store_table} t={t} />
            </>
          )}
          {store_reviews && store_reviews.length > 0 && (
            <CustomersReviews
              className="max-w-[87vw]"
              reviews={store_reviews}
              page={store?.slug}
            />
          )}
          {store_banner?.some(
            (banner) => banner?.location === "above_texts"
          ) && (
              <>
                <Divider />
                <Hero
                  storeName={store.slug}
                  carouselItemClassName="basis-full md:basis-full lg:basis-full"
                  banners={store_banner?.filter(
                    (banner) => banner?.location === "above_texts"
                  )}
                  location="above_texts"
                  className="mt-7"
                />
                <Divider />
              </>
            )}
          {store_infos?.length > 0 && (
            <div className="space-y-5 mb-11">
              <h2 className="text-lg font-semibold sm:text-xl">
                {t("About The store")}
              </h2>
              <Accordion>
                {store_infos?.map((faq) => (
                  <AccordionItem
                    title={faq?.title}
                    aria-label={faq?.title}
                    value={String(faq?.id)}
                    key={faq?.id}
                  >
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={makeSafeHtml(faq?.description)}
                    />
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
          {store_faqs && (
            <FAQ
              title={t("FAQS")}
              className="!pt-0 !pb-7"
              storeName={store.slug}
              faqs={store_faqs.filter(
                (faq) => Number(faq?.store_id) === Number(store?.id)
              )}
            />
          )}
          <div className="w-full h-fit text-xs bg-white/75 p-4 rounded-lg">
            {t("Affiliate links")}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShowStore;
