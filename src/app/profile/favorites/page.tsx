"use client";
import React from "react";
import BlurFade from "@/components/ui/blur-fade";
import AddToFavoriteBtn from "@/components/AddToFavoriteBtn";
import { useStore } from "@/store";
import Link from "next/link";
import Empty from "@/components/Empty";
import { Avatar } from "@heroui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { secureHtmlLinks } from "@/lib/htmlUtils";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { User } from "@/types";

const Favorites = () => {
  const { user } = useStore((store) => store);

  const {
    data: userProfile,
    isLoading,
    isFetching,
    status,
  } = useQuery<User | null>({
    queryKey: ["user", user?.id],
    queryFn: async () => {
      const data = await api.request.get(`profile/${user?.id}`);
      return data.data;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });

  if (status === "pending" || isLoading || isFetching) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 pt-3 max-h-dvh scrollbar overflow-y-auto w-full">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-36 rounded-3xl p-4 sm:p-5 w-full"
          />
        ))}
      </div>
    );
  }
  return (
    <section id="Favorites" className="w-full max-md:pt-5">
      {userProfile?.favorites && userProfile.favorites?.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 pt-3 max-h-dvh scrollbar overflow-y-auto">
          {userProfile?.favorites?.map(({ store }, idx) => (
            <BlurFade key={store?.slug} delay={0.25 + idx * 0.05} inView>
              <div className="flex items-center justify-between gap-2 rounded-3xl border border-neutral-100 bg-white p-4 sm:p-5 w-full">
                <Link
                  target="_self"
                  href={`/store/${store?.id}`}
                  className="flex flex-1 items-start gap-1 sm:gap-3"
                >
                  <Avatar
                    src={store?.image}
                    alt={store?.title}
                    name={store?.title}
                    showFallback
                    className="h-[64px] w-[64px] rounded-full border border-neutral-100 sm:h-[72px] sm:w-[72px]"
                  />
                  <div className="flex-1">
                    <div
                      className="font-head mb-2 line-clamp-1 text-base font-bold text-neutral-900"
                      title={store?.title}
                    >
                      {store?.store_name}
                    </div>
                    <div className="flex items-center">
                      {store?.description && (
                        <div
                          className="line-clamp-3 text-sm"
                          dangerouslySetInnerHTML={{
                            __html: secureHtmlLinks(store?.description),
                          }}
                        />
                      )}
                    </div>
                  </div>
                </Link>
                <div className="flex items-center">
                  {store?.id && (
                    <AddToFavoriteBtn storeId={store?.id} isFavoriteInitially />
                  )}
                </div>
              </div>
            </BlurFade>
          ))}
        </div>
      ) : (
        <Empty />
      )}
    </section>
  );
};

export default Favorites;
