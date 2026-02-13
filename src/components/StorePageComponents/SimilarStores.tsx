"use client";
import React from "react";
import Image from "next/image";
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

function SimilarStores({ stores }: { stores: StoreProps[] }) {
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
            >
              <div className="w-24 aspect-square p-0 rounded-full bg-white shadow-md">
                <Image
                  src={store?.image ? encodeURI(store.image) : "noPreview.webp"}
                  alt={store.store_name}
                  width={96}
                  height={96}
                  loading="lazy"
                  className="size-full object-contain rounded-full"
                />
              </div>
            </Link>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}

export default SimilarStores;
