"use client";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import React from "react";
import { IoLogoAndroid } from "react-icons/io";

const AppDownloadBanner = () => {
    const t = useTranslations();
  return (
    <div className="w-full mx-auto h-[62px] md:h-[71px] overflow-hidden">
      <div className="relative overflow-hidden rounded-none bg-gradient-to-r from-main-50 to-purple-50 py-2 px-4 md:px-8 flex flex-row items-center justify-between gap-2 border border-main-100/50 shadow-sm">
        {/* Left Side: Mockup Image */}
        <div className="flex flex-row gap-2 md:gap-4 w-fit md:w-auto">
          {/* Android Button */}
          <Link
            target="_blank"
            href="https://play.google.com/store/apps/details?id=com.couponatt"
            className="w-22 md:w-30 flex items-center justify-center gap-1 md:gap-3 py-1 bg-main-600 hover:bg-main-500 text-white rounded-md md:rounded-xl transition-all duration-200 shadow-lg hover:shadow-main-200"
          >
            <span className="text-sm md:text-md font-normal">{t("android")}</span>
            <div className="bg-white/20 p-1 rounded-full">
              <IoLogoAndroid className="w-4 md:w-6 h-4 md:h-6 fill-white" />
            </div>
          </Link>
        </div>

        {/* Right Side: Download Buttons */}
        <div className="block relative shrink-0">
          <div className="flex-1 text-center flex flex-col gap-2">
          <h2 className="text-sm md:text-xl font-bold text-main-500">
            {t("downloadApp")}
          </h2>
          <p className="text-gray-500 text-xs md:text-md font-medium">
            {t("chooseCopy")}
          </p>
        </div>
          {/* Decorative Stars */}
          <div className="absolute -top-2 md:-top-3 -right-4 text-main-300 animate-pulse">
            ✦
          </div>
          <div className="absolute top-1/2 -right-6 md:-left-0 text-main-300 opacity-70">
            ✦
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDownloadBanner;