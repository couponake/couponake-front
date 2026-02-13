"use client";
import BlogCard from '@/components/BlogPageComponents/blog-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api';
import { Blog } from '@/types';
import { Spinner } from '@heroui/spinner';
import { useQuery } from '@tanstack/react-query';
import Autoplay from 'embla-carousel-autoplay';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react';
import { useInView } from 'react-intersection-observer';

// API function to fetch blogs
const fetchBlogs = async () => {
  const data = await api.request.get("home/latest-blogs");
  return data?.data || [];
};

const LatestBlogs = () => {
  const t = useTranslations();
  const locale = useLocale();

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

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

  // Skeleton Loader Component for cleaner code
  const BlogSkeleton = () => (
    <CarouselItem className="pl-4 md:basis-1/3 sm:basis-1/2 basis-full">
      <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
        {/* Image Area Skeleton */}
        <Skeleton className="aspect-[16/9] w-full rounded-none" />

        <div className="p-5 flex flex-col gap-3">
          {/* Title Skeleton */}
          <Skeleton className="h-6 w-11/12" />

          {/* Description Skeletons */}
          <div className="space-y-2 mt-1">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>

          {/* Bottom Bar Skeleton */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-50">
            {/* Read More Button Skeleton */}
            <Skeleton className="h-9 w-24 rounded-lg" />
            {/* Date Skeleton */}
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    </CarouselItem>
  );

  if (isLoading || isFetching) {
    return (
      <section className="container pt-16">
        <div className="flex flex-wrap items-center justify-between gap-5 mb-5">
          <h2 className="text-lg font-semibold text-neutral-900 sm:text-xl md:text-2xl">
            {t("Latest published blogs")}
          </h2>
          <Spinner />
        </div>
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent className="-ml-4">
            {Array.from({ length: 3 }).map((_, i) => <BlogSkeleton key={i} />)}
          </CarouselContent>
        </Carousel>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="container pt-16">
        <div className="text-center text-red-500 py-10 border rounded-lg">
          {t("Failed to load blogs. Please try again.")}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="container pt-16">
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
            className="Carousel max-w-full"
          >
            <div className="flex flex-wrap items-center justify-between gap-5 mb-5">
              <h2 className="text-lg font-semibold text-neutral-900 sm:text-xl md:text-2xl">
                {t("Latest published blogs")}
              </h2>
              <div className="flex items-center gap-3 rtl:flex-row-reverse">
                <CarouselPrevious className="relative left-0 right-0 translate-x-0 translate-y-0" />
                <CarouselNext className="relative left-0 right-0 translate-x-0 translate-y-0" />
              </div>
            </div>

            <CarouselContent className="-ml-4">
              {blogsData?.map((info: Blog) => (
                <CarouselItem
                  key={info?.id}
                  className="pl-4 md:basis-1/3 sm:basis-1/2 basis-full py-2"
                >
                  <BlogCard blog={info} />
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