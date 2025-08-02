"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from '@/lib/axios';
import { useLocale, useTranslations } from "next-intl";
import { BrandProps } from "@/types";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";

const fetchLatestBrands = async () => {
  const data = await api.request.get("home/latest-brands");
  return data?.data || [];
};

export default function LatestBrands() {
  const t = useTranslations();
  const locale = useLocale();
  const { data: latest_brands, isLoading } = useQuery({
    queryKey: ["latestBrands"],
    queryFn: fetchLatestBrands,
  });

  if (isLoading) {
    return (
      <div className="relative pb-7 container">
        <Carousel
          opts={{
            align: "start",
            direction: locale === "ar" ? "rtl" : "ltr",
          }}
          className="Carousel max-w-full"
        >
          <div className="flex flex-wrap items-center justify-between gap-5">
            <h2 className="text-lg my-5 font-semibold text-neutral-900 sm:text-xl md:text-2xl">
              {t("Latest Brands")}
            </h2>
            <div className="flex items-center gap-3 rtl:flex-row-reverse">
              <Link 
              target="_self"
               href={`/brands`}>
                <button className="max-sm:text-sm border-2 border-default-300 rounded-xl px-3 py-2 hover:border-main-500 hover:bg-main-50 transition-all">
                  {t("View all")}
                </button>
              </Link>
              <CarouselPrevious className="relative left-0 right-0 translate-x-0 translate-y-0" />
              <CarouselNext className="relative left-0 right-0 translate-x-0 translate-y-0" />
            </div>
          </div>
          <CarouselContent className="h-full">
            {Array.from({ length: 4 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="pt-1 md:basis-1/2 lg:basis-1/3 2xl:basis-1/4"
              >
                <div className="min-w-64">
                  <div className="group relative overflow-hidden rounded-lg shadow dark:shadow-gray-800 m-2">
                    <Skeleton className="w-full h-72" />
                    <div className="absolute p-4 bottom-0 start-0 w-full">
                      <Skeleton className="h-6 w-3/4 mb-2" />
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

  if (!latest_brands || latest_brands?.length === 0) return null;

  return (
    <div className="relative pb-7 container">
      <Carousel
        opts={{
          align: "start",
          direction: locale === "ar" ? "rtl" : "ltr",
        }}
        className="Carousel max-w-full"
      >
        <div className="flex flex-wrap items-center justify-between gap-5">
          <h2 className="text-lg my-5 font-semibold text-neutral-900 sm:text-xl md:text-2xl">
            {t("Latest Brands")}
          </h2>
          <div className="flex items-center gap-3 rtl:flex-row-reverse">
            <Link 
            target="_self"
             href={`/brands`}>
              <button className="max-sm:text-sm border-2 border-default-300 rounded-xl px-3 py-2 hover:border-main-500 hover:bg-main-50 transition-all">
                {t("View all")}
              </button>
            </Link>
            <CarouselPrevious className="relative left-0 right-0 translate-x-0 translate-y-0" />
            <CarouselNext className="relative left-0 right-0 translate-x-0 translate-y-0" />
          </div>
        </div>
        <CarouselContent className="h-full">
          {latest_brands?.map((brand: BrandProps) => (
            <Link 
            target="_self"
             key={brand?.id} href={`/brands/${brand?.id}`}>
              <CarouselItem className="pt-1 md:basis-1/2 lg:basis-1/3 2xl:basis-1/4">
                <div className="min-w-64">
                  <div className="group relative overflow-hidden rounded-lg shadow dark:shadow-gray-800 m-2">
                    <Image
                      height={288}
                      width={300}
                      quality={100}
                      loading="lazy"
                      src={brand?.image ?? null}
                      className="w-full h-72 object-cover scale-125 group-hover:scale-100 duration-500"
                      alt={brand?.title}
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-b to-main-900 from-transparent opacity-40 group-hover:opacity-100 duration-500"></div>
                    <div className="absolute p-4 bottom-0 start-0">
                      <p className="text-lg lg:text-xl font-bold text-white hover:text-main-500 duration-500 ease-in-out">
                        {brand?.title}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            </Link>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
