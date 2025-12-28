/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import { CategoryItem, paginationProps } from "@/types";
import { useTranslations } from "next-intl";
import debounce from "@/lib/debounce";
import { Input } from "@/components/ui/input";
import { SearchIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "@/components/ui/custom-toast";
import { useSearchParams } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { Pagination } from "@heroui/pagination";
import { Button } from "@heroui/button";
import MyAxios from "@/lib/MyAxios";

const Categories = ({
  categories,
  filters,
  pagination,
}: {
  categories: CategoryItem[];
  filters: {
    search?: string;
  };
  pagination: paginationProps;
}) => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const [searchQuery, setSearchQuery] = useQueryState("search", parseAsString);
  const [isSearching, setIsSearching] = useState(false);
  const [allCategories, setCategories] = useState(categories);
  const [isLoading, setLoading] = useState(false);
  const [paginate, setPagination] = useState<paginationProps>(pagination);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (value: string) => {
      if (value.trim() === "") {
        await fetchCategories(paginate?.current_page, "");
      } else {
        await fetchCategories(paginate?.current_page, value);
      }
      setIsSearching(false);
    }, 500),
    []
  );
  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    setIsSearching(true);
    debouncedSearch(value);
  };

  // Clear search
  const handleClearSearch = async () => {
    setSearchQuery("");
    setIsSearching(false);
    fetchCategories(paginate?.current_page, "");
  };

  const fetchCategories = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await MyAxios.get("categories", {
        params: {
          page,
          search,
          category: selectedCategory,
        },
      });
      const { categories: data, pagination } = response.data;
      setCategories(data);
      setPagination(pagination);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      toast.error("Failed to fetch categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    fetchCategories(page, searchQuery ?? "");
  };

  useEffect(() => {
    fetchCategories(paginate?.current_page, searchQuery ?? "");
  }, [selectedCategory]);
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-8">
        <div className="max-w-xl mx-auto">
          <Input
            placeholder={t("search_here")}
            value={searchQuery ?? ""}
            autoFocus={!!searchQuery}
            isLoading={isSearching}
            startContent={<SearchIcon className="text-gray-400 size-5" />}
            endContent={
              <Button
                onPress={handleClearSearch}
                variant="light"
                size="sm"
                isIconOnly
                className={`rounded-full ${searchQuery ? "visible" : "invisible"}`}
              >
                <XIcon className="size-4" />
              </Button>
            }
            onChange={handleSearchChange}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {allCategories?.map((category) => (
            <Link
              prefetch={false}
              target="_self"
              href={`/coupon-category/${category.slug}`}
              key={category.id}
              className="group block"
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag("event", "categories_click", {
                    category_name: category.name,
                    category_id: category.id,
                  });
                }
              }}
            >
              <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                <div className="relative aspect-[16/9]">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-3">
                  <h2 className="text-base font-medium mb-1.5 line-clamp-1 group-hover:text-main-500 transition-colors">
                    {category.name}
                  </h2>
                  {/* <div className="flex items-center text-xs text-gray-500">
                    <span className="inline-block bg-main-50/50 text-main-600 px-2 py-0.5 rounded-full">
                      {t("Coupons")} +{category?.coupons_count}
                    </span>
                  </div> */}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-12 flex items-center justify-center" dir="ltr">
        <Pagination
          isDisabled={isLoading}
          page={paginate?.current_page}
          total={paginate?.last_page}
          onChange={handlePageChange}
          color="primary"
          className="shadow-sm"
        />
      </div>
    </div>
  );
};

export default Categories;
