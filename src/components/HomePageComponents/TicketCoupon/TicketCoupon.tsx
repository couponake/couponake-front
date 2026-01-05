"use client";
import "./style.css";
import { useInView } from "react-intersection-observer";
import Empty from "@/components/Empty";
import useDetectMobile from "@/hooks/useDetectMobile";
import { useDraggableScroll } from "@/hooks/useDraggableScroll";
import { CategoryItem, LatestCoupons } from "@/types";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import axios from "axios";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import React, { Fragment, useEffect } from "react";

import {
  IoMdArrowDown,
  IoMdArrowUp,
  IoMdArrowForward,
  IoMdArrowBack,
} from "react-icons/io";

import { toast } from "../../ui/custom-toast";

function TicketCoupon() {
  const t = useTranslations();
  const locale = useLocale();
  const smallScreens = useDetectMobile();
  const { ref } = useDraggableScroll();

  const [, copyToClipboard] = useCopyToClipboard();

  const [selectedCat, setSelectedCat] = React.useState<number>(0);

  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [couponsCategoriesList, setCouponsCategoriesList] = React.useState<
    { id: number; name: string; slug: string }[]
  >([]);

  const [isCouponLoading, setCouponLoading] = React.useState<boolean>(false);
  const [couponsData, setCouponsData] = React.useState<LatestCoupons[]>([]);
  const [filteredCoupons, setFilteredCoupons] = React.useState<LatestCoupons[]>(
    []
  );
  const [canScrollUp, setCanScrollUp] = React.useState(true);
  const [canScrollDown, setCanScrollDown] = React.useState(true);

  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true, // only load once
    threshold: 0.1, // trigger when 10% visible
  });

  useEffect(() => {
    if (inView) {
      fetchCoupons();
    }
  }, [inView]);

  useEffect(() => {
    if (couponsCategoriesList.length > 0) {
      setCanScrollUp(false); // always hidden at start
      setCanScrollDown(couponsCategoriesList.length > 7); // only show if >7 items
    } else {
      setCanScrollUp(false);
      setCanScrollDown(false);
    }
  }, [couponsCategoriesList]);

  useEffect(() => {
    if (!ref.current || couponsCategoriesList.length <= 7) return;
    const container = ref.current;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;

      setCanScrollUp(scrollTop > 0);

      const tolerance = 8;
      setCanScrollDown(scrollTop + clientHeight < scrollHeight - tolerance);
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [ref, couponsCategoriesList]);

  const fetchCoupons = async () => {
    setCouponLoading(true);
    setLoading(true);

    try {
      const res = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "home/latest-coupons"
      );

      if (res.status !== 200 || !res.data?.data) {
        setCouponsData([]);
        setCouponsCategoriesList([]);
        setFilteredCoupons([]);
        return;
      }

      const coupons: LatestCoupons[] = res.data.data;

      // Extract categories in one pass
      const categoryMap = new Map<number, CategoryItem>();
      coupons.forEach((coupon) => {
        coupon.category?.forEach((cat) => {
          if (cat?.id && !categoryMap.has(cat.id)) {
            categoryMap.set(cat.id, cat);
          }
        });
      });

      const uniqueCategories = Array.from(categoryMap.values());

      // Select first category (if exists), otherwise fallback
      let filtered: LatestCoupons[];
      let firstCatId: number | undefined;

      if (uniqueCategories.length > 0) {
        firstCatId = uniqueCategories[0].id;
        filtered = coupons.filter((item) =>
          item.category?.some((cat) => cat.id === firstCatId)
        );
      } else {
        filtered = coupons;
      }

      // Batch state updates together
      setCouponsData(coupons);
      setCouponsCategoriesList(uniqueCategories);
      setSelectedCat(firstCatId ?? 0);
      setFilteredCoupons(filtered);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setCouponsData([]);
      setCouponsCategoriesList([]);
      setFilteredCoupons([]);
    } finally {
      setCouponLoading(false);
      setLoading(false);
    }
  };

  const filterCoupons = (category: {
    id: number;
    name: string;
    slug: string;
  }) => {
    setSelectedCat(category.id);
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag("event", "best_coupons_category_click", {
        category_id: category?.id,
        category_name: category?.name,
      });
    }
    setFilteredCoupons(
      couponsData.filter((item) =>
        item.category?.some((cat) => cat.id === category.id)
      )
    );
  };

  const handelCopyCoupon = (coupon: LatestCoupons) => {
    copyToClipboard(coupon?.code);
    toast.success(t("Coupon copied successfully"));
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag("event", "best_coupons_click", {
        coupon_id: coupon?.id,
        coupon_title: coupon?.title,
        coupon_store_id: coupon?.store_id,
      });
    }
    setTimeout(() => {
      const link = document.createElement("a");
      link.href = coupon?.url;
      link.target = "_blank";
      link.rel = "nofollow";
      link.click();
    }, 1200);
  };

  const scrollByStep = (direction: "up" | "down" | "forward" | "back") => {
    if (!ref.current) return;
    const container = ref.current;

    // Step size: use container’s visible width/height
    const stepY = container.clientHeight;
    const stepX = container.clientWidth;

    let newTop = container.scrollTop;
    let newLeft = container.scrollLeft;

    switch (direction) {
      case "up":
        newTop = container.scrollTop - stepY;
        break;
      case "down":
        newTop = container.scrollTop + stepY;
        break;
      case "back": // left
        newLeft = container.scrollLeft - stepX;
        break;
      case "forward": // right
        newLeft = container.scrollLeft + stepX;
        break;
    }

    container.scrollTo({
      top: newTop,
      left: newLeft,
      behavior: "smooth",
    });
  };

  return (
    <Fragment>
      {!smallScreens ? (
        <div ref={inViewRef}>
          <div className="bg-[#efefef] container flex items-start p-5 ">
            <h2 className="text-lg font-semibold text-neutral-900 sm:text-xl md:text-2xl">
              {t("BestCoupons")}
            </h2>
          </div>
          <div className="bg-[#efefef] container flex flex-col items-center gap-5 shadow-lg p-5">
            <div className="w-full h-full flex items-start justify-start overflow-hidden">
              <div className="w-1/5 h-full flex flex-wrap items-start justify-center gap-5 bg-green-500/0 px-5">
                <div className="w-full h-fit flex items-center justify-center">
                  <button
                    name="ScrollTop"
                    className="h-8 aspect-square flex items-center justify-center text-black/25 hover:text-[#7214d1] focus:text-[#7214d1] active:text-[#7214d1] bg-white/50 hover:bg-white border-[1px] border-black/10 hover:border-black/25 rounded-full p-1 shadow-none duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:translate-y-1 active:scale-x-110 active:scale-y-90"
                    style={{ visibility: canScrollUp ? "visible" : "hidden" }}
                    onClick={() => scrollByStep("up")}
                  >
                    <IoMdArrowUp size={18} />
                  </button>
                </div>
                <div
                  className="w-full h-90 pb-2 flex flex-col gap-3 justify-start items-start overflow-y-scroll whitespace-nowrap cursor-grab select-none scrollbar-visible "
                  ref={ref as any}
                >
                  {isLoading ? (
                    <Spinner className="m-auto" />
                  ) : (
                    <>
                      {couponsCategoriesList.map((category) => (
                        <div
                          key={category?.id}
                          className={
                            "w-full text-md rounded-full p-2 cursor-pointer text-center " +
                            (selectedCat === category?.id
                              ? " bg-main-500 text-white shadow-none"
                              : " bg-gray-50 text-gray-800 shadow-md")
                          }
                          onClick={() => filterCoupons(category)}
                          role="button"
                          aria-label={`Filter by ${category?.name}`}
                        >
                          {category?.id === 0
                            ? t(`${category?.name}`)
                            : category?.name}
                        </div>
                      ))}
                    </>
                  )}
                </div>
                <div className="w-full h-fit flex items-center justify-center">
                  <button
                    name="ScrollDown"
                    className="h-8 aspect-square flex items-center justify-center text-black/25 hover:text-[#7214d1] focus:text-[#7214d1] active:text-[#7214d1] bg-white/50 hover:bg-white border-[1px] border-black/10 hover:border-black/25 rounded-full p-1 shadow-none duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:translate-y-1 active:scale-x-110 active:scale-y-90"
                    style={{ visibility: canScrollDown ? "visible" : "hidden" }}
                    onClick={() => scrollByStep("down")}
                  >
                    <IoMdArrowDown size={18} />
                  </button>
                </div>
              </div>
              <div className="w-4/5 h-fit flex flex-wrap items-start justify-start gap-4 bg-[#efefef] p-0">
                {!isCouponLoading ? (
                  filteredCoupons.length > 0 ? (
                    filteredCoupons.map((coupon) => (
                      <div className="w-fit h-fit" key={coupon?.id}>
                        <div
                          className={
                            "w-[320px] flex items-center justify-between gap-0 " +
                            (locale === "ar" ? "flex-row" : "flex-row-reverse")
                          }
                        >
                          <div className="stub overflow-hidden">
                            <div className="w-[110px] aspect-square bg-white">
                              <Image
                                src={coupon?.store_image}
                                alt={coupon?.store_slug}
                                width={110}
                                height={110}
                                unoptimized
                                className="w-full aspect-square size-[110px] object-contain border-l-1 border-dashed border-[#ef5658]"
                              />
                            </div>
                          </div>

                          <div className="check flex flex-col justify-between items-center">
                            <div className="w-full h-fit text-xs font-semibold">
                              <p>{coupon?.title}</p>
                            </div>
                            {coupon?.type === "coupon" ? (
                              <div className="w-11/12 h-10 bg-green-500/0 overflow-hidden border-1 border-dashed rounded-md border-main-500 flex items-center justify-center">
                                <div className="w-3/5 h-full bg-green-300/0 flex items-center justify-center font-bold">
                                  {coupon?.code}
                                </div>
                                <div
                                  role="button"
                                  aria-label="Copy Coupon"
                                  className={
                                    "w-2/5 h-full px-1 bg-yellow-300 hover:bg-main-500 hover:text-white flex items-center justify-center text-xs text-center cursor-pointer " +
                                    (locale === "ar"
                                      ? "border-r-1 border-dashed border-main-500"
                                      : "border-l-1 border-dashed border-main-500")
                                  }
                                  onClick={() => handelCopyCoupon(coupon)}
                                >
                                  {t("Copy Coupon")}
                                </div>
                              </div>
                            ) : (
                              <div
                                role="button"
                                aria-label="Copy Coupon"
                                className="w-11/12 h-10 bg-green-500/0 overflow-hidden border-1 border-dashed rounded-md border-main-500 flex items-center justify-center"
                              >
                                <div
                                  className="w-full h-full px-1 bg-yellow-300 hover:bg-main-500 hover:text-white flex items-center justify-center text-xs text-center cursor-pointer"
                                  onClick={() => handelCopyCoupon(coupon)}
                                >
                                  {t("Get Coupon")}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <Empty description={t("No Coupons")} />
                  )
                ) : (
                  <Spinner className="m-auto" />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div ref={inViewRef}>
          <div className="bg-[#efefef] container flex items-start justify-between p-5 pb-0">
            <h2 className="text-lg font-semibold text-neutral-900 sm:text-xl md:text-2xl">
              {t("BestCoupons")}
            </h2>
            <div className="w-fit h-fit flex items-center justify-center gap-2">
              <button
                name="ScrollTop"
                className="h-8 aspect-square flex items-center justify-center text-black/30 hover:text-[#7214d1] focus:text-[#7214d1] active:text-[#7214d1] bg-white/50 hover:bg-white border-[1px] border-black/10 hover:border-black/25 rounded-full p-1 shadow-none duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:translate-y-1 active:scale-x-110 active:scale-y-90"
                onClick={() => scrollByStep("forward")}
              >
                <IoMdArrowForward size={18} />
              </button>
              <button
                name="ScrollTop"
                className="h-8 aspect-square flex items-center justify-center text-black/30 hover:text-[#7214d1] focus:text-[#7214d1] active:text-[#7214d1] bg-white/50 hover:bg-white border-[1px] border-black/10 hover:border-black/25 rounded-full p-1 shadow-none duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:translate-y-1 active:scale-x-110 active:scale-y-90"
                onClick={() => scrollByStep("back")}
              >
                <IoMdArrowBack size={18} />
              </button>
            </div>
          </div>
          <div className="w-full h-fit bg-[#efefef] flex flex-col items-center gap-5 shadow-lg p-5">
            <div className="w-full h-fit overflow-hidden flex flex-wrap items-center justify-between gap-8 bg-green-250/0">
              <div
                className="w-[330px] sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[750px] flex flex-row gap-3 justify-start items-center overflow-x-scroll whitespace-nowrap cursor-grab select-none  scrollbar-visible"
                ref={ref as any}
              >
                {couponsCategoriesList.map((category) => (
                  <Chip
                    key={category?.id}
                    className={
                      "text-sm " +
                      (selectedCat === category?.id
                        ? " bg-main-500 text-white"
                        : " bg-gray-50 text-gray-800")
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => filterCoupons(category)}
                    role="button"
                    aria-label={`Filter by ${category?.name}`}
                  >
                    {category?.name}
                  </Chip>
                ))}
              </div>
            </div>
            <div className="w-full h-fit flex flex-wrap items-center justify-center gap-5 bg-green-250/0 p-0">
              {!isCouponLoading ? (
                filteredCoupons?.length > 0 ? (
                  filteredCoupons.map((coupon) => (
                    <div className="w-fit h-fit" key={coupon?.id}>
                      <div
                        className={
                          "ticket w-[320px] flex items-center justify-between gap-0 " +
                          (locale === "ar" ? "flex-row" : "flex-row-reverse")
                        }
                      >
                        <div className="stub overflow-hidden">
                          <div className="w-[110px] aspect-square bg-white">
                            <Image
                              src={coupon?.store_image}
                              alt={coupon?.store_slug}
                              width={110}
                              height={110}
                              unoptimized
                              className="w-full aspect-square size-[110px] object-contain border-l-1 border-dashed border-[#ef5658]"
                            />
                          </div>
                        </div>

                        <div className="check flex flex-col justify-between items-center">
                          <div className="w-full h-fit text-xs font-semibold">
                            <p>{coupon?.title}</p>
                          </div>
                          {coupon?.type === "coupon" ? (
                            <div className="w-11/12 h-10 bg-green-500/0 overflow-hidden border-1 border-dashed rounded-md border-main-500 flex items-center justify-center">
                              <div className="w-3/5 h-full bg-green-300/0 flex items-center justify-center font-bold">
                                {coupon?.code}
                              </div>
                              <div
                                role="button"
                                aria-label="Copy Coupon"
                                className={
                                  "w-2/5 h-full px-1 bg-yellow-300 hover:bg-main-500 hover:text-white flex items-center justify-center text-xs text-center cursor-pointer " +
                                  (locale === "ar"
                                    ? "border-r-1 border-dashed border-main-500"
                                    : "border-l-1 border-dashed border-main-500")
                                }
                                onClick={() => handelCopyCoupon(coupon)}
                              >
                                {t("Copy Coupon")}
                              </div>
                            </div>
                          ) : (
                            <div
                              role="button"
                              aria-label="Copy Coupon"
                              className="w-11/12 h-10 bg-green-500/0 overflow-hidden border-1 border-dashed rounded-md border-main-500 flex items-center justify-center"
                            >
                              <div
                                className="w-full h-full px-1 bg-yellow-300 hover:bg-main-500 hover:text-white flex items-center justify-center text-xs text-center cursor-pointer"
                                onClick={() => handelCopyCoupon(coupon)}
                              >
                                {t("Get Offer")}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <Empty description={t("No Coupons")} />
                )
              ) : (
                <Spinner className="m-auto" />
              )}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default TicketCoupon;
