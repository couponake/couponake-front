"use client";
import '../../../styles/hideScrollebar.css';

import Empty from '@/components/Empty';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { CategoryItem, featuredStores, FeaturedStoresCategoryItem } from '@/types';
import { Chip } from '@heroui/chip';
import { Spinner } from '@heroui/spinner';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCat, setSelectedCat] = useState<number>(0);

  const storesCategoriesList: FeaturedStoresCategoryItem[] = useMemo(() => {
    return [
      { ...allOption, stores },
      ...(Array.isArray(categories) ? categories : []),
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

  if (!stores || stores.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="w-full h-fit bg-[#fafafa] flex flex-col items-center gap-5 shadow-lg p-5 relative my-12 md:my-24 container">
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
      <div className="w-full min-h-125 bg-[#fafafa] flex flex-col items-center gap-5 shadow-lg p-5 relative my-12 md:my-24 container">
        <div className="w-full h-fit overflow-hidden flex flex-wrap items-center justify-between gap-8 bg-green-250/0">
          <h2 className="text-lg font-semibold text-neutral-900 sm:text-xl md:text-2xl">
            {t("Best Stores")}
          </h2>
          <ScrollContainer className="w-[330px] sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[750px] h-7 flex flex-row gap-3 justify-start items-center overflow-x-auto whitespace-nowrap cursor-grab select-none scrollbar-visible">
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
        </div>
        <div className="w-full h-fit flex flex-wrap items-center justify-center sm:justify-start md:justify-start lg:justify-start xl:justify-start gap-5 bg-green-250/0 p-0">
          {filteredStores?.length > 0 ? (
            filteredStores?.map((store) => (
              <Link
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
                <Card className="w-32 h-fit p-1 rounded-b-3xl bg-[#F0F0F0]/75 hover:bg-main-500 text-black hover:text-white shadow-none rounded-t-full overflow-hidden border-none flex flex-col items-center justify-start duro">
                  <CardContent className="p-0 rounded-full bg-white shadow-lg">
                    <div className="w-30 aspect-square">
                      <Image
                        src={store?.image || "noPreview.webp"}
                        alt={store?.slug || "Store Image"}
                        width={120}
                        height={120}
                        loading="lazy"
                        className="size-full object-contain rounded-full"
                        unoptimized
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="w-full h-fit p-0 py-1 flex justify-center">
                    <p className="text-xs font-medium text-center sm:text-sm w-fit">
                      {store?.coupons_count} {t("Coupons")}
                    </p>
                  </CardFooter>
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
