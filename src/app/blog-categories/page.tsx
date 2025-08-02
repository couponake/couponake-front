import React from "react";
import { getTranslations } from "next-intl/server";
import api from "@/lib/api";
import Image from "next/image";
import { CategoryItem } from "@/types";
export const experimental_ppr = true;

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale;
  const categories: any = await api.static("home/blog-categories");
  const t = await getTranslations({ locale });

  return (
    <section className="bg-white -mt-9 sm:-mt-7">
      <div className="bg-gradient-to-tr from-blue-200  via-main-600 to-blue-300 pt-5 sm:pt-12">
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h2 className="mb-4 text-4xl font-bold sm:text-6xl sm:leading-[4rem]">
                {t("common.categories")}
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {categories?.data?.map((category: CategoryItem) => (
              <div key={category.id} className="group block">
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
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="inline-block bg-main-50/50 text-main-600 px-2 py-0.5 rounded-full">
                        {t("Coupons")} +{category?.stores?.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
