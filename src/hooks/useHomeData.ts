/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import api from "@/lib/api";
import { testimonialType } from "@/types";
import { useQuery } from "@tanstack/react-query";

const queryConfig = {
  staleTime: 1000 * 60 * 5, // 5 minutes cache
  gcTime: 1000 * 60 * 10, // 10 minutes garbage collection
  refetchOnWindowFocus: false,
};

export const useHomeData = () => {
  const {
    data: testimonials = [],
    isLoading: isTestimonialsLoading,
    status: testimonialsStatus,
  } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const response: {
        status: string;
        data: testimonialType[];
        message: string;
      } = await api.dynamic("home/testimonials");
      return response?.data || [];
    },
    ...queryConfig,
  });

  const {
    data: ads = [],
    isLoading: isAdsLoading,
    status: adsStatus,
  } = useQuery({
    queryKey: ["ads"],
    queryFn: async () => {
      const response: any = await api.dynamic("home/ads");
      return response?.data || [];
    },
    ...queryConfig,
  });
  const {
    data: products = [],
    isLoading: isProductsLoading,
    status: productsStatus,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response: any = await api.dynamic("home/products");
      return response?.data || [];
    },
    ...queryConfig,
  });
  const {
    data: texts = [],
    isLoading: isTextsLoading,
    status: textsStatus,
  } = useQuery({
    queryKey: ["texts"],
    queryFn: async () => {
      const response: any = await api.dynamic("home/texts");
      return response?.data || [];
    },
    ...queryConfig,
  });

  return {
    testimonials,
    ads,
    products,
    texts,
    isLoading:
      isTestimonialsLoading ||
      isAdsLoading ||
      isProductsLoading ||
      isTextsLoading,
  };
};
