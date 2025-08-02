"use client";
import React from "react";
import { BannerItem } from "@/types";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { toast } from "@/components/ui/custom-toast";
import { useTranslations } from "next-intl";
import Image from "next/image";

const StoreBanner = ({ banner }: { banner: BannerItem }) => {
  const [, copyToClipboard] = useCopyToClipboard();
  const t = useTranslations();
  return (
    <button
      title={banner?.title}
      onClick={async (e) => {
        e.preventDefault();
        if (banner?.code) {
          toast.success(t("Coupon copied successfully"));
          await copyToClipboard(banner?.code);

          setTimeout(() => {
            const link = document.createElement("a");
            link.href = banner?.url;
            link.target = "_blank";
            link.rel = "nofollow";
            link.click();
          }, 500);
        }
      }}
    >
      {banner.image ? (
        <Image
          className={
            "scale-90 rounded-2xl max-h-64 object-cover w-full object-center p-1 transition-all duration-300 ease-in-out"
          }
          height={256}
          width={600}
          alt={banner?.title ?? ""}
          src={banner?.image}
          unoptimized
        />
      ) : banner.video ? (
        <video
          src={banner.video}
          autoPlay
          className="rounded-2xl max-h-64 object-cover w-full object-center"
        />
      ) : (
        <div className="w-full md:text-3xl h-48 bg-gradient-to-r bg-clip-text text-transparent from-main-200 via-main-600 to-purple-300 flex items-center justify-center text-white text-xl font-bold">
          No Media
        </div>
      )}
    </button>
  );
};

export default StoreBanner;
