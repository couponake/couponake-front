"use client";
import React, { useEffect, useRef } from "react";
import { AdItem } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AdsItem from "@/components/AdsItem";
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
  const viewedAds = useRef<Set<string>>(new Set()); // To track already viewed ads

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
      {
        threshold: 0.5, // At least 50% of ad should be visible
      }
    );

    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [ads]);

  if (isLoading) {
    return (
      <section className="relative container py-16">
        <div className="">
          <div className="mb-12 text-center">
            <Skeleton className="mx-auto h-10 w-40 mb-4" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="p-3">
                <Skeleton className="w-full h-48 rounded-t-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!ads || ads.length === 0) {
    return null;
  }
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
      <div className="w-full h-full bg-zinc-400/50 backdrop-blur-sm absolute top-0 left-0" />
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
        className="Carousel max-w-full bg-red-600/0"
      >
        <div className="w-full mb-10 text-center">
          <h2 className="text-2xl font-semibold text-white">{t("DealsDiscover")}</h2>
        </div>

        <CarouselContent className="h-full">
          {ads?.map((ad) => (
            <CarouselItem
              key={ad.id}
              data-ad-id={ad.id} // Add identifier for tracking
              className="px-5 md:p-0 lg:p-0 xl:p-0 lg:basis-1/2 2xl:basis-1/2"
            >
              <AdsItem item={ad} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default AdsSection;
