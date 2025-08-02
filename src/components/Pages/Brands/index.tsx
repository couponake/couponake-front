"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { LayoutGrid, StarIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { paginationProps, StoreProps } from "@/types";
import debounce from "@/lib/debounce";
import { useStore } from "@/store";
import Link from "next/link";
import { toast } from "@/components/ui/custom-toast";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Pagination } from "@heroui/pagination";
import MyAxios from "@/components/MyAxios";
import { Avatar } from "@heroui/avatar";

const Brands = ({
  brands,
  filters,
  pagination,
}: {
  brands: StoreProps[] | null;
  filters: {
    search: string;
  };
  pagination: paginationProps;
}) => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const categories = useStore((store) => store.categories);
  const [searchQuery, setSearchQuery] = useState(
    filters?.search ? filters?.search.replace(/%/g, "") : ""
  );
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [allBrands, setBrands] = useState<StoreProps[] | null>(brands);
  const [paginate, setPagination] = useState<paginationProps>(pagination);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (value: string) => {
      if (value.trim() === "") {
        await fetchBrands(paginate?.current_page, "");
      } else {
        await fetchBrands(paginate?.current_page, value);
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
    fetchBrands(paginate?.current_page, "");
  };

  const fetchBrands = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await MyAxios.get("brands", {
        params: {
          page,
          search,
          category: selectedCategory,
        },
      });
      const { brands: data, pagination } = response.data;
      setBrands(data);
      setPagination(pagination);
    } catch (error) {
      toast.error("Failed to fetch brands. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    fetchBrands(page, searchQuery);
  };

  useEffect(() => {
    fetchBrands(paginate?.current_page, searchQuery ?? "");
  }, [selectedCategory]);
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <div className="hidden md:block">
        <div
          id="dropdown"
          className="mt-5 h-fit !w-full select-none rounded-lg border border-neutral-200 bg-white pt-3 sm:w-[260px]"
        >
          <ul className="select-none space-y-2 text-sm transition delay-150 duration-300 ease-in-out max-h-dvh overflow-y-auto scrollbar">
            <li>
              <Link 
              target="_self"
                href="/stores"
                className={cn(
                  "rounded-s-0 mb-2 ms-2 flex h-12 items-center rounded-e-xl border-s-4 border-main-600/0 py-3.5 text-neutral-900 hover:border-s-4 hover:border-main-600 hover:bg-neutral-50 hover:text-main-600 ltr:pl-3 rtl:pr-3",
                  !selectedCategory && "text-main-600 border-main-600"
                )}
              >
                <LayoutGrid className="h-8 w-8" />
                <div className="text-base font-medium ltr:ml-3 rtl:mr-3">
                  {t("All Categories")}
                </div>
              </Link>
            </li>
            {categories?.map((category) => (
              <li key={category?.id}>
                <Link 
                target="_self"
                  href={`?category=${category?.id}`}
                  className={cn(
                    "rounded-s-0 mb-2 ml-2 flex h-12 items-center rounded-e-xl border-s-4 border-main-600/0 py-3.5 text-neutral-900 hover:border-s-4 hover:border-main-600 hover:bg-neutral-50 hover:text-main-600 ltr:pl-3 rtl:pr-3",
                    Number(selectedCategory) === Number(category?.id) &&
                    "text-main-600 border-main-600"
                  )}
                >
                  <Avatar
                    src={category?.image}
                    name={category?.name}
                    showFallback
                  />
                  <div className="text-base font-medium ms-2.5 line-clamp-1">
                    {category?.name}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6 md:col-span-3">
        {/* <span className="text-neutral-900n pb-4 text-lg font-bold">
                            29 متجر و علامة تجارية
                        </span> */}
        <div className="mb-14 flex items-center justify-between gap-4">
          <div className="flex-1 md:w-96">
            <Input
              placeholder={t("search_here")}
              value={searchQuery ?? ""}
              classNames={{
                wrapper: "border-[1px] border-gray-200",
              }}
              isLoading={isLoading}
              endContent={
                <>
                  <Button
                    onPress={handleClearSearch}
                    variant="flat"
                    isIconOnly
                    className={` ${searchQuery ? "visible" : "invisible"}`}
                  >
                    <XIcon className="size-3" />
                  </Button>
                  {isSearching && <Spinner />}
                </>
              }
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {allBrands?.map((brand) => (
              <Link 
              target="_self"
                href={`brands/${brand?.id}`}
                key={brand?.id}
                className="cardWidth mb-3 flex -translate-y-8 transform cursor-pointer items-center justify-between gap-2 rounded-3xl border border-neutral-100 bg-white p-4 sm:mb-6 sm:p-5"
              >
                <div className="flex flex-1 items-start gap-1 sm:gap-3">
                  <Avatar
                    src={brand?.image}
                    alt={brand?.title}
                    name={brand?.title}
                    showFallback
                    className="h-16 w-16 border border-neutral-100 sm:h-[72px] sm:w-[72px]"
                  />
                  <div className="flex-1">
                    <div
                      className="font-head mb-2 line-clamp-1 text-base font-bold text-neutral-900"
                      title={brand?.title}
                    >
                      {brand?.title}
                    </div>
                    <div className="flex items-center">
                      <p className="text-neutral-650 line-clamp-3 text-sm font-normal">
                        {brand?.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Button
                    color="primary"
                    variant="bordered"
                    startContent={<StarIcon className="size-4" />}
                  >
                    {t("Follow")}
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>


        <div
          className="col-span-3 mt-16 flex items-center justify-center"
          dir="ltr"
        >
          <Pagination
            isDisabled={isLoading}
            page={paginate?.current_page}

            total={paginate?.last_page}
            onChange={handlePageChange}
            color="primary"
            dir="ltr"
          />
        </div>

      </div>
    </div>
  );
};

export default Brands;
