"use client";
import { HeaderCategory } from "@/types";
import { LayoutGrid } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React, { Suspense, useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import MyAxios from "../MyAxios";

const CategoriesDropDown = () => {
  const t = useTranslations();
  const [categories, setCategories] = useState<HeaderCategory[] | null>(null);
  const [isLoading, setLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await MyAxios.get("home/categories-data", {
        params: {
          per_page: 70,
        },
      });

      const sorted = response.data.data.sort(
        (a: HeaderCategory, b: HeaderCategory) => a.id - b.id
      );
      setCategories(sorted);
    } catch (error) {
      toast.error("Failed to fetch categories data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="group relative ml-2 mr-[18px] hidden min-w-fit items-center md:flex">
      <LayoutGrid className="h-5 w-5 text-gray-600 ltr:pr-1 rtl:pl-1" />
      <Link
        href="/categories"
        className="hidden text-base font-medium text-neutral-800 hover:text-main-600 lg:flex"
      >
        {t("common.categories")}
      </Link>
      <Suspense>
        <div className="left absolute top-0 z-50 hidden w-[42rem] translate-y-0 transform opacity-0 transition-all duration-500 ease-in-out group-hover:block group-hover:translate-y-5 group-hover:transform group-hover:opacity-100 ltr:-left-2 rtl:-left-90">
          <div
            className="relative top-8 ltr:right-25 rtl:right-45 w-full rounded-xl bg-white p-6"
            style={{
              boxShadow:
                "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
            }}
          >
            <div className="absolute ltr:md:left-25 ltr:lg:left-35 rtl:md:right-25 rtl:lg:right-20 top-0 -z-[1] h-10 w-10 translate-x-0 rotate-45 transform rounded-sm bg-main-500 transition-transform duration-500 ease-in-out"></div>
            <ul className="relative z-10 grid grid-cols-3 gap-4 max-h-[73vh] scrollbar overflow-y-auto overflow-x-hidden">
              {categories?.map((category) => (
                <li className="mt-4" key={category.id}>
                  <Link
                    href={`/coupon-category/${category.slug}`}
                    prefetch={false}
                  >
                    <div className="block rounded-lg p-2 font-semibold text-gray-800 transition duration-300 ease-in-out hover:bg-gradient-to-br hover:from-indigo-50 hover:via-main-50 hover:to-main-50 hover:text-main-600">
                      <div className="flex flex-row flex-wrap items-center gap-2.5">
                        <div className="text-neutral-900 text-base font-medium line-clamp-1">
                          {category.name}
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default CategoriesDropDown;
