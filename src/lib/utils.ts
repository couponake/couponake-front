import MyAxios from "@/components/MyAxios";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { signOut } from "next-auth/react";
import Cookies from "js-cookie";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const logout = async () => {
  Cookies.remove('access_token')
  await signOut();
  await MyAxios.post("logout", {
    logout: true
  })
}

export const useCoupon = async (coupon_id: number) => {
  await MyAxios.post("home/coupons-used", { coupon_id });

}