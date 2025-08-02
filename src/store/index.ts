import { CouponProps, HeaderCategory, profileTabsValues, User } from "@/types";
import { create } from "zustand";

interface StoreProps {
  selectedCoupon: CouponProps | null;
  setSelectedCoupon: (coupon: CouponProps | null) => void;
  categories: HeaderCategory[] | null;
  setCategories: (coupon: HeaderCategory[] | null) => void;
  user: User | null;
  setUser: (user: User) => void;
}

export const useStore = create<StoreProps>((set) => ({
  selectedCoupon: null,
  categories: null,
  user: null,
  setSelectedCoupon: (coupon) =>
    set(() => ({
      selectedCoupon: coupon,
    })),

  setUser: (user) =>
    set(() => ({
      user,
    })),

  setCategories: (categories) =>
    set(() => ({
      categories,
    })),
}));
