"use client";
import "./style.css";

import { useStore } from "@/store";
import { CouponProps } from "@/types";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

function RelatedTicketCouponItem({ coupon }: { coupon: CouponProps }) {
  const t = useTranslations();
  const locale = useLocale();
  const setSelectedCoupon = useStore((store) => store.setSelectedCoupon);

  return (
    <>
      <div
        className={
          "w-[280px] bg-transparent flex items-center justify-between gap-0 mx-0 " +
          (locale === "ar" ? "flex-row" : "flex-row-reverse")
        }
      >
        <div className="stub overflow-hidden">
          <div className="w-[90px] h-[100px] bg-white">
            <Image
              src={
                coupon?.store_image
                  ? encodeURI(coupon?.store_image)
                  : "noPreview.webp"
              }
              alt={coupon?.store_slug}
              width={90}
              height={90}
              className="w-full aspect-square size-[90px] p-2 object-contain border-l-1 border-dashed border-[#7214d1]"
            />
          </div>
        </div>

        <div className="check flex flex-col justify-between items-center">
          <div className="w-full h-fit text-xs mb-2 font-semibold">
            <p className="line-clamp-2">
              {coupon?.slug?.replace(/-/g, " ")} {coupon?.discount_value}
            </p>
          </div>
          {coupon?.type === "coupon" ? (
            <div className="w-11/12 h-12 overflow-hidden border-1 border-dashed rounded-md border-main-500 flex items-center justify-center">
              <div className="w-3/5 h-full bg-green-300/0 flex items-center justify-center font-bold">
                {coupon?.code}
              </div>
              <div
                className={
                  "w-2/5 h-full px-1 bg-yellow-300 hover:bg-main-500 hover:text-white flex items-center justify-center text-[10px] text-center cursor-pointer " +
                  (locale === "ar"
                    ? "border-r-1 border-dashed border-main-500"
                    : "border-l-1 border-dashed border-main-500")
                }
                onClick={() => setSelectedCoupon(coupon)}
              >
                {t("Copy Coupon")}
              </div>
            </div>
          ) : (
            <div className="w-11/12 h-12 overflow-hidden border-1 border-dashed rounded-md border-main-500 flex items-center justify-center">
              <div
                className="w-full h-full px-1 bg-yellow-300 hover:bg-main-500 hover:text-white flex items-center justify-center text-[10px] text-center cursor-pointer"
                onClick={() => setSelectedCoupon(coupon)}
              >
                {t("Get Coupon")}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default RelatedTicketCouponItem;
