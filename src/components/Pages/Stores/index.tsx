"use client";
import AddToFavoriteBtn from '@/components/StorePageComponents/AddToFavoriteBtn';
import Empty from '@/components/Empty';
import { toast } from '@/components/ui/custom-toast';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategoriesData, useStoresData } from '@/hooks/useStoresData';
import { useCountriesData } from '@/hooks/useCountriesData';
import { cn } from '@/lib/utils';
import { HeaderCategory } from '@/types';
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import { Button } from '@heroui/button';
import { Pagination } from '@heroui/pagination';
import { LayoutGrid, XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import StorePageLinks from './PageLinks';
import { emptyStoreFilters, hasStoreFilters, parseStoreFilters, parseStorePage, storeFilterHref, type StoreFilters } from '@/lib/stores-list';
import { useInView } from 'react-intersection-observer';

const Stores = ({ initialPage = 1 }: { initialPage?: number }) => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [activeFilters, setActiveFilters] = useState<StoreFilters>(emptyStoreFilters);
  const [searchInput, setSearchInput] = useState("");
  const filtered = hasStoreFilters(activeFilters);
  const selectedCategory = activeFilters.category || null;
  const selectedCountry = activeFilters.country || null;
  const currentPage = filtered ? activeFilters.page : (parseStorePage(searchParams.get("page") ?? undefined) ?? initialPage);
  const [categoriesPage, setCategoriesPage] = useState(1);
  const { data: countriesList = [], error: countriesError } = useCountriesData();
  const { useStoresQuery } = useStoresData();
  const { data: storesData, isLoading, isFetching, isError, refetch } = useStoresQuery({
    page: currentPage, search: activeFilters.search, category: selectedCategory, country: selectedCountry,
  });
  const allStores = storesData?.stores || [];
  const paginate = storesData?.pagination;
  const isSearching = searchInput.trim() !== activeFilters.search;

  useEffect(() => {
    const sync = () => {
      const next = parseStoreFilters(new URLSearchParams(window.location.hash.slice(1)));
      setActiveFilters(next);
      setSearchInput(next.search);
    };
    sync();
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => { window.removeEventListener("popstate", sync); window.removeEventListener("hashchange", sync); };
  }, [searchParams]);

  const changeFilters = useCallback((next: StoreFilters, replaceHistory = false) => {
    setActiveFilters(next);
    setSearchInput(next.search);
    const url = storeFilterHref(next);
    if (replaceHistory) window.history.replaceState(null, "", url);
    else window.history.pushState(null, "", url);
  }, []);

  useEffect(() => {
    const search = searchInput.trim().slice(0,200);
    if (search === activeFilters.search) return;
    const timer = setTimeout(() => changeFilters({ ...activeFilters, search, page: 1 }, true), 350);
    return () => clearTimeout(timer);
    // The debounced value, not every keystroke, changes the API query.
  }, [searchInput, activeFilters, changeFilters]);

  useEffect(() => {
    if (filtered && paginate && currentPage > paginate.last_page) {
      changeFilters({ ...activeFilters, page: 1 }, true);
    }
  }, [filtered, paginate, currentPage, activeFilters, changeFilters]);

  // Use React Query for categories data
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    isFetching: isFetchingCategories,
  } = useCategoriesData(categoriesPage);

  // Maintain a list of all categories across pages
  const [allCategories, setAllCategories] = useState<HeaderCategory[]>([]);

  // Update allCategories when new data is fetched
  useEffect(() => {
    if (categoriesData?.data) {
      const categoriesDataArray = [...categoriesData.data].sort(
        (a, b) => a.id - b.id
      );
      if (categoriesPage === 1) {
        // Reset categories if it's the first page
        setAllCategories(categoriesDataArray);
      } else {
        // Append new categories to existing ones
        setAllCategories((prev) => {
          // Filter out duplicates based on id
          const newCategoryIds = new Set(
            categoriesDataArray.map((cat) => cat.id)
          );
          const filteredPrev = prev.filter(
            (cat) => !newCategoryIds.has(cat.id)
          );
          return [...filteredPrev, ...(categoriesDataArray || [])];
        });
      }
    }
  }, [categoriesData, categoriesPage]);

  const categories: HeaderCategory[] = allCategories;
  const paginateCategories = categoriesData?.pagination;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => setSearchInput(event.target.value);
  const handleClearSearch = () => changeFilters({ ...activeFilters, search: "", page: 1 });
  const handlePageChange = (page: number) => changeFilters({ ...activeFilters, page });

  // Scroll to top when data changes
  useEffect(() => {
    if (!isFetching && !isLoading) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [storesData, isFetching, isLoading]);

  // Create ref that detects when element is visible for infinite scrolling
  const { ref: categoriesLoadMoreRef, inView: categoriesLoadMoreInView } =
    useInView({
      threshold: 0.1,
      triggerOnce: false,
    });

  // React Query shares the public list and preserves previous data on failure.
  useEffect(() => {
    if (countriesError) toast.error("Failed to fetch countries. Please try again.");
  }, [countriesError]);

  // Effect for loading more categories when scrolling
  useEffect(() => {
    if (
      categoriesLoadMoreInView &&
      paginateCategories &&
      categoriesPage < paginateCategories.last_page &&
      !isLoadingCategories &&
      !isFetchingCategories
    ) {
      setCategoriesPage((prev) => prev + 1);
    }
  }, [
    categoriesLoadMoreInView,
    paginateCategories,
    categoriesPage,
    isLoadingCategories,
    isFetchingCategories,
  ]);

  // if (isLoading) {
  //   return <StoresSkeleton />;
  // }
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <div className="hidden md:block">
        <div
          id="dropdown"
          className="mt-5 h-fit !w-full select-none rounded-lg border border-neutral-200 bg-white sm:w-[260px] relative pt-3"
        >
          <button
            type="button"
            onClick={() => changeFilters(emptyStoreFilters)}
            className={cn(
              "sticky -top-7 w-full text-start rounded-s-0 mb-2 ms-2 flex h-12 items-center rounded-e-xl border-s-4 border-main-600/0 py-3.5 text-neutral-900 hover:border-s-4 hover:border-main-600 hover:bg-neutral-50 hover:text-main-600 ltr:pl-3 rtl:pr-3",
              !selectedCategory && "text-main-600 border-main-600"
            )}
          >
            <LayoutGrid className="h-8 w-8" />
            <h2 className="text-base font-medium ms-2.5">
              {t("All Categories")}
            </h2>
          </button>
          <ul className="select-none space-y-2 text-sm transition delay-150 duration-300 ease-in-out max-h-dvh overflow-y-auto scrollbar">
            {categories?.map((category) => (
              <li key={category?.id}>
                <button
                  type="button"
                  onClick={() => changeFilters({ ...activeFilters, category: String(category.id), page: 1 })}
                  aria-pressed={Number(selectedCategory) === category.id}
                  className={cn(
                    "w-full text-start rounded-s-0 mb-2 ml-2 flex h-12 items-center rounded-e-xl border-s-4 border-main-600/0 py-3.5 text-neutral-900 hover:border-s-4 hover:border-main-600 hover:bg-neutral-50 hover:text-main-600 ltr:pl-3 rtl:pr-3",
                    Number(selectedCategory) === Number(category?.id) &&
                    "text-main-600 border-main-600"
                  )}
                >
                  <div className="text-base font-medium ms-2.5 line-clamp-1">
                    {category?.name}
                  </div>
                </button>
              </li>
            ))}
            {paginateCategories &&
              categoriesPage < paginateCategories.last_page && (
                <li ref={categoriesLoadMoreRef} className="h-4">
                  <div className="text-center text-sm text-gray-500">
                    {isFetchingCategories ? t("Loading more") : ""}
                  </div>
                </li>
              )}
          </ul>
        </div>
      </div>
      <div className="mt-6 md:col-span-3">
        <div className="mb-14 flex items-center gap-4">
          <div className="flex-1 md:w-96">
            <Input
              placeholder={t("Search for stores")}
              value={searchInput}
              classNames={{
                wrapper: "border-[1px] border-gray-200",
              }}
              maxLength={200}
              isLoading={isSearching}
              endContent={
                <>
                  <Button
                    onPress={handleClearSearch}
                    variant="bordered"
                    size="sm"
                    isIconOnly
                    className={` ${searchInput ? "visible" : "invisible"}`}
                  >
                    <XIcon className="size-3" />
                  </Button>
                </>
              }
              onChange={handleSearchChange}
            />
          </div>
          <Autocomplete
            selectedKey={selectedCountry}
            onSelectionChange={(value) => {
              changeFilters({ ...activeFilters, country: value ? String(value) : "", page: 1 });
            }}
            className="max-w-50"
            size="sm"
            label={t("Filter by country")}
          >
            {countriesList.map((country) => (
              <AutocompleteItem key={country}>{country}</AutocompleteItem>
            ))}
          </Autocomplete>
        </div>
        <div className="md:col-span-3">
          <div className="grid gap-4 grid-cols-2">
            {allStores && allStores.length > 0
              ? allStores?.map((store) => (
                <div
                  key={store?.slug}
                  className="relative flex flex-col sm:flex-row items-center justify-between 
                  rounded-2xl border border-neutral-200 bg-white 
                  shadow-sm hover:shadow-md transition-shadow duration-300 
                  p-4 sm:p-5 gap-y-3 sm:gap-y-0 sm:gap-x-4 
                  w-full max-w-md mx-auto"
                >
                  <Link
                    prefetch={false}
                    target="_self"
                    href={`/store/${store?.slug}`}
                    className="flex items-center w-full gap-4 flex-grow max-sm:flex-col max-sm:justify-center"
                  >
                    <div className="relative w-20 h-20 shadow-md bg-white rounded-full shrink-0 overflow-hidden ">
                      <Image
                        src={store?.image || "noPreview.webp"}
                        alt={store?.store_name || "Store Image"}
                        fill
                        loading="lazy"
                        className="object-contain p-2"
                        unoptimized
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h2
                        className="sm:text-base md:text-lg font-semibold text-neutral-900 max-sm:text-center"
                        title={store?.store_name}
                      >
                        {store?.store_name}
                      </h2>
                    </div>
                  </Link>

                  <div className="flex-shrink-0 sm:ml-4">
                    {store?.id && (
                      <AddToFavoriteBtn
                        storeId={store?.id}
                        isFavoriteInitially={
                          store?.in_favourite || store?.isInFavorites
                        }
                      />
                    )}
                  </div>
                </div>
              ))
              : !isLoading && !isError && (
                <div className="col-span-full">
                  <Empty />
                </div>
              )}
          </div>
          {isError && <div role="alert" className="p-4 text-center">
            <p>تعذر تحميل المتاجر. حاول مرة أخرى.</p>
            <button type="button" onClick={() => refetch()} className="mt-2 underline">إعادة المحاولة</button>
          </div>}
          {isLoading && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {Array.from({ length: 6 })?.map((_, index) => (
                <Skeleton
                  key={index}
                  className="cardWidth mb-3 h-35 flex -translate-y-8 transform cursor-pointer items-center justify-between gap-2 rounded-3xl border border-neutral-100 p-4 sm:mb-6 sm:p-5"
                />
              ))}
            </div>
          )}
        </div>
        <div
          className="col-span-3 mt-16 flex items-center justify-center"
          dir="ltr"
        >
          {filtered ? <Pagination
            isDisabled={isLoading}
            page={paginate?.current_page}
            total={paginate?.last_page || 1}
            onChange={handlePageChange}
            color="primary"
            dir="ltr"
          /> : <StorePageLinks page={currentPage} total={paginate?.last_page || 1} />}
        </div>
      </div>
    </div>
  );
};

export default Stores;
