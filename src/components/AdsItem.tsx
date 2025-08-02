"use client";
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { toast } from '@/components/ui/custom-toast';
import { AdItem } from '@/types';
import { useCopyToClipboard } from '@uidotdev/usehooks';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function AdsItem({ item }: { item: AdItem }) {
  const [, copyToClipboard] = useCopyToClipboard();
  const t = useTranslations();
  const locale = useLocale();
  const [isHovered, setIsHovered] = React.useState<boolean>(false);

  return (
    <Link
      target="_blank"
      href={item?.url === null ? "" : item?.url}
      rel='nofollow noopener noreferrer'
      onClick={() => {
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag("event", "deal_click", {
            deal_id: item?.id,
            deal_title: item?.title,
          });
        }

        if (item?.code) {
          copyToClipboard(item?.code);
          toast.success(t("Coupon copied successfully"));
        }
      }}
    >
      <Card className="w-full mx-auto max-w-md rounded-none overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/15 hover:scale-95 p-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="relative p-0" />
        <CardContent className="p-0">
          {item.image ? (
            <Image
              src={item?.image}
              alt={item.title}
              width={500}
              height={225}
              quality={100}
              loading="lazy"
              className="object-contain w-full h-fit rounded-none"
              unoptimized
            />
          ) : item.video ? (
            <video
              src={item.video}
              controls
              className="w-full h-50 object-cover"
            />
          ) : (
            <div className="w-full md:text-3xl h-50 bg-gradient-to-r bg-clip-text text-transparent from-main-200 via-main-600 to-purple-300 flex items-center justify-center text-xl font-bold">
              No Media
            </div>
          )}
        </CardContent>
        <CardFooter className="p-0">
          <div className="w-full h-fit flex justify-center items-center gap-1 bg-green-600/0 -mt-9">
            <div
              className={`w-fit h-fit text-sm flex justify-start items-center gap-1 px-5 py-2 rounded-t-sm rounded-b-none 
                ${isHovered ? "bg-main-600 text-white" : "bg-white text-main-600"}`}
            >
              {t("Claim the Offer")}
              {
                locale === "en" ? (
                  <ChevronRight size={12} />
                ) : (
                  <ChevronLeft size={12} />
                )
              }
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
