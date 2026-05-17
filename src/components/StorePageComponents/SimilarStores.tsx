"use client";
import React from "react";
import Link from "next/link";
interface similarStoreProps {
  slug: string;
  store_name: string;
}
function SimilarStores({ store }: { store: similarStoreProps }) {
  return (
    <Link
      prefetch={false}
      target="_self"
      key={store?.slug}
      href={`/store/${store?.slug}`}
      className="group relative block w-full h-fit overflow-hidden rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-300 hover:border-main-500 hover:text-main-600 hover:shadow-md active:scale-95"
    >
      <span className="absolute inset-0 z-0 bg-gradient-to-br from-main-50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <span className="relative z-10 truncate block w-full text-center">
        {store?.slug}
      </span>
    </Link>
  );
}

export default SimilarStores;
