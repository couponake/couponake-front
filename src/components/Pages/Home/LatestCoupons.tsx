"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { CouponProps } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import HorizontalCouponCard from "@/components/HorizontalCouponCard";
import Autoplay from "embla-carousel-autoplay";
import { Skeleton } from '@/components/ui/skeleton';
import api from "@/lib/api";

const fetchLatestCoupons = async () => {
  const data = await api.request.get("home/latest-coupons");
  return data?.data || [];
};

export default function LatestCoupons() {
  const t = useTranslations();
  const locale = useLocale();
  const { data: latest_coupons, isLoading } = useQuery({
    queryKey: ["latestCoupons"],
    queryFn: fetchLatestCoupons,
  });

  if (isLoading) {
    return (
      <div className="relative my-10 md:my-16 container">
        <Carousel
          opts={{
            align: "center",
            loop: true,
            direction: locale === "ar" ? "rtl" : "ltr",
          }}
          orientation="horizontal"
          className="Carousel max-w-full"
        >
          <div className="flex flex-wrap items-center justify-between gap-5">
            <h2 className="my-5 text-lg font-semibold text-neutral-900 sm:text-xl md:text-2xl">
              {t("Recently Discount Codes Added")}
            </h2>
            <div className="flex items-center gap-3 rtl:flex-row-reverse">
              <CarouselPrevious className="relative left-0 right-0 translate-x-0 translate-y-0" />
              <CarouselNext className="relative left-0 right-0 translate-x-0 translate-y-0" />
            </div>
          </div>
          <CarouselContent className="h-full">
            {Array.from({ length: 3 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="pt-1 lg:basis-1/2 2xl:basis-1/3"
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg bg-gradient-to-br from-purple-100 to-main-100" dir="auto">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500 to-main-500 transform rotate-45 translate-x-12 -translate-y-12"></div>
                  
                  <div className="relative p-6 flex flex-col h-full">
                    <div className="flex items-center mb-4 gap-3">
                      <Skeleton className="w-16 h-16 rounded-full" />
                      <div>
                        <Skeleton className="h-6 w-48 mb-2" />
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-5/6 mb-4" />
                      
                      <div className="flex items-center mb-2">
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-4 w-32 mb-2" />
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    );
  }
  
  if (!latest_coupons || latest_coupons?.length === 0) return null;

  return (
    <div className="relative my-10 md:my-16 container">
      <Carousel
        opts={{
          align: "center",
          loop: true,
          direction: locale === "ar" ? "rtl" : "ltr",
        }}
        plugins={[
          Autoplay({
            delay: 2850,
          }),
        ]}
        orientation="horizontal"
        className="Carousel max-w-full"
      >
        <div className="flex flex-wrap items-center justify-between gap-5">
          <h2 className="my-5 text-lg font-semibold text-neutral-900 sm:text-xl md:text-2xl">
            {t("Recently Discount Codes Added")}
          </h2>
          <div className="flex items-center gap-3 rtl:flex-row-reverse">
            <CarouselPrevious className="relative left-0 right-0 translate-x-0 translate-y-0" />
            <CarouselNext className="relative left-0 right-0 translate-x-0 translate-y-0" />
          </div>
        </div>
        <CarouselContent className="h-full">
          {latest_coupons?.map((coupon: CouponProps) => (
            <CarouselItem
              key={coupon?.id}
              className="pt-1 lg:basis-1/2 2xl:basis-1/3"
            >
              <HorizontalCouponCard coupon={coupon} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
