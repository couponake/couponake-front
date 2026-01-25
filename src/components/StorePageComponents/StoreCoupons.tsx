"use client";
import StoreCoupon from "@/components/StorePageComponents/StoreCoupon";
import { CouponProps } from "@/types";
import React from "react";

interface StoreCouponsProps {
  store_coupons: CouponProps[];
  store_image: string;
}

function StoreCoupons({ store_coupons, store_image }: StoreCouponsProps) {

  const couponsToShow = store_coupons?.slice(0, store_coupons?.length || 0);

  return (
    <div className="space-y-3">
      {store_coupons && store_coupons.length > 0 && (
          couponsToShow &&
            couponsToShow.map((coupon: CouponProps) => (
              <StoreCoupon
                key={coupon?.id}
                coupon={coupon}
                store_image={store_image}
              />
            ))
      )}
    </div>
  );
}

export default StoreCoupons;
