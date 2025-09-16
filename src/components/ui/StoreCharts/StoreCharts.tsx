import "./store.css";

import { statisticsType } from "@/types";
import { Card, CardBody, Chip, CircularProgress } from "@heroui/react";
import { ChartPie, Copy, MoveUpRight, TrendingUp } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { CiDiscount1 } from "react-icons/ci";
import { CardHeader } from "../card";
import { useInView } from "react-intersection-observer";
import { CgSandClock } from "react-icons/cg";
import { GiSandsOfTime } from "react-icons/gi";

function StoreCharts({
  statistics,
  t,
  locale,
  storeName,
}: {
  statistics: statisticsType;
  t: any;
  locale: string;
  storeName: string;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasFired, setHasFired] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       if (entry.isIntersecting && !hasFired) {
  //         // Start the 2-second timer
  //         timeoutRef.current = setTimeout(() => {
  //           if (typeof window !== 'undefined' && (window as any).gtag) {
  //             (window as any).gtag("event", `${storeName}_statistics_view`, {
  //               event_category: "store_statistics",
  //               event_label: storeName,
  //               value: `Store Love: ${statistics?.store_love || 0}%`,
  //               currency: statistics?.currency || "SAR",
  //             });
  //           }
  //           setHasFired(true); // prevent future triggers
  //         }, 2000);
  //       } else {
  //         // If user scrolls away before 2 seconds, clear the timer
  //         if (timeoutRef.current) {
  //           clearTimeout(timeoutRef.current);
  //           timeoutRef.current = null;
  //         }
  //       }
  //     },
  //     {
  //       threshold: 0.5, // at least 50% visible
  //     }
  //   );

  //   if (sectionRef.current) {
  //     observer.observe(sectionRef.current);
  //   }

  //   return () => {
  //     if (sectionRef.current) {
  //       observer.unobserve(sectionRef.current);
  //     }
  //     if (timeoutRef.current) {
  //       clearTimeout(timeoutRef.current);
  //     }
  //   };
  // }, [hasFired, storeName]);

  return (
    <section
      ref={sectionRef}
      id="statistics"
      aria-label="statistics"
      className="w-full h-full py-10 flex justify-center items-center flex-col gap-5"
    >
      <h2 className="w-full my-5 text-lg font-semibold text-neutral-900 sm:text-xl md:text-2xl">
        {t("StoreStatistics")}
      </h2>
      <div className="w-full h-fit shadow-md rounded-md overflow-hidden">
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 justify-center items-center gap-0 bg-white">
          <div className="w-full h-[228.75px] flex flex-col justify-center items-center gap-2">
            <Chip
              className="text-main-500 text-base font-semibold border-1 border-main-500/0 "
              variant="bordered"
            >
              {t("storeRate")}
            </Chip>
            <CircularProgress
              classNames={{
                svg: "w-36 h-36 drop-shadow-md",
                indicator: "stroke-main-500",
                track: "stroke-main-500/10",
                value: "text-3xl font-semibold text-main-500",
              }}
              showValueLabel={true}
              strokeWidth={3}
              value={Math.round(parseFloat(statistics?.store_love ?? "0"))}
              aria-label="store_love"
              formatOptions={{
                numberingSystem: "latn",
                style: "percent",
              }}
            />
          </div>
          <div className="w-full h-[228.75px] flex flex-col justify-center items-center gap-2">
            <Chip
              className="text-main-500 text-base font-semibold border-1 border-main-500/0 "
              variant="bordered"
            >
              {t("ReturningVisitors")}
            </Chip>
            <CircularProgress
              classNames={{
                svg: "w-36 h-36 drop-shadow-md",
                indicator: "stroke-main-500",
                track: "stroke-main-500/10",
                value: "text-3xl font-semibold text-main-500 western-digits",
              }}
              showValueLabel={true}
              strokeWidth={3}
              value={Math.round(
                parseFloat(statistics?.returned_visitors ?? "0")
              )}
              aria-label="returned_visitors"
              formatOptions={{
                numberingSystem: "latn",
                style: "percent",
              }}
            />
          </div>
        </div>
      </div>

      <div className="w-full h-[600px] md:h-[200px] lg:h-[200px] xl:h-[200px] shadow-none rounded-md overflow-hidden">
        <div className="w-full h-full shadow-md rounded-md overflow-hidden relative">
          <div className="moneyPattern absolute w-full h-full"></div>
          <div className="w-full h-full absolute grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 justify-center items-center gap-0">
            <div className="w-full h-[200px] flex flex-col justify-center items-center gap-10">
              <Chip
                className="text-black text-base w-3/4 text-wrap text-center font-bold border-1 border-main-500/0 "
                variant="bordered"
              >
                {t("Orders")}
              </Chip>
              <div
                role="group"
                aria-labelledby="orders-label"
                className="w-full h-fit text-2xl flex justify-center items-center gap-2"
              >
                {statistics?.orders_number > 0 && (
                  <MoveUpRight
                    color="#1B59F8"
                    size={30}
                    aria-hidden="true"
                    className="animate-bell"
                  />
                )}
                <p id="orders-label" className="sr-only">
                  Orders
                </p>
                <p>
                  {new Intl.NumberFormat("en", { style: "decimal" }).format(
                    statistics?.orders_number || 0
                  )}
                </p>
              </div>
            </div>
            <div className="w-full h-[200px] flex flex-col justify-center items-center gap-10">
              <Chip
                className="text-black text-base font-bold border-1 border-black/0"
                variant="bordered"
              >
                {t("AmountsSaved")}
              </Chip>
              <div
                role="group"
                aria-labelledby="saved-price-label"
                className="flex items-center gap-2 text-2xl"
              >
                {statistics?.saved_price > 0 && (
                  <TrendingUp
                    color="#1B59F8"
                    size={30}
                    aria-hidden="true"
                    className="animate-bounce"
                  />
                )}
                <span id="saved-price-label" className="sr-only">
                  Amount Saved
                </span>
                <p>
                  {new Intl.NumberFormat("en", { style: "decimal" }).format(
                    statistics?.saved_price || 0
                  )}{" "}
                  {statistics?.currency}
                </p>
              </div>
            </div>
            <div className="w-full h-[200px] flex flex-col justify-center items-center gap-10">
              <Chip
                className="text-black text-base font-bold border-1 border-main-500/0 "
                variant="bordered"
              >
                {t("CouponCopies")}
              </Chip>
              <div
                role="group"
                aria-labelledby="coupon-uses-label"
                className="w-full h-fit text-2xl flex justify-center items-center gap-2"
              >
                <Copy
                  color="#1B59F8"
                  size={25}
                  aria-hidden="true"
                  className="animate-pulse"
                />
                <span id="coupon-uses-label" className="sr-only">
                  Total Used Coupons
                </span>
                <p>
                  {new Intl.NumberFormat("en", { style: "decimal" }).format(
                    statistics?.total_used_coupons || 0
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-fit shadow-md rounded-md overflow-hidden">
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 justify-center items-center gap-5 bg-white">
          <div className="h-[228.75px]">
            <Card className="w-full h-full p-0 bg-white/0 shadow-none">
              <CardHeader className="justify-center items-center pt-4 pb-0">
                <Chip
                  className="text-main-500 text-base  w-3/4 text-wrap text-center font-semibold border-1 border-main-500/0"
                  variant="bordered"
                >
                  {t("MostUsedCoupon")}
                </Chip>
              </CardHeader>
              <CardBody className="h-full w-full relative overflow-hidden p-0">
                <div className="curvePattern absolute w-full h-full"></div>
                <div
                  role="group"
                  aria-labelledby="most-used-coupon-label"
                  className="w-full h-full absolute text-3xl flex justify-center items-start gap-2 pt-10"
                >
                  <span id="most-used-coupon-label" className="sr-only">
                    Most Used Coupon
                  </span>
                  <p className="p-1 bg-main-500 rounded-sm text-white">
                    {statistics?.max_coupon_used || "N/A"}
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
          <div className="h-[228.75px]">
            <Card className="w-full h-full p-0 border-none shadow-none bg-white/0">
              <CardHeader className="justify-center items-center pt-4 pb-0">
                <Chip
                  className="text-main-500 text-base font-semibold border-1 border-main-500/0"
                  variant="bordered"
                >
                  {t("BiggestCode")}
                </Chip>
              </CardHeader>
              <CardBody className="w-full h-full flex justify-center items-center gap-2 p-0">
                <p
                  id="biggest-code"
                  className="text-main-500 text-3xl"
                  aria-label={`Biggest coupon code: ${statistics?.max_coupon_discount ?? "N/A"}`}
                >
                  {statistics?.max_coupon_discount}
                </p>
                <ChartPie
                  strokeWidth={1.25}
                  color="#7214d1"
                  size={100}
                  aria-label={`Chart showing the usage of the coupon code: ${statistics?.max_coupon_discount ?? "N/A"}`}
                />
              </CardBody>
            </Card>
          </div>
          <div className="h-[228.75px]">
            <Card className="w-full h-full p-0 bg-white/0 shadow-none rounded-none">
              <CardHeader className="justify-center items-center pt-4 pb-0">
                <Chip
                  className="text-main-500 text-base font-semibold border-1 border-main-500/0"
                  variant="bordered"
                >
                  {t("MostCategory")}
                </Chip>
              </CardHeader>
              <CardBody className="h-full w-full relative overflow-hidden p-0">
                <div className="magicPattern absolute w-full h-full"></div>
                <span
                  id="most-category-used"
                  className="w-full h-full absolute text-3xl text-main-500 flex flex-col justify-center items-center gap-2"
                  aria-live="polite"
                >
                  <p
                    id="most-category-count"
                    aria-label={`Most used category count: ${statistics?.popular_category?.count ?? "0"}`}
                    className="text-main-500"
                  >
                    {new Intl.NumberFormat("en", { style: "decimal" }).format(
                      statistics?.popular_category?.count || 0
                    )}
                  </p>
                  <p
                    id="most-category-name"
                    aria-label={`Most used category name: ${statistics?.popular_category?.category?.name ?? "Unknown"}`}
                    className="rounded-sm text-main-500 text-2xl"
                  >
                    {statistics?.popular_category?.category?.name}
                  </p>
                </span>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      <div className="w-full h-[600px] md:h-[200px] lg:h-[200px] xl:h-[200px] shadow-none rounded-md overflow-hidden">
        <div className="w-full h-full shadow-md rounded-md overflow-hidden relative">
          <div className="moneyPattern absolute w-full h-full"></div>
          <div className="w-full h-full absolute grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 justify-center items-center gap-0">
            <div className="w-full h-[200px] flex flex-col justify-center items-center gap-10">
              <Chip
                className="text-black text-base w-3/4t-wrap text-center font-semibold border-1 border-main-500/0 "
                variant="bordered"
              >
                {t("couponPeakTimes")}
              </Chip>
              <div
                role="group"
                aria-labelledby="coupon-peak-label"
                className="w-full h-fit text-2xl flex justify-center items-center gap-2"
              >
                {statistics?.coupon_peak_times !== "null" && (
                  <GiSandsOfTime
                    color="#1B59F8"
                    size={24}
                    aria-hidden="true"
                    className="animate-spinner-ease-spin"
                  />
                )}
                <p id="coupon-peak-label" className="sr-only">
                  Orders
                </p>
                <p>
                  {statistics?.coupon_peak_times !== "null"
                    ? statistics?.coupon_peak_times
                    : " - "}
                </p>
              </div>
            </div>
            <div className="w-full h-[200px] flex flex-col justify-center items-center gap-10">
              <Chip
                className="text-black text-base font-bold border-1 border-black/0"
                variant="bordered"
              >
                {t("popularDiscounts")}
              </Chip>
              <div
                role="group"
                aria-labelledby="popular-discounts-label"
                className="flex items-center gap-2 text-2xl"
              >
                {statistics?.popular_discounts !== "null" && (
                  <CiDiscount1
                    color="#1B59F8"
                    size={32}
                    aria-hidden="true"
                    className="animate-blink"
                  />
                )}
                <p>
                  {statistics?.popular_discounts !== "null"
                    ? statistics?.popular_discounts
                    : " - "}
                </p>
              </div>
            </div>
            <div className="w-full h-[200px] flex flex-col justify-center items-center gap-10">
              <Chip
                className="text-black text-base font-bold border-1 border-main-500/0 "
                variant="bordered"
              >
                {t("couponShareRate")}
              </Chip>
              <div
                role="group"
                aria-labelledby="coupon-share-label"
                className="w-full h-fit text-2xl flex justify-center items-center gap-2"
              >
                {Number(statistics?.coupon_share_rate) > 0 && (
                  <MoveUpRight
                    color="#1B59F8"
                    size={30}
                    aria-hidden="true"
                    className="animate-bell"
                  />
                )}
                <span id="coupon-share-label" className="sr-only">
                  Coupon Share Rate
                </span>
                <p>
                  {Math.round(Number(statistics?.coupon_share_rate) || 0) + "%"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StoreCharts;
