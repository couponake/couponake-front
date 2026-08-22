import SimilarStores from "@/components/StorePageComponents/SimilarStores";
import { getCuratedStores } from "@/services/getCuratedStores";
import { CuratedStore } from "@/types";
import { getTranslations } from "next-intl/server";
import React from "react";

async function CuratedStoreWidget() {
  const data = await getCuratedStores();
  const t = await getTranslations();

  if (data?.length === 0) {
    return null;
  }
  
  return (
    <aside className="w-full md:w-70 lg:w-80 xl:w-80 2xl:w-100">
      <div className="border-none">
        <p className="font-semibold text-gray-700 text-lg mt-3 mb-5">
          {t("popularStores")}
        </p>
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-2 items-start justify-start gap-1.5 overflow-hidden">
          {data?.map((store: CuratedStore) => (
            <SimilarStores key={store?.slug} store={store} />
          ))}
        </div>
      </div>
    </aside>
  );
}

export default CuratedStoreWidget;