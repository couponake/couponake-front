import React, { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import Brands from "@/components/Pages/Brands";
import api from "@/lib/api";
import StoresSkeleton from "@/components/loadingUis/StoresSkeleton";


export default async function BrandsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale;
  const brands: any = await api.static("brands");
  const t = await getTranslations({ locale });
  return (
    <section className="bg-white -mt-9 sm:-mt-5">
      <div className="bg-gradient-to-tr from-blue-200  via-main-600 to-blue-300 pt-5 sm:pt-12">
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h2 className="mb-4 text-4xl font-bold sm:text-6xl sm:leading-[4rem]">
                {t("common.brands")}
              </h2>
              {/* <p className="max-w-96 text-sm font-normal sm:text-xl">
                يوفر متجرنا أكثر من 29 ماركة ومحل عالمي ومحلي.
              </p> */}
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-8">
        <Suspense fallback={<StoresSkeleton />}>
          <Brands {...brands} />
        </Suspense>
      </div>
    </section>
  );
}
