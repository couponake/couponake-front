"use client";
import { secureHtmlLinks } from "@/lib/htmlUtils";
import { BannerItem, CouponProps, InfoItem, StoreProps } from "@/types";
import { useLocale, useTranslations } from "next-intl";
import SimilarStores from "./SimilarStores";
import React from "react";
import styles from "@/styles/htmlSideTablesScroll.module.css";
import Hero from "../Pages/Home/Hero";

function makeSafeHtml(content: string | null): { __html: string } {
  return { __html: secureHtmlLinks(content ?? "") };
}

interface sidePartType {
  storeName: string;
  couponsLength: number;
  sideTable: {
    current_date: string;
    latest_coupon: CouponProps | null;
  } | null;
  similarStores: StoreProps[];
  storeBanners: BannerItem[] | null;
  storeSlug: string;
  storeInfo: InfoItem[];
}

function StoreSidePart({
  storeName,
  couponsLength,
  sideTable,
  similarStores,
  storeBanners,
  storeSlug,
  storeInfo,
}: sidePartType) {
  const t = useTranslations();
  const locale = useLocale();

  const tableInfo = [
    {
      id: 0,
      label: `${t("Coupons count")} ${storeName}`,
      value: couponsLength,
    },
    {
      id: 1,
      label: `${t("Coupons date")}`,
      value: `${new Date().toLocaleDateString(
        locale === "ar" ? "ar-SA" : "en-US",
        { month: "long" },
      )}`,
    },
    ...(sideTable
      ? [
          {
            id: 2,
            label: `${t("Strongest Coupon")} ${storeName}`,
            value: sideTable?.latest_coupon?.code,
          },
        ]
      : []),
  ];

  return (
    <>
      <div className="prose max-w-none min-w-64">
        <table className="w-full border-collapse border border-gray-200">
          <tbody>
            {tableInfo.map((item) => (
              <tr key={item.id} className="even:bg-gray-200">
                <td className="w-3/4 border border-gray-300 !p-2">
                  {item.label}
                </td>
                <td className="w-1/4 border border-gray-300 !p-2">
                  {item.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {storeInfo?.length > 0 && (
        <div className="space-y-5 mt-5">
          {storeInfo.map((info: InfoItem) => {
            // 1. Ensure it's an array, then filter out empty/null content
            const cleanDesc1 = (
              Array.isArray(info?.description) ? info?.description : []
            ).filter((item) => item?.content && item?.content.trim() !== "");

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
      <aside>
        <div className="mt-5 border-t-gray-300 border-t">
          <p className="font-semibold text-gray-700 text-lg mt-3 mb-5">
            {t("Similar Stores")}
          </p>
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 items-start justify-start gap-1.5 overflow-hidden">
            {similarStores?.map((store: StoreProps) => (
              <SimilarStores key={store?.slug} store={store} />
            ))}
          </div>
        </div>
      </aside>
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
