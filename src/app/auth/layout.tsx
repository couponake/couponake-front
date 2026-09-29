import { cookies } from "next/headers";
import React from "react";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "ar";
  const isArabic = locale === "ar";

  return {
    title: isArabic ? "حسابي: احفظ متاجرك المفضلة وتابع أكوادها | كوبوناك" : "My account: save your favourite stores | Couponake",
    description: isArabic ? "سجّل الدخول لتحفظ المتاجر المفضلة وتصلك أكوادها الجديدة أولًا." : "Log in to save favourite stores and get their new codes first.",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}auth/` || "",
    },
    openGraph: {
      title: isArabic ? "حسابي: احفظ متاجرك المفضلة وتابع أكوادها | كوبوناك" : "My account: save your favourite stores | Couponake",
      description: isArabic ? "سجّل الدخول لتحفظ المتاجر المفضلة وتصلك أكوادها الجديدة أولًا." : "Log in to save favourite stores and get their new codes first.",
      images: [
        {
          url: "https://couponake.com/couponak-logo.svg",
          alt: "Couponake Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isArabic ? "حسابي: احفظ متاجرك المفضلة وتابع أكوادها | كوبوناك" : "My account: save your favourite stores | Couponake",
      description: isArabic ? "سجّل الدخول لتحفظ المتاجر المفضلة وتصلك أكوادها الجديدة أولًا." : "Log in to save favourite stores and get their new codes first.",
      images: [
        {
          url: "https://couponake.com/couponak-logo.svg",
          alt: "Couponake Logo",
        },
      ],
    },
  };
}

const AuthPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="relative flex items-center min-h-[70svh] justify-center w-screen max-w-full -mt-4">
      <div className="flex w-full items-center justify-center max-w-md rounded-3xl border-[#D2D2D2] bg-white my-5 py-10 sm:border lg:min-w-[600px] lg:p-10">
        <div className="sm:px-3 w-full">{children}</div>
      </div>
    </section>
  );
};

export default AuthPage;
