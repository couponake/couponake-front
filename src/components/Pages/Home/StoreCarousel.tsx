"use client";
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { StoreProps } from '@/types';
import Autoplay from 'embla-carousel-autoplay';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const StoreCarousel = ({
  stores,
  title,
  className,
  viewAllLink,
  showViewAll = true,
}: {
  stores: StoreProps[];
  title: string;
  className?: string;
  viewAllLink?: string;
  showViewAll?: boolean;
}) => {
  const t = useTranslations();
  const locale = useLocale();
  if (!stores || stores.length === 0) {
    return null;
  }

  // const HandleClickStore = (store: StoreProps) => {
  //   if (title === "Latest Stores") {
  //     if (typeof window !== 'undefined' && (window as any).gtag) {
  //       (window as any).gtag("event", "latest_stores_click", {
  //         store_id: store?.id,
  //         store_name: store?.slug,
  //       });
  //     }
  //   }
  // }

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
      className={cn("Carousel relative", className)}
    >
      <div className="max-sm:hidden h-[77%] bottom-0 w-30 sm:w-50 absolute rtl:bg-gradient-to-l ltr:bg-gradient-to-r from-transparent to-neutral-50 z-[10] end-0 pointer-events-none" />

      <div className="flex flex-wrap items-center justify-between gap-5">
        <h2 className="my-5 text-lg font-semibold text-neutral-900 sm:text-xl md:text-2xl">
          {t(title)}
        </h2>
        <div className="flex items-center gap-3 rtl:flex-row-reverse z-50">
          {showViewAll && (
            <Link
              target="_self"
              href={viewAllLink ? viewAllLink : "/stores"}>
              <button className="max-sm:text-sm rounded-xl px-3 py-2 gradient-btn transition-all">
                {t("View all")}
              </button>
            </Link>
          )}
          <CarouselPrevious className="relative left-0 right-0 translate-x-0 translate-y-0" />
          <CarouselNext className="relative left-0 right-0 translate-x-0 translate-y-0" />
        </div>
      </div>
      <CarouselContent className="h-full min-h-[120px]">
        {stores?.map((store: StoreProps, index) => (
          <div key={store?.id || index}>
            <Link
              target="_self"
              href={`/store/${store?.slug}`}
              // onClick={() => HandleClickStore(store)}
            >
              <Card className="w-32 h-fit p-1 rounded-b-3xl bg-[#F0F0F0]/50 hover:bg-main-500 text-black hover:text-white shadow-none rounded-full overflow-hidden border-none flex flex-col items-center justify-start">
                <CardContent className="p-0 rounded-full bg-white shadow-none">
                  <div className="w-30 aspect-square">
                    <Image
                      src={store?.image || 'noPreview.webp'}
                      alt={store?.image || 'store'}
                      width={120}
                      height={120}
                      loading="lazy"
                      className="size-full object-contain rounded-full"
                      unoptimized
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        ))}
      </CarouselContent>
    </Carousel >
  );
};

export default StoreCarousel;
