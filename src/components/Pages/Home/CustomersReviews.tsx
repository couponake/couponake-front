"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Rate } from "@/components/ui/rate";
import { Skeleton } from "@/components/ui/skeleton";
import { secureHtmlLinks } from "@/lib/htmlUtils";
import { cn } from "@/lib/utils";
import { testimonialType, userReviewType } from "@/types";
import { Avatar } from "@heroui/avatar";
import Autoplay from "embla-carousel-autoplay";
import { QuoteIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

interface generalType {
  id: number;
  name: string;
  rate: string;
  description: string;
  image?: string;
  store_id?: number;
}

function makeSafeHtml(content: string | null): { __html: string } {
  return { __html: secureHtmlLinks(content ?? "") };
}

export default function CustomersReviews({
  reviews,
  className,
  isLoading,
  page,
}: {
  reviews: testimonialType[] | userReviewType[];
  className?: string;
  isLoading?: boolean;
  page?: string;
}) {
  const t = useTranslations();
  const seenReviewIds = useRef<Set<number>>(new Set());
  const reviewRefs = useRef<Record<number, HTMLElement | null>>({});

  const reviewsReformat: generalType[] = reviews?.map((review) => {
    if ("stars" in review) {
      return {
        id: Number(review.id),
        name: review.name,
        image: review.image,
        rate: review.stars,
        description: review.description,
      };
    }
    return {
      id: Number(review.id),
      name: review.name,
      rate: review.rate,
      description: review.description,
      store_id: review.store_id,
    };
  });

  useEffect(() => {
    if (!reviewsReformat || reviewsReformat.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const id = Number(target.dataset.reviewId);
            const name = target.dataset.reviewerName || "Anonymous";

            if (!seenReviewIds.current.has(id)) {
              seenReviewIds.current.add(id);

              if (typeof window !== "undefined" && (window as any).gtag) {
                (window as any).gtag(
                  "event",
                  page === "home"
                    ? "testimonials_seen"
                    : `${page}_reviews_seen`,
                  {
                    event_category:
                      page === "home"
                        ? "testimonials"
                        : `${page}_customer_reviews`,
                    event_label: name,
                    value: id,
                  }
                );
              }
            }
          }
        });
      },
      {
        threshold: 1, // 100% visible
      }
    );

    Object.entries(reviewRefs.current).forEach(([id, el]) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [reviewsReformat]);

  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 py-12", className)}>
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold">{t("Customer Reviews")}</h2>
        <div className="flex items-center justify-center gap-2">
          <div className="h-px w-24 bg-main-500" />
          <div className="h-2 w-2 rounded-full bg-main-500" />
          <div className="h-px w-24 bg-main-500" />
        </div>
      </div>
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
            direction: "rtl",
            slidesToScroll: 1,
            dragFree: true,
          }}
          plugins={[
            Autoplay({
              delay: 2700,
            }),
          ]}
          className="z-10 w-full"
          dir="rtl"
        >
          <CarouselContent>
            {isLoading
              ? // Skeleton loading UI
              Array.from({ length: 3 }).map((_, index) => (
                <CarouselItem
                  key={`skeleton-${index}`}
                  className="z-10 my-5 md:basis-1/2 md:pl-4 lg:basis-1/3"
                >
                  <div
                    className="bg-white relative flex h-full w-full flex-col justify-between rounded-md p-[1.4rem] shadow-lg"
                    dir="auto"
                  >
                    <div
                      className="text-store-text-secondary relative break-words"
                      id="item-text"
                    >
                      <Skeleton className="mb-2 mt-2.5 h-16 w-full" />
                    </div>

                    <div className="-mx-2 mt-6 flex items-center">
                      <Skeleton className="mx-2 h-10 w-10 rounded-full" />

                      <div className="mx-2 w-full">
                        <Skeleton className="mb-2 h-5 w-24" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                    <QuoteIcon className="absolute end-4 top-4 -scale-x-100 -scale-y-100 text-3xl text-main-600 opacity-10" />
                  </div>
                </CarouselItem>
              ))
              : // Actual content
              reviewsReformat?.map(
                (review: generalType) =>
                  review?.description !== null && (
                    <CarouselItem
                      key={review.id}
                      className="z-10 my-5 md:basis-1/2 md:pl-4 lg:basis-1/3"
                    >
                      <div
                        ref={(el) => {
                          reviewRefs.current[review.id] = el;
                        }}
                        data-review-id={review.id}
                        data-reviewer-name={review.name}
                        className="bg-white relative flex h-full w-full flex-col justify-between rounded-md p-[1.4rem] shadow-lg"
                        dir="auto"
                      >
                        <div
                          className="text-store-text-secondary relative break-words"
                          id="item-text"
                        >
                          <p
                            className="mb-2 mt-2.5 text-sm line-clamp-3 leading-6 text-main-600 md:mt-4"
                            dangerouslySetInnerHTML={makeSafeHtml(
                              review?.description
                            )}
                          />
                        </div>

                        <div className="-mx-2 mt-6 flex items-center">
                          <Avatar
                            showFallback
                            src={review?.image ?? ""}
                            name={review?.name ?? "User"}
                            className="mx-2 h-10 w-10 rounded-full"
                          />
                          <div className="mx-2">
                            <p className="mb-2 text-base text-main-600">
                              {review?.name}
                            </p>
                            <Rate
                              readOnly
                              defaultValue={Number(review?.rate)}
                            />
                          </div>
                        </div>
                        <QuoteIcon className="absolute end-4 top-4 -scale-x-100 -scale-y-100 text-3xl text-main-600 opacity-10" />
                      </div>
                    </CarouselItem>
                  )
              )}
          </CarouselContent>
          <div className="max-lg:hidden">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </div>
  );
}
