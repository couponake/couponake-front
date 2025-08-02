"use client";
import React, { useState } from "react";
import { CopyIcon, BadgePercent, CheckCircle, X } from "lucide-react";
import { secureHtmlLinks } from "@/lib/htmlUtils";
import { useTranslations, useLocale } from "next-intl";
import { useStore } from "@/store";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { cn, useCoupon } from "@/lib/utils";
import { toast } from "@/components/ui/custom-toast";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@heroui/button";

interface Props {
  storeName?: string
}

const ShowCouponDetails = ({ storeName }: Props) => {
  const t = useTranslations();
  const local = useLocale();
  const { selectedCoupon: coupon, setSelectedCoupon } = useStore(
    (store) => store
  );
  const [isCouponCopied, setIsCouponCopied] = useState(false);
  const [_, copyToClipboard] = useCopyToClipboard();

  const toggleIsOpen = () => {
    setSelectedCoupon(null);
  };
  if (!coupon) return null;

  const handleCopyCoupon = async () => {
    if (coupon?.code) {
      copyToClipboard(coupon?.code ?? "");
      setIsCouponCopied(true);

      (window as any).gtag?.("event", 'coupons_copy', {
        event_category: coupon?.slug,
        event_title: coupon?.title,
        coupon_id: coupon?.id,
        coupon_code: coupon?.code,
        store_name: coupon?.store_slug ?? coupon?.slug,
        store_id: coupon?.store_id,
      });

      await useCoupon(coupon?.id);
      toast.success(t("Coupon copied successfully"));

      setTimeout(() => {
        const link = document.createElement("a");
        link.href = coupon?.url;
        link.target = "_blank";
        link.rel = "nofollow";
        link.click();
      }, 1000);

      setTimeout(() => {
        setIsCouponCopied(false);
      }, 2000);
    }
  };


  return (
    <Drawer open={!!coupon} onClose={toggleIsOpen}>
      <DrawerContent
        className="max-w-screen-md mx-auto"
        dir={local === "ar" ? "rtl" : "ltr"}
      >
        <Button
          onPress={toggleIsOpen}
          isIconOnly
          className="absolute top-2 start-4 rounded-full hover:bg-red-100 transition-colors duration-200"
          aria-label={t("Close")}
        >
          <X className="size-4" />
        </Button>
        <DrawerHeader className="sr-only">
          <DrawerTitle>{coupon?.title}</DrawerTitle>
          <DrawerDescription>{coupon?.description}</DrawerDescription>
        </DrawerHeader>
        <div className="flex h-full scrollbar overflow-y-scroll max-h-full flex-col items-center justify-between">
          <div className="modal-header w-full">
            <div className="w-full px-2 pt-8 text-xs font-normal text-center text-neutral-600">
              {
                storeName ? (
                  <>
                    {t("Coupon source")}
                    {local === "ar" ? ` ${storeName?.split("-")[0]}` : ` ${storeName?.split("-")[1]}`}
                  </>
                ) : (
                  <>
                    {t("CouponSource")}
                  </>
                )
              }

            </div>
            <div className="flex items-center justify-between gap-2 border-b border-neutral-100 bg-white p-2 py-4 xs:p-5">
              <span>
                <div>
                  <div className="font-head text-sm sm:text-lg md:text-2xl lg:text-2xl xl:text-2xl font-bold text-neutral-950">
                    {coupon?.title}
                  </div>
                </div>
              </span>
            </div>
          </div>
          <div className="modal-body w-full flex flex-col justify-center items-center gap-0">
            <div className="w-full border-b border-neutral-100 bg-white p-4 text-lg font-medium">
              <div className="flex flex-col items-center justify-center">
                <h2 className="flex items-center justify-center gap-5">
                  <div className="flex items-center w-fit max-w-lg rounded-3xl gap-3 bg-green-250 bg-opacity-25 p-2 px-3 md:text-lg lg:text-xl font-semibold text-green-250">
                    <BadgePercent className="size-5 md:size-7" />
                    {t("Discount")}
                  </div>
                  <span className="flex items-center text-3xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-6xl font-bold">
                    {coupon?.discount_value}
                  </span>
                </h2>
              </div>
            </div>
            <div className="w-full bg-white p-5 text-base sm:text-lg md:text-lg lg:text-lg xl:text-xl 2xl:text-3xl text-neutral-800">
              {coupon?.description && (
                storeName === undefined ? (
                  <>
                    <h3 className="mb-2.5 font-semibold">{t("Details")}:</h3>
                    <div
                      className="prose max-w-none leading-normal"
                      dangerouslySetInnerHTML={{
                        __html: secureHtmlLinks(coupon?.description),
                      }}
                    />
                  </>
                ) : (
                  <>
                    <h3 className="mb-2.5 font-semibold">{t("Note")}:</h3>
                    <div
                      className="prose max-w-none leading-normal text-main-500 text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg 2xl:text-lg"
                    >
                      {t("StoreAnalytics")}
                      {local === "ar" ? ` ${storeName?.split("-")[0]}` : ` ${storeName?.split("-")[1]}`}
                    </div>
                  </>
                )
              )}
            </div>

            <div className="w-[90%] my-6">
              <div
                className={cn(
                  "flex rounded-full transition-all duration-300 bg-neutral-50 text-2xl font-bold",
                  isCouponCopied && "bg-green-50",
                  coupon?.type === "coupon"
                    ? "justify-between"
                    : "justify-center"
                )}
              >
                {coupon?.type === "coupon" && (
                  <div className="my-auto flex-grow text-center text-xl tracking-[0.2rem] xs:text-2xl sm:tracking-[0.4rem]">
                    {coupon?.code}
                  </div>
                )}
                <button
                  onClick={() => handleCopyCoupon()}
                  className={cn(
                    "m-2 flex cursor-pointer items-center gap-3 rounded-full transition-all duration-300 bg-main-600 px-4 py-2 text-sm text-white xs:px-8 xs:py-4 xs:text-lg",
                    isCouponCopied && "bg-green-600"
                  )}
                >
                  {isCouponCopied ? <CheckCircle /> : <CopyIcon />}
                  {isCouponCopied ? t("Copied") : t("Copy Coupon")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ShowCouponDetails;
