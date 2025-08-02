import React from "react";
import { CouponProps } from "@/types";
import {
    BadgePercent,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useStore } from "@/store";
import Image from "next/image";

const VerticalCouponCard = ({ coupon }: { coupon: CouponProps }) => {
    const t = useTranslations();
    const setSelectedCoupon = useStore((store) => store.setSelectedCoupon);
    return (
        <div role="button" className="flex h-full min-w-60 w-full flex-col justify-center gap-x-1 rounded-3xl bg-white p-3" onClick={()=>setSelectedCoupon(coupon)}>
            <div className="mt-4 xs:mt-8">
                <div className="mb-[14px] flex flex-col items-center justify-center">
                    <div className="mb-4 flex flex-col items-center justify-center overflow-hidden rounded-full border border-neutral-100">
                        <Image
                            src={coupon?.image}
                            width={104}
                            height={104}
                            alt={coupon?.brand} 
                            loading="lazy"
                            className="h-16 w-16 sm:h-[104px] sm:w-[104px]"
                            unoptimized
                        />
                    </div>
                    <h6
                        className="mb-4 line-clamp-1 text-center text-base font-bold xs:mb-8 sm:text-lg md:text-header-6"
                        title="Max"
                    >
                        {coupon?.brand} <span>{t("Discount code")}</span>
                    </h6>
                </div>
            </div>
            <div className="relative mx-6 h-auto border-b-2 border-dashed border-neutral-100">
                <div className="absolute -right-[52px] -top-3 h-6 w-12 rotate-90 transform rounded-bl-full rounded-br-full border-l-2 border-r-2 border-t-2 border-neutral-50/0 bg-neutral-50"></div>
                <div className="absolute -left-[52px] -top-3 h-6 w-12 -rotate-90 transform rounded-bl-full rounded-br-full border-l-2 border-r-2 border-t-2 border-neutral-50/0 bg-neutral-50"></div>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center">
                <h2 className="mb-2 mt-4 flex flex-col items-center justify-center xs:mt-7 sm:mb-4">
                    <div className="mb-2 flex w-fit max-w-[160px] gap-1 items-center justify-center rounded-lg bg-opacity-25 px-3 py-2 text-sm font-semibold bg-[#1B998B22]  text-green-250">
                        <BadgePercent size={16} /> {t("Discount")}
                    </div>
                    <span className="flex items-center font-bold sm:mb-2 sm:text-3xl">
                        {coupon?.discount_value} <span className="">%</span>
                    </span>
                </h2>
                <p className="line-clamp-2 text-ellipsis pb-4 text-center text-xs text-neutral-800 md:text-body-5">
                    {coupon?.description}
                </p>
            </div>
        </div>
    );
};

export default VerticalCouponCard;
