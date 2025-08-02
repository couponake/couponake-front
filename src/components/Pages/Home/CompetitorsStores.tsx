"use client";
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { StoreProps } from '@/types';
import Autoplay from 'embla-carousel-autoplay';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

const CompetitorsStores = ({
  stores,
  title,
}: {
  stores: StoreProps[];
  title: string;
}) => {
  const t = useTranslations();
  const locale = useLocale();
  if (!stores || stores.length === 0) {
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
          stopOnMouseEnter: false,
          stopOnInteraction: false,
        }),
      ]}
      orientation="horizontal"
      className="min-h-40 w-full"
    >
      <div className="flex flex-wrap items-center justify-between gap-5">
        <h2 className="my-5 text-lg font-semibold text-neutral-900 sm:text-xl md:text-2xl">
          {t("Competitors")}
          {locale === "ar"
            ? ` ${title?.split("-")[0]}`
            : ` ${title?.split("-")[1]}`}
        </h2>
        <div className="flex items-center gap-3 rtl:flex-row-reverse max-sm:hidden z-50">
          <CarouselPrevious className="relative left-0 right-0 translate-x-0 translate-y-0" />
          <CarouselNext className="relative left-0 right-0 translate-x-0 translate-y-0" />
        </div>
      </div>
      <CarouselContent className="min-h-40 w-full">
        {stores?.map((store: StoreProps, index) => (
          <div key={store?.id || index}>
            <Card className="w-32 h-fit p-1 rounded-b-3xl bg-[#F0F0F0]/50 hover:bg-main-500 text-black hover:text-white shadow-none rounded-full overflow-hidden border-none flex flex-col items-center justify-start">
              <CardContent className="p-0 rounded-full bg-white shadow-none">
                <div className="w-30 aspect-square">
                  <Image
                    src={store?.image ? store?.image : "/noPreview.webp"}
                    alt={store?.image ? store?.slug : "noPreview"}
                    width={120}
                    height={120}
                    loading="lazy"
                    className="size-full object-contain rounded-full"
                    unoptimized
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default CompetitorsStores;
