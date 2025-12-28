"use client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api';
import { secureHtmlLinks } from '@/lib/htmlUtils';
import { Blog } from '@/types';
import { Spinner } from '@heroui/spinner';
import { useQuery } from '@tanstack/react-query';
import Autoplay from 'embla-carousel-autoplay';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';
import { useInView } from 'react-intersection-observer';

// API function to fetch blogs
const fetchBlogs = async () => {
  const data = await api.request.get("home/latest-blogs");
  return data?.data || [];
};

function stripAndTruncateHTML(html: string, limit: number = 250): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const text = doc.body.textContent || "";
  return text.length > limit ? text.slice(0, limit).trim() + "..." : text;
}

const LatestBlogs = () => {
  const t = useTranslations();
  const locale = useLocale();

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  // Use React Query to fetch blogs
  const {
    data: blogsData = [],
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["latest-blogs"],
    queryFn: () => fetchBlogs(),
    enabled: inView,
  });

  if (isLoading || isFetching) {
    return (
      <section className="container pb-16">
        <div className="">
          <Carousel
            opts={{
              align: "start",
            }}
            className="Carousel max-w-full relative"
          >
            <div className="max-sm:hidden h-[77%] bottom-0 w-30 sm:w-50 absolute rtl:bg-gradient-to-l ltr:bg-gradient-to-r from-transparent to-neutral-50 z-[10] end-0 pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-5">
              <h2 className="text-lg my-5 font-semibold text-neutral-900 sm:text-xl md:text-2xl">
                {t("Latest published blogs")}
              </h2>
              <div className="flex items-center gap-3 rtl:flex-row-reverse">
                <Spinner />
                <CarouselPrevious
                  disabled={true}
                  className="relative left-0 right-0 translate-x-0 translate-y-0"
                />
                <CarouselNext
                  disabled={true}
                  className="relative left-0 right-0 translate-x-0 translate-y-0"
                />
              </div>
            </div>
            <CarouselContent className="h-full max-h-60">
              {Array.from({ length: 3 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="py-2 2xl:basis-[57%] h-fit"
                >
                  <div className="block bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <div className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <div className="space-y-2 mb-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/5" />
                      </div>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-32 rounded-xl" />
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="container pb-16">
        <div className="text-center text-red-500">
          {t("Failed to load blogs. Please try again.")}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="container pb-16">
      {inView && (
        <div className="">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              direction: locale === "ar" ? "rtl" : "ltr",
            }}
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
            orientation="horizontal"
            className="Carousel max-w-full"
          >
            <div className="flex flex-wrap items-center justify-between gap-5">
              <h2 className="text-lg my-5 font-semibold text-neutral-900 sm:text-xl md:text-2xl">
                {t("Latest published blogs")}
              </h2>
              <div className="flex items-center gap-3 rtl:flex-row-reverse">
                {isLoading && <Spinner />}
                <CarouselPrevious
                  disabled={isLoading}
                  className="relative left-0 right-0 translate-x-0 translate-y-0"
                />
                <CarouselNext
                  disabled={isLoading}
                  className="relative left-0 right-0 translate-x-0 translate-y-0"
                />
              </div>
            </div>
            <CarouselContent className="h-full max-h-60">
              {blogsData?.map((info: Blog) => (
                <CarouselItem
                  key={info?.id}
                  className="py-2 w-full h-fit"
                >
                  <Link
                    prefetch={false}
                    target="_self"
                    href={`/${info?.slug}`}
                    dir="auto"
                  >
                    <div className="block bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                      <div className="p-6">
                        <h3 className="font-semibold text-lg mb-2 text-gray-800">
                          {info?.title}
                        </h3>
                        <div
                          className="text-gray-600 mb-4 line-clamp-3"
                          dangerouslySetInnerHTML={{
                            __html: secureHtmlLinks(
                              stripAndTruncateHTML(info?.content || "", 250)
                            ) as string,
                          }}
                        />

                        <div className="flex items-center gap-3">
                          <div className="text-sm text-gray-500">
                            {new Date(info?.created_at).toLocaleDateString(locale === "ar" ? 'ar-SA' : 'en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </div>
                          <button className="max-sm:text-sm border-2 border-default-300 rounded-xl px-3 py-2 hover:border-main-500 hover:bg-main-50 transition-all">
                            {t("View content")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </section>
  );
};

export default LatestBlogs;
