'use client';
import AddToFavoriteBtn from '@/components/AddToFavoriteBtn';
import Author from '@/components/Author';
import FollowStore from '@/components/FollowStore';
import CustomersReviews from '@/components/Pages/Home/CustomersReviews';
import FAQ from '@/components/Pages/Home/FAQ';
import RateThisComponent from '@/components/RateThisComponent';
import ShowCouponDetails from '@/components/ShowCouponDetails';
import SimilarCoupons from '@/components/SimilarCoupons';
import StoreCoupon from '@/components/StoreCoupon';
import StoreTable from '@/components/StoreTable';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import StoreSidePart from '@/components/ui/StoreSidePart';
import ScrollTracker from '@/hooks/ScrollPageAnalytics';
import useDetectMobile from '@/hooks/useDetectMobile';
import { useStoreData } from '@/hooks/useStoreData';
import { secureHtmlLinks } from '@/lib/htmlUtils';
import { useStore } from '@/store';
import { CategoryItem, statisticsType } from '@/types';
import { Accordion, AccordionItem } from '@heroui/accordion';
import { Button } from '@heroui/button';
import { Divider } from '@heroui/divider';
import { StarIcon } from 'lucide-react';
import moment from 'moment';
import { useLocale, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

import CompetitorsStores from '../../Home/CompetitorsStores';
import Hero from '../../Home/Hero';

const StoreChartsPage = dynamic(() => import("@/components/ui/StoreCharts/StoreCharts"), { ssr: true });

declare module "react-window";

const ShowStore = ({ slug }: { slug: string }) => {
  const isMobile = useDetectMobile();
  const t = useTranslations();
  const locale = useLocale();
  const setSelectedCoupon = useStore((store) => store.setSelectedCoupon);
  // Fetch store data using React Query
  const { data, isLoading, isError } = useStoreData(slug);
  // Coupons Pagination
  const [visibleCount, setVisibleCount] = useState<number>(2);

  // Destructure data for easier access
  const {
    store,
    expiredCoupons = [],
    countries = [],
    store_brands = [],
    store_categories = [],
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
    popular_category: data?.popular_category ?? { count: 0, category: {} as CategoryItem },
    returned_visitors: data?.returned_visitors ?? "0%",
  }

  ////// temp. removed to prevent the automatic selection of the first coupon
  // useEffect(() => {
  //   if (store && store?.coupons?.length > 0) {
  //     setSelectedCoupon(store?.coupons[0]);
  //   }
  // }, [store, setSelectedCoupon]);

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 2, store?.coupons?.length || 0));
  };
  const handleShowLess = () => {
    setVisibleCount(2);
  };

  const couponsToShow = store?.coupons?.slice(0, visibleCount);
  const allVisible = visibleCount >= (store?.coupons?.length || 0);

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
          Error Loading Store
        </h2>
        <p className="text-gray-700 mb-4">
          We couldn't load the store information. Please try again later.
        </p>
        <Button color="primary" as={Link} href="/stores">
          Browse All Stores
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

  return (
    <div id="show store" className="relative">
      <ScrollTracker event_name={`${store?.slug}_page_depth`} />
      <ShowCouponDetails storeName={store?.store_name} />
      <FollowStore links={store?.social_links} storeName={store?.slug} />
      <Author author={store?.responsible} storeName={store?.slug} />
      <header className="fixed z-[90] w-full top-7 md:top-3 pt-16 sm:pt-20">
        <div className="bg-gradient-to-r from-main-700 to-main-600 shadow-lg">
          <div className="container mx-auto px-4 py-2">
            <div className="flex flex-row items-center sm:items-start md:items-start lg:items-start gap-3">
              {store?.image && (
                <div className="shrink-0">
                  <Image
                    src={store?.image}
                    alt={store?.title}
                    title={store?.title}
                    width={!isMobile ? 106 : 71}
                    height={!isMobile ? 60 : 40}
                    priority
                    className="rounded-lg shadow-md object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className="flex-1 flex flex-row items-center justify-between gap-2 min-w-0 bg-purple-500/0">
                <div className="flex flex-col items-start justify-center gap-1">
                  <h1 className="text-sm sm:text-base md:text-xl lg:text-xl xl:text-2xl text-white font-bold">
                    {store?.title}
                  </h1>
                  <div className='w-fit flex items-center gap-2'>
                    {
                      !isMobile && (
                        <>
                          <div className="flex items-center gap-2">
                            <StarIcon className="text-yellow-400 fill-yellow-400 w-5 h-5" />
                            <span className="text-white font-medium">
                              {Math.round(Number(store?.rate))}
                              <span className="text-white">/5</span>
                            </span>
                            <span className="text-white text-sm">
                              ({store.voters} {t("Votes")})
                            </span>
                          </div>

                          <div className="h-4 w-px bg-gray-300 mx-1"></div>
                        </>
                      )
                    }
                    <div className="flex items-center gap-2 text-white text-sm">
                      <p>{t("Last updated")} {": "} {moment().format("D MMMM YYYY")} {" ( " + `${t("Today")}` + " ) "}</p>
                    </div>
                  </div>
                </div>
                {
                  !isMobile && (
                    <div className="w-fit flex flex-wrap items-center justify-center gap-2 bg-green-500/0">
                      <RateThisComponent
                        title={`${t("Rate")} ${store?.title ?? ""}`}
                        route={`stores/${store?.slug}/review`}
                        data={{ store_id: store?.id ?? 0 }}
                      />
                      <AddToFavoriteBtn
                        isFavoriteInitially={store?.isInFavorites}
                        storeId={store?.id ?? 0}
                      />
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </header>
      <section className="container flex flex-col-reverse sm:flex-col-reverse md:flex-row lg:flex-row xl:flex-row 2xl:flex-row gap-10 pt-20 sm:pt-40 md:pt-30 lg:pt-24 pb-5">
        {/* sidebar */}
        <div className="w-full md:w-70 lg:w-80 xl:w-80 2xl:w-100 mt-7">
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
          />
        </div>
        {/* main content */}
        <div className="w-full sm:w-full md:w-fit lg:w-fit xl:w-fit 2xl:w-fit min-h-150 h-fit flex-1 space-y-5 overflow-hidden">
          {
            isMobile && (
              <Card className="relative overflow-hidden max-sm:mt-4 border-none shadow-md rounded-full">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between p-2">
                    <div className='flex items-center gap-2'>
                      <StarIcon className="text-yellow-400 fill-yellow-400 w-5 h-5" />
                      <span className="text-black font-medium">
                        {Math.round(Number(store?.rate))}
                        <span className="text-black">/5</span>
                      </span>
                      <span className="text-black text-sm">
                        ({store.voters} {t("Votes")})
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <RateThisComponent
                        title={`${t("Rate")} ${store?.title ?? ""}`}
                        route={`stores/${store?.slug}/review`}
                        data={{ store_id: store?.id ?? 0 }}
                      />
                      <AddToFavoriteBtn
                        isFavoriteInitially={store?.isInFavorites}
                        storeId={store?.id ?? 0}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          }
          <Card className="relative overflow-hidden max-sm:mt-4">
            <div className="gradient absolute top-20 left-0  size-80 bg-main-500/30 blur-[100px]" />

            <CardHeader className="py-0" />
            <CardContent className="space-y-3 md:space-y-3 lg:space-y-5 xl:space-y-5 p-3">
              <h2>{t("Stores from the same category")}</h2>
              <div className="flex items-center gap-3 flex-wrap">
                {store_categories?.map((category) => (
                  <Link
                    target="_self"
                    href={`/coupon-category/${category?.slug}`}
                    key={category?.id}
                    className="py-1.5 text-sm px-2 rounded-xl bg-default-200 hover:bg-default-100 transition-all flex items-center gap-3"
                  >
                    {category?.name}
                  </Link>
                ))}
              </div>
              {countries?.length > 0 && (
                <h2>{t("Stores from the same country")}</h2>
              )}
              <div className="flex items-center gap-3 flex-wrap">
                {countries?.map((item, index) => (
                  <Button
                    as={Link}
                    variant="faded"
                    color="primary"
                    href={`/coupon_country/${item?.country}`}
                    key={index}
                  >
                    {item?.country}
                  </Button>
                ))}
              </div>
            </CardContent>
            <CardFooter className="py-0" />
          </Card>
          {store?.description && (
            <>
              <Divider />
              <div className="prose max-w-none my-5">
                <div
                  dangerouslySetInnerHTML={{
                    __html: secureHtmlLinks(store?.description),
                  }}
                />
              </div>
            </>
          )}
          {store_banner?.some((banner) => banner?.location === "coupon_block") && (
            <>
              <Hero
                storeName={store.slug}
                carouselItemClassName="basis-full md:basis-full lg:basis-full"
                banners={store_banner?.filter((banner) => banner?.location === "coupon_block")}
                location="coupon_block"
                className="mt-7"
              />
              <Divider />
            </>
          )}
          <div className="space-y-3 bg-red-400/0">
            {
              store?.coupons && store?.coupons.length > 0 &&
              <>
                {couponsToShow && couponsToShow.map((coupon) => (
                  <StoreCoupon key={coupon?.id} coupon={coupon} store_image={store?.image} />
                ))}

                <div className="pt-5">
                  {!allVisible ? (
                    <Button
                      variant="light"
                      color="primary"
                      className="w-full border-1 border-main-200"
                      onPress={handleShowMore}
                    >
                      {t("More Coupons")}
                    </Button>
                  ) : (
                    <Button
                      variant="light"
                      color="primary"
                      className="w-full border-1 border-main-200"
                      onPress={handleShowLess}
                    >
                      {t("Less Coupons")}
                    </Button>
                  )}
                </div>
              </>
            }
          </div>
          <StoreChartsPage statistics={statistics} t={t} locale={locale} storeName={store.slug} />
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
          {similar_coupons_table && similar_coupons_table.length > 0 && (
            <>
              <Divider />
              <SimilarCoupons coupons={data?.similar_coupons_table || []} />
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
          {store_banner?.some((banner) => banner?.location === "above_texts") && (
            <>
              <Divider />
              <Hero
                storeName={store.slug}
                carouselItemClassName="basis-full md:basis-full lg:basis-full"
                banners={store_banner?.filter((banner) => banner?.location === "above_texts")}
                location="above_texts"
                className="mt-7"
              />
              <Divider />
            </>
          )}
          {store_infos?.length > 0 && (
            <div className="space-y-5 mb-11">
              <h3 className="text-lg font-semibold sm:text-xl">
                {t("About The store")}
              </h3>
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
                      dangerouslySetInnerHTML={{
                        __html: secureHtmlLinks(faq?.description),
                      }}
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
          <div className='w-full h-fit text-xs bg-white/75 p-4 rounded-lg'>
            {t("Affiliate links")}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShowStore;