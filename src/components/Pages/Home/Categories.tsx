"use client";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryItem } from "@/types";

const fetchCategories = async () => {
  const data = await api.request.get("home/categories");
  return data?.data || [];
};

const Categories = () => {
  const t = useTranslations();
  const locale = useLocale();
  const { data: categories, isLoading } = useQuery<CategoryItem[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  if (isLoading) {
    return (
      <div id="categories" className="bg-white py-16">
        <div className="container mx-auto">
          <div className="mx-auto text-center">
            <div className="md:text-header-4 m-0 mb-5 text-lg font-bold">
              {t("Explore by category")}
            </div>
          </div>
        </div>
        <Carousel
          opts={{
            align: "center",
            loop: true,
            direction: locale === "ar" ? "rtl" : "ltr",
          }}
          className="z-10 my-12 w-full"
        >
          <CarouselContent>
            {Array.from({ length: 9 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="z-10 my-5 basis-1/2 sm:basis-1/4 md:basis-1/5 lg:md:basis-1/6 2xl:basis-[11%]"
              >
                <div className="flex h-64 flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br from-main-300 via-pink-500 to-main-700 p-6">
                  <Skeleton className="h-8 w-3/4 mx-auto mb-2.5 bg-white/30" />
                  <div className="flex justify-center items-end">
                    <Skeleton className="w-48 h-48 rounded-lg bg-white/30" />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="flex w-full justify-center">
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!categories || categories?.length === 0) return null;
  return (
    <div id="categories" className="bg-white py-16">
      <div className="container mx-auto">
        <div className="mx-auto text-center">
          <div className="md:text-header-4 m-0 mb-5 text-lg font-bold">
            {t("Explore by category")}
          </div>
        </div>
      </div>
      <Carousel
        opts={{
          align: "center",
          loop: true,
          direction: locale === "ar" ? "rtl" : "ltr",
        }}
        plugins={[
          Autoplay({
            delay: 4950,
          }),
        ]}
        className="z-10 my-12 w-full"
      >
        <CarouselContent>
          {categories?.map((category, index) => (
            <CarouselItem
              key={category?.id || index}
              className="z-10 my-5 basis-1/2 sm:basis-1/4 md:basis-1/5 lg:md:basis-1/6 2xl:basis-[11%]"
            >
              <Link
                prefetch={false}
                target="_self"
                href={`/coupon-category/${category?.slug}`}
              >
                <div className="flex h-64 flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br from-main-300 via-pink-500 to-main-700 p-6">
                  <p className="mb-2.5 text-center text-xl font-bold text-white lg:text-2xl">
                    {category?.name}
                  </p>
                  {category?.image && (
                    <Image
                      src={category?.image ?? null}
                      alt="category-img"
                      loading="lazy"
                      width={192}
                      height={192}
                      quality={100}
                      className="w-48 rounded-lg object-cover"
                      unoptimized
                    />
                  )}
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="flex w-full justify-center">
        <Link
          prefetch={false}
          target="_self"
          href="/categories"
        >
          <button className="sm:text-lg rounded-xl px-3 py-2 gradient-btn transition-all">
            {t("View all")}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Categories;
