"use client";
import { featuredStores, FeaturedStoresCategoryItem } from '@/types';
import dynamic from 'next/dynamic';
import React from 'react';

const BestStores = dynamic(() => import("./BestStores"), { ssr: false });

function BestStoresWrapperClientSide({
  stores,
}: {
  stores: { data: featuredStores[]; categories: FeaturedStoresCategoryItem[] };
}) {
  return <BestStores stores={stores?.data} categories={stores?.categories} />;
}

export default BestStoresWrapperClientSide;
