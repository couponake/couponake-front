"use client";
import Image from "next/image";
import { CopyIcon } from "lucide-react";
import { Product } from "@/types";
import { toast } from "@/components/ui/custom-toast";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useTranslations } from "next-intl";

export default function ProductCard({ product }: { product: Product }) {
  const [, copyToClipboard] = useCopyToClipboard();
  const t = useTranslations();
  return (
    <div
      className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full"
      dir="auto"
    >
      {/* Product Cover with Gradient Overlay */}
      <div className="relative h-[250px] w-full overflow-hidden">
        <div className="block h-full">
          <Image
            src={product?.image || "/placeholder.svg"}
            alt={product?.title}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      {/* Product Details with Better Typography */}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-main-900 transition-colors duration-300">
            {product?.title}
          </h3>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-main-900">{product?.price}</p>
          <button
            className="p-3 rounded-full bg-main-50 text-main-900 hover:bg-main-100 transition-all duration-300 group/btn"
            aria-label={product?.title}
            onClick={async (e) => {
              e.preventDefault();
              if (product?.code) {
                toast.success(t("Coupon copied successfully"));
                await copyToClipboard(product?.code);

                if (typeof window !== "undefined") {
                  setTimeout(() => {
                    const link = document.createElement("a");
                    link.href = product?.url;
                    link.target = "_blank";
                    link.rel = "nofollow";
                    link.click();
                  }, 2000);
                }
              }
            }}
          >
            <CopyIcon className="size-5 group-hover/btn:scale-110 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
