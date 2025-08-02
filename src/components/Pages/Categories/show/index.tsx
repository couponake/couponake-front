import { CategoryItem, StoreProps } from "@/types";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ShowCategory = ({ category }: { category: CategoryItem }) => {
  const t = useTranslations();
  return (
    <div className="-mt-7">
      <div className="bg-gradient-to-tr from-blue-200 via-main-600 to-blue-300">
        <div className="container mx-auto py-5 md:py-7">
          <div className="flex items-center justify-center lg:justify-between flex-wrap gap-7 min-h-50">
            <div className="text-white">
              <h1 className="text-4xl font-bold sm:text-6xl lg:leading-[4rem]">
                {category?.name}
              </h1>
            </div>
            {category?.image && (
              <div className="rounded-xl">
                <Image
                  height={240}
                  width={300}
                  src={category?.image}
                  alt={category?.name}
                  title={category?.name}
                  quality={100}
                  className="max-h-60 object-contain"
                  unoptimized
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <section className="container flex gap-10 pt-5 sm:pt-7 pb-5">
        <div className="flex-1 space-y-5 overflow-x-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {category?.stores &&
              category?.stores?.map((store: StoreProps) => (
                <div
                  key={store?.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <Link
                    target="_self"
                    href={`/store/${store?.slug}`}
                    className="p-6 flex flex-col items-center"
                  >
                    <div className="w-20 aspect-square">
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
                    <h2 className="text-xl font-semibold text-gray-800 text-center">
                      {store?.slug}
                    </h2>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShowCategory;
