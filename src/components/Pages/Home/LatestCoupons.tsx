"use client";
import "@/styles/ticketCouponStyle.css";
import Empty from "@/components/Empty";
import { LatestCouponsType } from "@/types";
import { Spinner } from "@heroui/spinner";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import api from "@/lib/api";
import { toast } from "../../ui/custom-toast";
import { useQuery } from "@tanstack/react-query";

const fetchLatestCoupons = async () => {
  const data = await api.request.get("home/latest-coupons");
  return data?.data || [];
};

function LatestCoupons() {
  const t = useTranslations();
  const locale = useLocale();
  const [, copyToClipboard] = useCopyToClipboard();

  const { data: latest_coupons, isLoading } = useQuery({
    queryKey: ["latestCoupons"],
    queryFn: fetchLatestCoupons,
  });

  const handelCopyCoupon = (coupon: LatestCouponsType) => {
    copyToClipboard(coupon?.code);
    toast.success(t("Coupon copied successfully"));
    if (typeof window !== "undefined" && (window as any).gtag) {
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

  if (isLoading) {
    return (
      <div className="bg-[#efefef] rounded-md container flex flex-col items-center justify-center gap-4 px-5 py-12">
        <Spinner className="m-auto" />
      </div>
    );
  }

  if (!isLoading && latest_coupons?.length === 0) {
    return (
      <div className="bg-[#efefef] rounded-md container flex flex-col items-center justify-center gap-4 px-5 py-12">
        <Empty description={t("No Coupons")} />
      </div>
    );
  }

  if (!latest_coupons) return null;

  return (
    <div className="bg-[#efefef] rounded-md container p-5 flex flex-col items-start justify-start gap-4">
      <h2 className="text-lg font-semibold text-neutral-900 sm:text-xl md:text-2xl">
        {t("BestCoupons")}
      </h2>
      <div className="flex flex-col items-center gap-5">
        <div className="w-full h-full flex items-start justify-start overflow-hidden">
          <div className="w-full h-fit flex flex-wrap items-start justify-center gap-4 p-0">
            {latest_coupons?.length > 0 &&
              latest_coupons?.map((coupon: LatestCouponsType) => (
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
                          className="w-full aspect-square size-[110px] object-contain border-l-1 border-dashed border-main-500"
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
                              "w-2/5 h-full px-1 bg-main-500 hover:bg-main-500/60 text-white flex items-center justify-center text-xs text-center cursor-pointer " +
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
                            className="w-full h-full px-1 bg-main-500 hover:bg-main-500/60 text-white flex items-center justify-center text-xs text-center cursor-pointer"
                            onClick={() => handelCopyCoupon(coupon)}
                          >
                            {t("Get Coupon")}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LatestCoupons;
