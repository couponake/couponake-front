"use client";
import { featuredStores, FeaturedStoresCategoryItem } from '@/types';
import dynamic from 'next/dynamic';
import React from 'react';

// Rendered on the server: with ssr:false this whole section (min-h-125) appeared
// only after hydration and pushed everything below it down (CLS 0.2 on mobile).
const BestStores = dynamic(() => import("./BestStores"));

function BestStoresWrapperClientSide({
  stores,
}: {
  stores: { data: featuredStores[]; categories: FeaturedStoresCategoryItem[] };
}) {
  return <BestStores stores={stores?.data} categories={stores?.categories} />;
}

export default BestStoresWrapperClientSide;
