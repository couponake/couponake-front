"use client";
import { cn } from "@/lib/utils";
import ProductCard from "./ProductCard";
import { useLocale } from "next-intl";
import { Product } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Skeleton } from "./ui/skeleton";

interface ProductGridProps {
  title?: string;
  products: { data: Product[] };
  className?: string;
  isLoading: boolean;
}

export default function ProductsCarousel({
  title,
  products,
  className,
  isLoading,
}: ProductGridProps) {
  const locale = useLocale();
  if (!isLoading && (!products || products?.data.length <= 0)) return null;
  return (
    <div
      className={cn("w-full py-7 container lg:py-11", className)}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      {title && <h2 className="text-xl font-bold mb-6">{title}</h2>}

      <Carousel
        opts={{
          align: "start",
          loop: true,
          direction: locale === "ar" ? "rtl" : "ltr",
        }}
        className="w-full relative"
      >
        <div className="max-sm:hidden h-[90%] top-0 w-30 sm:w-50 absolute rtl:bg-linear-to-l ltr:bg-linear-to-r from-transparent to-main-50 z-[10] end-0 pointer-events-none" />
        <CarouselContent className="">
          {isLoading
            ? // Skeleton loading UI
              Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem
                  key={`skeleton-${index}`}
                  className="basis-[70%] xs:basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                >
                  <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg h-full">
                    {/* Skeleton for image */}
                    <div className="relative h-[250px] w-full overflow-hidden">
                      <Skeleton className="h-full w-full" />
                    </div>
                    {/* Skeleton for content */}
                    <div className="p-5 flex flex-col gap-3">
                      <div className="flex-grow">
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-6 w-3/4" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-7 w-20" />
                        <Skeleton className="h-10 w-10 rounded-full" />
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))
            : // Actual product data
              products?.data?.map((product, index) => (
                <CarouselItem
                  key={index}
                  className="basis-[70%] xs:basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                >
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
        </CarouselContent>

        <div className="flex items-center gap-3 justify-end mt-7 max-sm:hidden">
          <CarouselNext className="relative left-0 right-0 translate-x-0 translate-y-0  w-10 h-10 rounded-xl border border-[#4D5969] bg-transparent hover:bg-gray-50 transition-colors" />
          <CarouselPrevious className="relative left-0 right-0 translate-x-0 translate-y-0 w-10 h-10 rounded-xl border border-[#4D5969] bg-transparent hover:bg-gray-50 transition-colors" />
        </div>
      </Carousel>
    </div>
  );
}
