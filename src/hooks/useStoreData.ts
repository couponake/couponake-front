import { useQuery } from "@tanstack/react-query";
import {
  StoreProps,
  CouponProps,
  BrandProps,
  BannerItem,
  FaqItem,
  InfoItem,
  userReviewType,
} from "@/types";
import api from "@/lib/api";

export interface StoreResponse {
  store: StoreProps;
  expiredCoupons: CouponProps[] | [];
  store_brands: BrandProps[];
  similarStores: StoreProps[];
  // store_reviews: userReview[];
  store_table:
  | { id: number; code: string; title: string; description: string }[]
  | [];
  store_reviews: userReviewType[];
  store_banner: BannerItem[] | null;
  related_coupons: CouponProps[] | [];
  store_faqs: FaqItem[];
  // similar_coupons_table: CouponProps[] | [];
  store_infos: InfoItem[];
  side_table: {
    current_date: string;
    latest_coupon: CouponProps | null;
  } | null;
  popular_category: { count: number; category: any };
  max_coupon_discount: string;
  max_coupon_used: string;
  returned_visitors: string;
  store_seo: {
    title: string;
    description: string;
    image: string;
    "twitter:title": string;
    "twitter:description": string;
    "twitter:image": string;
    "og:title": string;
    "og:description": string;
    "og:image": string;
  };
}

export const useStoreData = (slug: string) => {
  // const { user } = useStore((store) => store);

  return useQuery<StoreResponse>({
    // queryKey: ["store", slug, user?.token],
    queryKey: ["store", slug],
    queryFn: async () => {
      // const endpoint = user?.token ? `stores/${slug}` : `stores/store/${slug}`;
      const endpoint = `stores/store/${slug}`;
      const data = await api.request.get<StoreResponse>(endpoint);
      return data;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};
