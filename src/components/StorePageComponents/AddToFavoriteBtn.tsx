"use client";
import React, { useState } from "react";
import { toast } from "@/components/ui/custom-toast";
import { useTranslations } from "next-intl";
import { useStore } from "@/store";
import { Button } from "@heroui/button";
import { Heart } from "lucide-react";
import api from "@/lib/api";
import { getQueryClient } from "@/lib/get-query-client";

type AddToFavoriteBtnProps = {
  storeId: number;
  isFavoriteInitially?: boolean;
};

const AddToFavoriteBtn: React.FC<AddToFavoriteBtnProps> = ({
  storeId,
  isFavoriteInitially,
}) => {
  const user = useStore((store) => store.user);
  const [isFavorite, setIsFavorite] = useState(isFavoriteInitially);
  const [loading, setLoading] = useState(false);
  const t = useTranslations();
  const queryClient = getQueryClient();
  const toggleFavorite = async () => {
    if (user) {
      try {
        setLoading(true);
        if (isFavorite) {
          // Remove from favorite
          await api.request.post("stores/remove-from-favorite", {
            store_id: storeId,
          });
          toast.success(t("Removed from favorites"));
        } else {
          // Add to favorite
          await api.request.post("stores/add-to-favorite", {
            store_id: storeId,
          });
          toast.success(t("Added to favorites"));
        }
        setIsFavorite(!isFavorite);
        queryClient.invalidateQueries({
          queryKey: ["user", user?.id],
        });
      } catch (error) {
        toast.error(
          "Something went wrong. Please try again." +
          (error instanceof Error ? error.message : "")
        );
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error(t("auth.please_login"));
    }
  };

  return (
    <Button
      name="favorite"
      title="Favorite"
      color={isFavorite ? "primary" : "secondary"}
      isIconOnly
      radius="full"
      onPress={toggleFavorite}
      isLoading={loading}
    >
      <Heart size={26} className={isFavorite ? "fill-red-500" : "text-main-500"} />
    </Button>
  );
};

export default AddToFavoriteBtn;
