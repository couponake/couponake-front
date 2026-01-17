"use client";
import StoreCoupon from "@/components/StorePageComponents/StoreCoupon";
import { CouponProps } from "@/types";
import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface StoreCouponsProps {
  store_coupons: CouponProps[];
  store_image: string;
}

function StoreCoupons({ store_coupons, store_image }: StoreCouponsProps) {
  const t = useTranslations();
  const [visibleCount, setVisibleCount] = useState<number>(3);

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, store_coupons?.length || 0));
  };
  const handleShowLess = () => {
    setVisibleCount(3);
  };

  const couponsToShow = store_coupons?.slice(0, visibleCount);
  const allVisible = visibleCount >= (store_coupons?.length || 0);

  return (
    <div className="space-y-3 bg-red-400/0">
      {store_coupons && store_coupons.length > 0 && (
        <>
          {couponsToShow &&
            couponsToShow.map((coupon: CouponProps) => (
              <StoreCoupon
                key={coupon?.id}
                coupon={coupon}
                store_image={store_image}
              />
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
      )}
    </div>
  );
}

export default StoreCoupons;
