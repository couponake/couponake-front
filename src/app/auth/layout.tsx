import { cookies } from "next/headers";
import React from "react";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "ar";
  const isArabic = locale === "ar";

  return {
    title: isArabic
      ? "تسجيل الدخول/انشاء حساب |الأفضل"
      : "Login / Create Account | Alafdal",
    description: isArabic
      ? "أدخل حسابك أو سجّل لتتابع كوبوناتك وتحفظ المفضلة بسهولة"
      : "Log in or register to track and save your favorite coupons",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}auth/` || "",
    },
    openGraph: {
      title: isArabic
        ? "تسجيل الدخول/انشاء حساب |الأفضل"
        : "Login / Create Account | Alafdal",
      description: isArabic
        ? "أدخل حسابك أو سجّل لتتابع كوبوناتك وتحفظ المفضلة بسهولة"
        : "Log in or register to track and save your favorite coupons",
      images: [
        {
          url: "https://couponalyom.com/AlafdalNewLogo.webp",
          alt: "Alafdal Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isArabic
        ? "تسجيل الدخول/انشاء حساب |الأفضل"
        : "Login / Create Account | Alafdal",
      description: isArabic
        ? "أدخل حسابك أو سجّل لتتابع كوبوناتك وتحفظ المفضلة بسهولة"
        : "Log in or register to track and save your favorite coupons",
      images: [
        {
          url: "https://couponalyom.com/AlafdalNewLogo.webp",
          alt: "Alafdal Logo",
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
