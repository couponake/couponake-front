"use client";
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { CouponProps } from '@/types';
import Autoplay from 'embla-carousel-autoplay';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react';

import RelatedTicketCouponItem from './ui/RelatedTicketCoupon/RelatedTicketCouponItem';


const SimilarCoupons = ({ coupons }: { coupons: CouponProps[] }) => {
    const t = useTranslations();
    const locale = useLocale();

    if (!coupons || coupons.length === 0) {
        return null;
    }

    return (
        <Carousel
            opts={{
                align: "start",
                loop: true,
                direction: locale === "ar" ? "rtl" : "ltr",
                dragFree: true,
            }}
            plugins={[
                Autoplay({
                    delay: 2900,
                }),
            ]}
            orientation="horizontal"
            className={cn("Carousel relative")}
        >
            <div className="max-sm:hidden h-[77%] bottom-0 w-30 sm:w-50 absolute rtl:bg-gradient-to-l ltr:bg-gradient-to-r from-transparent to-neutral-50 z-[10] end-0 pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-5">
                <h2 className="my-5 text-lg font-semibold text-neutral-900 sm:text-xl md:text-2xl">
                    {t("Related coupons")}
                </h2>
                <div className="flex items-center gap-3 rtl:flex-row-reverse max-sm:hidden z-50">
                    <CarouselPrevious className="relative left-0 right-0 translate-x-0 translate-y-0" />
                    <CarouselNext className="relative left-0 right-0 translate-x-0 translate-y-0" />
                </div>
            </div>
            <CarouselContent className="h-full flex gap-0">
                {
                    coupons.map((coupon: CouponProps) => (
                        <div className='w-fit h-fit' key={coupon?.id}>
                            <RelatedTicketCouponItem coupon={coupon} />
                        </div>
                    ))
                }
            </CarouselContent>
        </Carousel>
    );
};

export default SimilarCoupons;
