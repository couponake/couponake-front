"use client";
import React from "react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { cn } from "@heroui/react";
import Autoplay from "embla-carousel-autoplay";
import { useLocale, useTranslations } from "next-intl";
import { StoreProps } from "@/types";
import { Skeleton } from "../ui/skeleton";

export default function SimilarStores({ stores }: { stores: StoreProps[] }) {
  const t = useTranslations();
  const locale = useLocale();
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
          stopOnFocusIn: false,
          stopOnInteraction: false,
        }),
      ]}
      orientation="horizontal"
      className={cn("Carousel relative")}
    >
      <div className="max-sm:hidden h-[77%] bottom-0 w-30 sm:w-50 absolute rtl:bg-gradient-to-l ltr:bg-gradient-to-r from-transparent to-neutral-50 z-[10] end-0 pointer-events-none" />

      <div className="flex flex-wrap items-center justify-between gap-5">
        <p className="font-semibold text-gray-700 text-xl mt-3 mb-5">
          {t("Similar Stores")}
        </p>
        <div className="flex items-center gap-3 rtl:flex-row-reverse z-50">
          <CarouselPrevious className="relative left-0 right-0 translate-x-0 translate-y-0" />
          <CarouselNext className="relative left-0 right-0 translate-x-0 translate-y-0" />
        </div>
      </div>
      <CarouselContent className="h-full min-h-[120px]">
        {stores?.map((store: StoreProps) => {
          return (
            <CarouselItem key={store?.slug} className="basis-auto">
              <Link
                prefetch={false}
                target="_self"
                href={`/store/${store?.slug}`}
                className="group relative block w-full h-fit overflow-hidden rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-300 hover:border-main-500 hover:text-main-600 hover:shadow-md active:scale-95"
              >
                <span className="absolute inset-0 z-0 bg-gradient-to-br from-main-50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <span className="relative z-10 truncate block w-full text-center">
                  {store?.slug}
                </span>
              </Link>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}

export function SimilarStoresSkeleton() {
  const t = useTranslations();
  const locale = useLocale();
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
          stopOnFocusIn: false,
          stopOnInteraction: false,
        }),
      ]}
      orientation="horizontal"
      className={cn("Carousel relative")}
    >
      <div className="max-sm:hidden h-[77%] bottom-0 w-30 sm:w-50 absolute rtl:bg-gradient-to-l ltr:bg-gradient-to-r from-transparent to-neutral-50 z-[10] end-0 pointer-events-none" />

      <div className="flex flex-wrap items-center justify-between gap-5">
        <p className="font-semibold text-gray-700 text-xl mt-3 mb-5">
          {t("Similar Stores")}
        </p>
        <div className="flex items-center gap-3 rtl:flex-row-reverse z-50">
          <CarouselPrevious className="relative left-0 right-0 translate-x-0 translate-y-0 disabled:cursor-not-allowed" />
          <CarouselNext className="relative left-0 right-0 translate-x-0 translate-y-0 disabled:cursor-not-allowed" />
        </div>
      </div>
      <CarouselContent className="h-full min-h-[120px]">
        {Array.from({ length: 8 })?.map((_, index) => {
          return (
            <CarouselItem key={index} className="basis-auto">
              <Skeleton key={index} className="rounded-sm w-40 h-10" />
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}
