"use client";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { toast } from '@/components/ui/custom-toast';
import { cn } from '@/lib/utils';
import { BannerItem } from '@/types';
import { Spinner } from '@heroui/spinner';
import { useCopyToClipboard } from '@uidotdev/usehooks';
import Autoplay from 'embla-carousel-autoplay';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const isYouTubeUrl = (url: string): boolean => {
  return url.includes("youtube.com") || url.includes("youtu.be");
};

const getYouTubeEmbedUrl = (url: string): string => {
  let videoId = "";
  if (url.includes("youtube.com/watch")) {
    videoId = new URL(url).searchParams.get("v") || "";
  } else if (url.includes("youtube.com/shorts")) {
    // Extract video ID from YouTube shorts URL
    videoId = url.split("/shorts/")[1]?.split("?")[0] || "";
  } else if (url.includes("youtu.be")) {
    videoId = url.split("/").pop() || "";
  }
  return `https://www.youtube.com/embed/${videoId}`;
};

const Hero = ({
  banners,
  location,
  className,
  carouselItemClassName,
  autoplay = false,
  storeName
}: {
  banners: BannerItem[];
  location?: "above_texts" | "coupon_block" | "side_part";
  className?: string;
  carouselItemClassName?: string;
  autoplay?: boolean;
  storeName?: string;
}) => {
  const [, copyToClipboard] = useCopyToClipboard();
  const t = useTranslations();
  const locale = useLocale();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const selectedIndex = api.selectedScrollSnap();
      setCurrent(selectedIndex);

      const visibleBanner = banners?.filter(b =>
        location ? b?.location === location : true
      )[selectedIndex];

      if (storeName) {
        if (visibleBanner && typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag("event", `${storeName}_banner_view`, {
            banner_id: visibleBanner.id,
            banner_title: visibleBanner.title,
            banner_location: visibleBanner?.location
          });
        }
      } else {
        if (visibleBanner && typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag("event", "banner_view", {
            banner_id: visibleBanner.id,
            banner_title: visibleBanner.title,
          });
        }
      }
    };

    onSelect();

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, banners]);

  useEffect(() => {
    if (banners && banners.length > 0) {
      setIsLoading(false);
    }
  }, [banners]);


  if (!banners || banners.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="h-full min-h-24 md:min-h-64 min-w-80 overflow-x-hidden mx-auto container mb-7 md:mb-14 w-full rounded-2xl bg-[#efefef] flex justify-center items-center">
        <Spinner />
      </div>
    )
  }

  const handleBannerClick = (banner: BannerItem) => {
    if (storeName) {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag("event", `${storeName}_banner_click`, {
          banner_id: banner?.id,
          banner_title: banner?.title,
          banner_location: banner?.location
        });
      }
    } else {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag("event", "banner_click", {
          banner_id: banner?.id,
          banner_title: banner?.title,
        });
      }
    }

    if (banner?.code) {
      toast.success(t("Coupon copied successfully and will be redirected to the store"));
      copyToClipboard(banner?.code);
      if (typeof window !== "undefined") {
        setTimeout(() => {
          const link = document.createElement("a");
          link.href = banner?.url;
          link.target = "_blank";
          link.rel = "nofollow";
          link.click();
        }, 2000);
      }
    }
  }
  return (
    <div className={cn("mb-7 md:mb-14", className)}>
      <Carousel
        opts={{
          align: "center",
          loop: true,
          direction: locale === "ar" ? "rtl" : "ltr",
        }}
        plugins={[
          ...(autoplay ? [Autoplay({ delay: 4000 })] : []),
          // ClassNames(),
        ]}
        className="mx-auto container relative"
        setApi={setApi}
      >
        <CarouselPrevious className="z-40 absolute size-6 sm:size-7 md:size-8 lg:size-10 xl:size-10 2xl:size-10 left-4 sm:left-5 md:left-6 lg:left-8 xl:left-8 2xl:left-8 top-1/2 transform -translate-y-1/2 bg-white/30 border-none" />
        <CarouselNext className="z-40 absolute size-6 sm:size-7 md:size-8 lg:size-10 xl:size-10 2xl:size-10 right-4 sm:right-5 md:right-6 lg:right-8 xl:right-8 2xl:right-8 top-1/2 transform -translate-y-1/2 bg-white/30 border-none" />
        <CarouselContent>
          {banners
            ? banners?.map((banner) =>
              (
                location
                  ? banner?.location && banner?.location === location
                  : true
              ) ? (
                <React.Fragment key={banner?.id}>
                  {banner?.image && (
                    <CarouselItem
                      className={cn(
                        "relative w-full basis-full rounded-lg",
                        carouselItemClassName
                      )}
                    >
                      <button
                        title={banner?.title}
                        className="w-full"
                        aria-label={banner?.title}
                        onClick={() => handleBannerClick(banner)}
                      >
                        <div className="w-full h-fit">
                          <div className="w-full h-fit rounded-lg">
                            <Image
                              className="w-full h-fit transition-all duration-300 ease-in-out rounded-lg"
                              height={170}
                              width={900}
                              quality={100}
                              priority
                              alt={banner?.title ?? "Banner"}
                              src={banner?.image}
                              unoptimized
                            />
                          </div>
                        </div>
                      </button>
                    </CarouselItem>
                  )}
                  {banner?.video && (
                    <CarouselItem
                      className={cn(
                        "relative max-md:max-w-[97vw] basis-full md:basis-2/3 lg:basis-1/3",
                        carouselItemClassName
                      )}
                    >
                      <button
                        className="w-full"
                        title={banner?.title}
                        aria-label={banner?.title}
                        onClick={() => handleBannerClick(banner)}
                      >
                        {isYouTubeUrl(banner.video) ? (
                          <iframe
                            src={getYouTubeEmbedUrl(banner.video)}
                            title={banner?.title || "YouTube Video"}
                            className="rounded-2xl max-h-64 w-full h-64 object-cover aspect-video"
                            style={{ width: "100%" }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            src={banner.video}
                            autoPlay
                            className="rounded-2xl max-h-64 object-cover w-full object-center"
                          />
                        )}
                      </button>
                    </CarouselItem>
                  )}
                </React.Fragment>
              ) : null
            )
            : null}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default Hero;
