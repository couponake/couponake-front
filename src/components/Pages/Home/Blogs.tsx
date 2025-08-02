"use client";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTranslations } from "next-intl";
import { Blog } from "@/types";
import moment from "moment";
import { toast } from "@/components/ui/custom-toast";
import { Spinner } from "@heroui/spinner";
import { Pagination } from "@heroui/pagination";
import Link from "next/link";
import axiosInstance from '@/lib/axios';
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { secureHtmlLinks } from "@/lib/htmlUtils";

// API function to fetch blogs
const fetchBlogs = async (page = 1) => {
const data = await api.request.get("blogs", {
    params: { page },
  });
  return data;
};

const Blogs = () => {
  const t = useTranslations();

  // Use React Query to fetch blogs
  const {
    data: blogsData,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: () => fetchBlogs(),
    initialData: { blogs: [], pagination: { current_page: 1, last_page: 0 } },
  });

  // Handle pagination
  const handlePageChange = async (page: number) => {
    try {
      await fetchBlogs(page);
      refetch();
    } catch (error) {
      toast.error("Failed to fetch blogs. Please try again.");
    }
  };

  if (isLoading || isFetching) {
    return (
      <section className="container pb-16">
        <div className="">
          <Carousel
            opts={{
              align: "start",
            }}
            className="Carousel max-w-full"
          >
            <div className="flex flex-wrap items-center justify-between gap-5">
              <h2 className="text-lg my-5 font-semibold text-neutral-900 sm:text-xl md:text-2xl">
                {t("Read also")}
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
          <div className="mt-5 flex items-center justify-center" dir="ltr">
            <Pagination
              isDisabled={true}
              isCompact
              page={1}
              total={1}
              color="primary"
              onChange={() => {}}
            />
          </div>
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
    <section className="container pb-16">
      <div className="">
        <Carousel
          opts={{
            align: "start",
          }}
          className="Carousel max-w-full"
        >
          <div className="flex flex-wrap items-center justify-between gap-5">
            <h2 className="text-lg my-5 font-semibold text-neutral-900 sm:text-xl md:text-2xl">
              {t("Read also")}
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
            {blogsData?.blogs?.data?.map((info: Blog) => (
              <CarouselItem
                key={info?.id}
                className="py-2 2xl:basis-[57%] h-fit"
              >
                <Link 
                target="_self"
                 href={`/${info.id}`} dir="auto">
                  <div className="block bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-2 text-gray-800">
                        {info.title}
                      </h3>
                      <div
                        className="text-gray-600 mb-4 line-clamp-3"
                        dangerouslySetInnerHTML={{
                          __html: secureHtmlLinks(info.content) as string,
                        }}
                      />

                      <div className="flex items-center gap-3">
                        <div className="text-sm text-gray-500">
                          {moment(info?.created_at).format("DD MM YY")}
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
        <div className="mt-5 flex items-center justify-center" dir="ltr">
          <Pagination
            isDisabled={isLoading}
            isCompact
            page={blogsData?.pagination?.current_page || 1}
            total={blogsData?.pagination?.last_page || 0}
            color="primary"
            onChange={handlePageChange}
          />
        </div>
      </div>
    </section>
  );
};

export default Blogs;
