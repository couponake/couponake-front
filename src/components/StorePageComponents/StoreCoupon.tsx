"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/custom-toast";
import api from "@/lib/api";
import { secureHtmlLinks } from "@/lib/htmlUtils";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import { CouponProps } from "@/types";
import { Avatar, AvatarGroup } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import {
  ChevronDown,
  CopyIcon,
  ScissorsIcon,
  ThumbsUpIcon,
  XCircleIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import FacebookReactions from "../FacebookReactions";

interface emojiType {
  id: number;
  coupon_id: number;
  user_id: any;
  emoji: string;
  created_at: string;
  updated_at: string;
}

const reactionEmojis = {
  like: (
    <div
      className={cn(
        "relative size-12 scale-[0.7]  bg-[url('http://deividmarques.github.io/facebook-reactions-css/assets/images/facebook-reactions.png')] bg-no-repeat"
      )}
    />
  ),
  wow: (
    <div
      className={cn(
        "relative size-12 bg-[-144px_0] scale-[0.7]  bg-[url('http://deividmarques.github.io/facebook-reactions-css/assets/images/facebook-reactions.png')] bg-no-repeat"
      )}
    />
  ),
  angry: (
    <div
      className={cn(
        "relative size-12 bg-[-240px_0] scale-[0.7]  bg-[url('http://deividmarques.github.io/facebook-reactions-css/assets/images/facebook-reactions.png')] bg-no-repeat"
      )}
    />
  ),
  sad: (
    <div
      className={cn(
        "relative size-12 bg-[-192px_0] scale-[0.7]  bg-[url('http://deividmarques.github.io/facebook-reactions-css/assets/images/facebook-reactions.png')] bg-no-repeat"
      )}
    />
  ),
  love: (
    <div
      className={cn(
        "relative size-12 bg-[-48px_0] scale-[0.7]  bg-[url('http://deividmarques.github.io/facebook-reactions-css/assets/images/facebook-reactions.png')] bg-no-repeat"
      )}
    />
  ),
  haha: (
    <div
      className={cn(
        "relative size-12 scale-[0.7] bg-[-96px_0]  bg-[url('http://deividmarques.github.io/facebook-reactions-css/assets/images/facebook-reactions.png')] bg-no-repeat"
      )}
    />
  ),
};

const StoreCoupon = ({
  coupon,
  isExpired,
  className,
  store_image,
}: {
  coupon: CouponProps;
  isExpired?: boolean;
  className?: string;
  store_image?: string;
}) => {
  const t = useTranslations();
  const { user, setSelectedCoupon } = useStore((store) => store);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, copyToClipboard] = useCopyToClipboard();
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [couponEmojisLocally, setCouponEmojisLocally] = useState<emojiType[]>(
    []
  );

  useEffect(() => {
    if (user) {
      setCouponEmojisLocally(
        coupon?.emojis?.filter(
          (emoji: emojiType) => emoji?.user_id === user?.id
        ) || []
      );
    } else {
      setCouponEmojisLocally([] as emojiType[]);
    }
  }, [coupon, user]);

  const handleViewDetails = () => {
    setIsDescriptionVisible(!isDescriptionVisible);
  };

  const handleEmojiReaction = async (value: string) => {
    if (user) {
      try {
        setIsLoading(true);
        if (
          couponEmojisLocally?.find(
            (emoji: emojiType) =>
              emoji?.user_id === user?.id && emoji?.emoji === value
          )
        ) {
          toast.info(t("You Already Reacted"));
        } else if (
          couponEmojisLocally?.find(
            (emoji: emojiType) =>
              emoji?.user_id === user?.id && emoji?.emoji !== value
          )
        ) {
          await api.request.post("stores/coupon/emoji", {
            emoji: value,
            coupon_id: coupon?.id,
          }).then(() => {
            toast.success(t("Emoji reaction edited successfully"));
          });
          const editedEmoji = couponEmojisLocally?.find(
            (emoji: emojiType) =>
              emoji?.user_id === user?.id && emoji?.emoji !== value
          );
          if (editedEmoji) {
            editedEmoji.emoji = value;
          }
          setCouponEmojisLocally([...couponEmojisLocally]);
        } else {
          await api.request.post("stores/coupon/emoji", {
            emoji: value,
            coupon_id: coupon?.id,
          }).then(() => {
            toast.success(t("Emoji reaction added successfully"));
          });
          setCouponEmojisLocally([
            ...couponEmojisLocally,
            {
              id: Date.now(),
              emoji: value,
              coupon_id: coupon?.id,
              user_id: user?.id,
              created_at: Date.now().toString(),
              updated_at: Date.now().toString(),
            },
          ]);
        }
      } catch {
        toast.error(t("Error adding emoji reaction"));
      } finally {
        setIsLoading(false);
      }
    } else {
      if (
        couponEmojisLocally?.length > 0 &&
        couponEmojisLocally?.find((emoji: emojiType) => emoji?.emoji === value)
      ) {
        toast.info(t("You Already Reacted"));
      } else if (
        couponEmojisLocally?.length > 0 &&
        couponEmojisLocally?.find((emoji: emojiType) => emoji?.emoji !== value)
      ) {
        toast.success(t("Emoji reaction edited successfully"));
        setCouponEmojisLocally([
          {
            id: Date.now(),
            emoji: value,
            coupon_id: coupon?.id,
            user_id: null,
            created_at: Date.now().toString(),
            updated_at: Date.now().toString(),
          },
        ]);
      } else {
        toast.success(t("Emoji reaction added successfully"));
        setCouponEmojisLocally([
          ...couponEmojisLocally,
          {
            id: Date.now(),
            emoji: value,
            coupon_id: coupon?.id,
            user_id: null,
            created_at: Date.now().toString(),
            updated_at: Date.now().toString(),
          },
        ]);
      }
    }
  };

  return (
    <Card
      className={cn(
        "rounded-xl shadow-none hover:drop-shadow-lg duration-300 transition-all hover:-translate-y-[2px]",
        className
      )}
    >
      {isExpired && (
        <div
          className="absolute inset-0 z-0 opacity-20 pointer-events-none grid grid-cols-8 gap-4"
          style={{
            backgroundSize: "150px 150px", // Size of each watermark unit
          }}
        >
          {[...Array(41)].map((_, index) => (
            <span
              key={index}
              className="transform flex items-center gap-1 text-gray-600 rotate-[-20deg]"
            >
              {t("Expired")} <XCircleIcon className="size-4" />
            </span>
          ))}
        </div>
      )}
      {/* <CardHeader>
      </CardHeader> */}
      <CardContent className="bg-red-300/0 p-2 md:p-4 lg:p-4 xl:p-4 2xl:p-4">
        <div className="w-full h-fit flex flex-col sm:flex-row md:flex-row lg:flex-row xl:flex-row 2xl:flex-row items-center justify-between gap-5 md:gap-0 lg:gap-0 xl:gap-0 2xl:gap-0">
          <div className="w-fit h-fit flex flex-col items-start justify-start gap-3 md:gap-5 lg:gap-5 xl:gap-5 2xl:gap-5">
            <div className="w-fit h-fit flex items-center justify-center gap-3">
              <div className="w-[52px] aspect-square">
                <Image
                  src={store_image ? store_image : "/noPreview.webp"}
                  alt={coupon?.title || "Coupon Image"}
                  title={coupon?.title || "Coupon"}
                  width={52}
                  height={52}
                  className="size-10 sm:size-11 md:size-12 lg:size-13 xl:size-13 object-contain rounded-full"
                  unoptimized
                />
              </div>
              <h2
                className={cn(
                  "font-bold text-base md:text-lg lg:text-xl xl:text-2xl",
                  isExpired && "text-gray-600"
                )}
              >
                {coupon?.title}
              </h2>
            </div>
            <div className="w-fit h-fit flex flex-wrap items-start justify-center gap-3">
              <span className="inline-flex gap-1 items-center rounded-full bg-gray-200 px-2 py-1 text-[10px] md:text-xs lg:text-xs xl:text-xs font-medium text-gray-600 ring-1 ring-gray-500/0 ring-inset">
                <p>{t("Verified")}</p>
              </span>
              <span className="inline-flex gap-1 items-center rounded-full bg-gray-200 px-2 py-1 text-[10px] md:text-xs lg:text-xs xl:text-xs font-medium text-gray-600 ring-1 ring-gray-500/0 ring-inset">
                <p>
                  {coupon?.used ?? 0} {t("Used today")}
                </p>
              </span>
            </div>
          </div>
          <div className="flex flex-row md:flex-col lg:flex-col xl:flex-col 2xl:flex-col items-center justify-center gap-8 pb-4 md:pb-0 lg:pb-0 xl:pb-0 2xl:pb-0">
            <button
              disabled={isExpired}
              className={`
              text-gray-700 relative border-main-500 border 
              text-center flex items-center justify-center ltr:text-[41px]  
              rtl:text-5xl rtl:2xl:text-6xl ltr:2xl:text-[51px] 
              font-bold h-fit w-30 md:w-34 lg:w-36 rounded-md border-dashed
              `}
            >
              <p className="px-3 py-1 text-4xl md:text-5xl lg:text-5xl">
                <span
                  className={cn(
                    "text-main-600 animate-pulse",
                    isExpired && "animate-none"
                  )}
                >
                  {coupon?.discount_value}
                </span>
              </p>
              <ScissorsIcon className="text-main-500 absolute size-7 rotate-90  ltr:-right-4 rtl:-left-4" />
            </button>
            {!isExpired && (
              <Button
                variant="flat"
                color="primary"
                size="lg"
                className="relative text-primary text-sm md:text-base lg:text-base xl:text-base overflow-visible"
                startContent={
                  <CopyIcon className="size-4 md:size-5 lg:size-5 xl:size-5" />
                }
                onPress={() => setSelectedCoupon(coupon)}
              >
                {t("Copy Coupon")}
                <div className="absolute rtl:top-1 rtl:left-1 ltr:top-1 ltr:right-1 hover:inset-0 focus:inset-0 active:inset-0 rtl:w-[150px] rtl:md:w-[165px] rtl:lg:w-[165px] ltr:w-[173px] ltr:md:w-[191px] ltr:lg:w-[191px] h-[48px] border border-main-500 rounded-[14px]" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="grid gap-2 border-t p-2">
        <div className="flex items-center justify-between flex-1">
          {coupon?.description && (
            <Button
              variant="light"
              color="primary"
              onPress={handleViewDetails}
              className="flex justify-center items-center gap-1"
            >
              {t("View Details")}
              <ChevronDown
                className={`size-4 transition-all ${!isDescriptionVisible ? " rotate-0" : " rotate-180"}`}
              />
            </Button>
          )}
          <span className="w-fit inline-flex gap-1 items-center rounded-none bg-gray-200/0 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/0 ring-inset">
            <p className="w-fit p-0 text-center">
              {t("Last used")} {coupon?.last_used} {t("minutes ago")}
            </p>
          </span>
          <div className="w-[50px] lg:w-[135px] xl:w-[135px] 2xl:w-[135px] px-2 bg-transparent flex items-center justify-end gap-2 text-gray-500">
            <AvatarGroup max={7}>
              {couponEmojisLocally &&
                couponEmojisLocally.length > 0 &&
                couponEmojisLocally.map((reaction: emojiType) => (
                  <Avatar
                    key={reaction.id}
                    className="size-5 sm:size-7 bg-red-500"
                    fallback={
                      reactionEmojis[
                      reaction.emoji as keyof typeof reactionEmojis
                      ]
                    }
                  />
                ))}
            </AvatarGroup>
            <FacebookReactions
              onReactionSelect={handleEmojiReaction}
              isLoading={isLoading}
            >
              <button className="hover:text-main-400">
                <ThumbsUpIcon className="size-5" />
              </button>
            </FacebookReactions>
          </div>
        </div>
        {isDescriptionVisible && coupon?.description && (
          <div
            className="text-sm text-gray-700 prose max-w-none pb-1"
            dangerouslySetInnerHTML={{
              __html: secureHtmlLinks(coupon?.description),
            }}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default StoreCoupon;
