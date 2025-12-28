"use client";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { StarIcon } from "lucide-react";
import RateThisComponent from "@/components/StorePageComponents/RateThisComponent";
import AddToFavoriteBtn from "@/components/StorePageComponents/AddToFavoriteBtn";

interface CardProps {
  store_id: number;
  store_slug: string;
  store_title: string;
  store_rate: string;
  store_voters: number;
  store_isInFavorites: boolean;
  isMobile: boolean;
  t: any;
}

function StoreRatingCard({
  store_id,
  store_slug,
  store_title,
  store_rate,
  store_voters,
  isMobile,
  store_isInFavorites,
  t,
}: CardProps) {
  return (
    isMobile && (
      <Card className="relative overflow-hidden max-sm:mt-4 border-none shadow-md rounded-full">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-2">
              <StarIcon className="text-yellow-400 fill-yellow-400 w-5 h-5" />
              <span className="text-black font-medium">
                {Math.round(Number(store_rate))}
                <span className="text-black">/5</span>
              </span>
              <span className="text-black text-sm">
                ({store_voters} {t("Votes")})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <RateThisComponent
                title={`${t("Rate")} ${store_title ?? ""}`}
                route={`stores/${store_slug}/review`}
                data={{ store_id: store_id ?? 0 }}
              />
              <AddToFavoriteBtn
                isFavoriteInitially={store_isInFavorites}
                storeId={store_id ?? 0}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  );
}

export default StoreRatingCard;
