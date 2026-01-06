"use client";
import '../../../styles/hideScrollebar.css';

import Empty from '@/components/Empty';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryItem, featuredStores, FeaturedStoresCategoryItem } from '@/types';
import { Chip } from '@heroui/chip';
import { Spinner } from '@heroui/spinner';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import React, { Fragment, useEffect, useMemo, useState, useRef } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
// Added Chevron icons for the buttons
import { ChevronLeft, ChevronRight } from 'lucide-react';

const allOption: CategoryItem = {
  id: 0,
  name: "All",
  image: "",
  slug: "all",
  parent_id: 0,
  created_at: "",
  updated_at: "string",
  category_seo: null,
};

const BestStores = ({
  stores,
  categories,
}: {
  stores: featuredStores[];
  categories: FeaturedStoresCategoryItem[];
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCat, setSelectedCat] = useState<number>(0);

  // 1. Create a ref for the scroll container
  const scrollRef = useRef<HTMLElement>(null);

  const storesCategoriesList: FeaturedStoresCategoryItem[] = useMemo(() => {
    return [
      { ...allOption, stores },
      ...(Array.isArray(categories)
        ? categories.filter(category => category.stores?.length > 0)
        : []),
    ];
  }, [stores, categories]);

  const filteredStores = useMemo(() => {
    if (selectedCat === 0) return stores;
    const selected = storesCategoriesList.find((cat) => cat.id === selectedCat);
    return selected?.stores || [];
  }, [selectedCat, stores, storesCategoriesList]);

  useEffect(() => {
    if (stores?.length > 0 && categories?.length > 0) {
      setIsLoading(false);
    }
  }, [stores, categories]);

  // 2. Scroll function to move by ~3 items (approx 300px depending on chip width)
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!stores || stores.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="w-full h-fit bg-[#fafafa] flex flex-col items-center gap-5 shadow-lg p-5 relative my-10 md:my-16 container">
        <Spinner />
      </div>
    );
  }

  const filterStores = (category: FeaturedStoresCategoryItem) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag("event", "featured_category_click", {
        category_id: category?.id,
        category_title: category?.name,
      });
    }
    setSelectedCat(category.id);
  };

  return (
    <Fragment>
      <div className="w-full min-h-125 bg-[#fafafa] flex flex-col items-center gap-5 shadow-lg p-3 md:p-5 relative my-10 md:my-16 container">
        <div className="w-full h-fit overflow-hidden flex flex-wrap items-center justify-between gap-8 bg-green-250/0">
          <h2 className="text-lg font-semibold text-neutral-900 sm:text-xl md:text-2xl">
            {t("Best Stores")}
          </h2>

          {/* 3. Wrapper for buttons and container */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => scroll('left')}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} className={locale === 'ar' ? 'rotate-180' : 'rotate-0'} />
            </button>

            <ScrollContainer
              innerRef={scrollRef} // Attach ref here
              className="w-[280px] sm:w-[350px] md:w-[450px] lg:w-[550px] xl:w-[700px] h-7 flex flex-row gap-3 justify-start items-center overflow-x-auto whitespace-nowrap cursor-grab select-none scrollbar-visible"
            >
              {storesCategoriesList &&
                storesCategoriesList?.length > 0 &&
                storesCategoriesList.map((category) => (
                  <Chip
                    as={"button"}
                    role="button"
                    aria-label={`Filter by ${category?.name}`}
                    key={`category-${category.id}`}
                    className={
                      "text-sm " +
                      (selectedCat === category?.id
                        ? " bg-main-500 text-white"
                        : " bg-gray-200 text-gray-800")
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => filterStores(category)}
                  >
                    {category?.id > 0 ? category?.name : t("All")}
                  </Chip>
                ))}
            </ScrollContainer>

            <button
              onClick={() => scroll('right')}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} className={locale === 'ar' ? 'rotate-180' : 'rotate-0'} />
            </button>
          </div>
        </div>

        <div className="w-full h-fit flex flex-wrap items-center justify-center sm:justify-start md:justify-start lg:justify-start xl:justify-start gap-3 md:gap-5 bg-transparent p-0">
          {filteredStores?.length > 0 ? (
            filteredStores?.map((store) => (
              <Link
                prefetch={false}
                target="_self"
                key={store?.id}
                href={`/store/${store?.slug}`}
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag("event", "featured_store_click", {
                      store_id: store?.id,
                      store_name: store?.slug,
                    });
                  }
                }}
              >
                <Card className="w-26 md:w-32 h-fit p-1 rounded-b-3xl bg-[#F0F0F0]/75 hover:bg-main-500 text-black hover:text-white shadow-none rounded-t-full overflow-hidden border-none flex flex-col items-center justify-start duro">
                  <CardContent className="p-0 rounded-full bg-white shadow-lg">
                    <div className="w-24 md:w-30 aspect-square">
                      <Image
                        src={store?.image ? encodeURI(store.image) : "noPreview.webp"}
                        alt={store?.slug || "Store Image"}
                        width={120}
                        height={120}
                        loading="lazy"
                        className="size-full object-contain rounded-full"
                        unoptimized
                      />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <Empty description={t("No Stores")} />
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default BestStores;