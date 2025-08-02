"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useLocale, useTranslations } from "next-intl";
import { secureHtmlLinks } from "@/lib/htmlUtils";
import { Skeleton } from "@/components/ui/skeleton";

interface Text {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

interface TextCarouselProps {
  texts: Text[];
  isLoading: boolean;
}

const TextCarousel: React.FC<TextCarouselProps> = ({ texts, isLoading }) => {
  const t = useTranslations();
  const locale = useLocale();
  
  if (isLoading) {
    return (
      <section className="container mx-auto py-12">
        <Skeleton className="h-8 w-3/4 mb-5" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md p-6 h-full border border-gray-100">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  if (!texts || texts.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto py-12">
      <h2 className="text-lg my-5 font-semibold text-neutral-900 sm:text-xl md:text-2xl">
        {t("Important Information About Store Discount Codes")}
      </h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
          direction: locale === "ar" ? "rtl" : "ltr",
        }}
        className="w-full relative"
      >
        <CarouselContent>
          {texts.map((text) => (
            <CarouselItem key={text.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 h-full transition-all duration-300 hover:shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {text.title}
                </h3>
                <div
                  className="text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: secureHtmlLinks(text.description) as string,
                  }}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div>
          <CarouselPrevious className="-left-5 bg-white" />
          <CarouselNext className="-right-5 bg-white" />
        </div>
      </Carousel>
    </section>
  );
};

export default TextCarousel;
