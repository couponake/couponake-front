"use client";
import useDetectMobile from "@/hooks/useDetectMobile";
import { secureHtmlLinks } from "@/lib/htmlUtils";
import { BannerItem, BrandProps, CouponProps, InfoItem } from "@/types";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "@/styles/htmlTablesScroll.module.css";
import Hero from "../Pages/Home/Hero";

function makeSafeHtml(content: string | null): { __html: string } {
  return { __html: secureHtmlLinks(content ?? "") };
}

interface sidePartType {
  storeTitle: string;
  couponImage: string | null;
  storeName: string;
  couponsLength: number;
  sideTable: {
    current_date: string;
    latest_coupon: CouponProps | null;
  } | null;
  storeBrands: BrandProps[];
  storeBanners: BannerItem[] | null;
  storeSlug: string;
  storeInfo: InfoItem[];
}

function StoreSidePart({
  storeTitle,
  couponImage,
  storeName,
  couponsLength,
  sideTable,
  storeBrands,
  storeBanners,
  storeSlug,
  storeInfo,
}: sidePartType) {
  const t = useTranslations();
  const locale = useLocale();
  const isMobile = useDetectMobile();
  return (
    <>
      <p className="font-semibold text-gray-700 text-lg">{storeTitle}</p>
      {couponImage && (
        <div className="w-full h-fit overflow-hidden flex items-center justify-center">
          <Image
            src={couponImage}
            alt={storeTitle}
            width={!isMobile ? 215 : 175}
            height={!isMobile ? 120.94 : 98.44}
            className="rounded-lg w-full h-fit shadow-md object-cover my-2"
          />
        </div>
      )}
      <div className="prose max-w-none min-w-64 my-3">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <tbody>
            <tr className="even:bg-gray-200">
              <td className="border border-gray-300 px-4 py-2">
                {t("Coupons count")} {storeName}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {couponsLength}
              </td>
            </tr>
            <tr className="even:bg-gray-200">
              <td className="border border-gray-300 px-4 py-2">
                {t("Coupons date")}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date().toLocaleDateString(
                  locale === "ar" ? "ar-SA" : "en-US",
                  { month: "long" },
                )}
              </td>
            </tr>
            {sideTable && (
              <tr className="even:bg-gray-200">
                <td className="border border-gray-300 px-4 py-2">
                  {t("Strongest Coupon")} {storeName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {sideTable?.latest_coupon?.code}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {storeInfo?.length > 0 && (
        <div className="space-y-5 mt-11 border-t-gray-300 border-t">
          <p className="font-semibold text-gray-700 text-lg mt-3 mb-5">
            {t("About The store")}
          </p>
          {storeInfo.map((info: InfoItem) => {
            // 1. Ensure it's an array, then filter out empty/null content
            const cleanDesc1 = (
              Array.isArray(info.description) ? info.description : []
            ).filter((item) => item?.content && item.content.trim() !== "");

            // 2. If no valid content blocks exist, skip this InfoItem entirely
            if (cleanDesc1.length === 0) return null;

            // 3. Map over the cleaned data
            return cleanDesc1.map((item, idx) => (
              <div
                key={`desc1-${info.id}-${idx}`}
                dir="rtl"
                className="overflow-x-auto overflow-y-hidden h-fit bg-white rounded-md p-4 border-1 mb-4"
              >
                <div
                  className={`${styles.prose} prose prose-sm max-w-none font-cairo mb-4 last:mb-0`}
                  dangerouslySetInnerHTML={makeSafeHtml(item.content)}
                />
              </div>
            ));
          })}
        </div>
      )}
      {storeBrands?.length > 0 && (
        <div className="mt-11 border-t-gray-300 border-t">
          <p className="font-semibold text-gray-700 text-lg mt-3 mb-5">
            {t("Similar Brands")}
          </p>
          <div className="space-y-2">
            {storeBrands?.map((brand) => (
              <Link
                prefetch={false}
                target="_self"
                key={brand?.id}
                href={`/brand/${brand?.id}`}
                className="flex items-center gap-2 text-main-700 hover:underline"
              >
                {brand.image && (
                  <Image
                    src={brand.image}
                    alt={brand.slug}
                    width={60}
                    height={31.25}
                    className="max-w-15 rounded"
                  />
                )}
                {brand.title}
              </Link>
            ))}
          </div>
        </div>
      )}
      {storeBanners?.some((banner) => banner?.location === "side_part") && (
        <Hero
          carouselItemClassName="basis-full md:basis-full lg:basis-full"
          banners={storeBanners?.filter(
            (banner) => banner?.location === "side_part",
          )}
          location="side_part"
          className="mt-7"
          storeName={storeSlug}
        />
      )}
    </>
  );
}

export default StoreSidePart;
