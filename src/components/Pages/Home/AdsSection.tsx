"use client";
import React, { useEffect, useRef } from "react";
import { AdItem } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AdsItem from "@/components/HomePageComponents/AdsItem";
import { useLocale, useTranslations } from "next-intl";
import AutoScroll from "embla-carousel-auto-scroll";
import { Skeleton } from "@/components/ui/skeleton";

const AdsSection = ({
  ads,
  isLoading,
}: {
  ads: AdItem[];
  isLoading: boolean;
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const viewedAds = useRef<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const elements = document.querySelectorAll("[data-ad-id]");
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const adId = entry.target.getAttribute("data-ad-id");
          if (entry.isIntersecting && adId && !viewedAds.current.has(adId)) {
            viewedAds.current.add(adId);
            if (typeof window !== "undefined" && (window as any).gtag) {
              (window as any).gtag("event", "deal_view", {
                deal_id: adId,
                deal_title: ads.find(ad => ad.id === Number(adId))?.title,
              });
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    elements.forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, [ads]);

  const AdSkeleton = () => (
    <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3 basis-full">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-100 flex flex-col h-full">
        <Skeleton className="aspect-[16/9] w-full rounded-none" />
        <div className="p-5 space-y-3 flex-grow">
          <Skeleton className="h-6 w-3/4" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-neutral-50">
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </CarouselItem>
  );

  if (isLoading) {
    return (
      <section className="relative container py-16">
        <div className="mb-12 text-center">
          <Skeleton className="mx-auto h-10 w-48 mb-4" />
        </div>
        <div className="overflow-hidden"> {/* Wrapper to protect parent margins */}
          <Carousel opts={{ align: "start" }}>
            <CarouselContent className="-ml-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <AdSkeleton key={index} />
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>
    );
  }

  if (!ads || ads.length === 0) return null;

  return (
    <section className="w-full relative container py-10"
      style={{
        backgroundImage: "url('/jason-leung-Xaanw0s0pMk-unsplash.webp')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full h-full bg-zinc-900/40 backdrop-blur-sm absolute top-0 left-0" />

      <div className="relative z-10">
        <div className="w-full mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">
            {t("DealsDiscover")}
          </h2>
        </div>

        {/* The overflow-hidden div ensures the -ml-4 doesn't pull the container edge */}
        <div className="overflow-hidden">
          <Carousel
            opts={{
              align: "start",
              direction: locale === "ar" ? "rtl" : "ltr",
              loop: true,
            }}
            plugins={[
              AutoScroll({
                speed: 1,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {ads?.map((ad) => (
                <CarouselItem
                  key={ad.id}
                  data-ad-id={ad.id}
                  className="pl-4 md:basis-1/2 lg:basis-1/3 basis-full"
                >
                  <div className="h-full py-2">
                    <AdsItem item={ad} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default AdsSection;