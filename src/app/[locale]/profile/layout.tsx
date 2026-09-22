"use client";
import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { useStore } from "@/store";
import Navigation from "@/components/Pages/Profile/Navigation";
import { Avatar } from "@heroui/avatar";
import { getQueryClient } from "../../../lib/get-query-client";
import api from "@/lib/api";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations();
  const locale = useLocale();
  const { user } = useStore((store) => store);
  const queryClient = getQueryClient();

  if (user?.id) {
    queryClient.prefetchQuery({
      queryKey: ["user", user?.id],
      queryFn: async () => {
        const data = await api.request.get(`profile/${user?.id}`);
        return data.data;
      },
    });
  }

  return (
    <section className="bg-white -mt-9 sm:-mt-4 min-h-[75vh]">
      <div className="mx-auto px-2 sm:container">
        <div className=" pt-5 flex-col items-start gap-12 px-2 flex md:flex-row">
          <div className="flex w-full md:max-w-[360px]">
            <div className="h-fit w-full select-none rounded-2xl border-neutral-100 py-8 md:border bg-neutral-50">
              <div className="md:bg-transparent flex flex-row items-center justify-start gap-4 rounded-2xl border border-b border-neutral-100 bg-neutral-50 p-4 text-center md:flex-col md:justify-center md:border-0">
                {user ? (
                  <Avatar
                    className="w-15 h-15 sm:w-22 sm:h-22"
                    src={user?.image}
                    name={user?.name}
                    showFallback
                  />
                ) : (
                  <div className="size-22 rounded-full bg-default-400" />
                )}
                <div>
                  <div className="mb-1 line-clamp-1 text-start text-lg font-bold md:text-center md:text-xl">
                    {user?.name}
                  </div>
                  {user?.created_at && (
                    <p className="line-clamp-1 text-start text-sm text-neutral-650 opacity-70 md:text-center">
                      {t("Joined")}{": "}
                      {
                        new Date(user.created_at).toLocaleDateString(
                          locale === 'ar' ? 'ar-SA' : 'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )
                      }
                    </p>
                  )}
                </div>
              </div>
              <Navigation />
            </div>
          </div>
          <div className="hidden md:flex flex-1">{children}</div>
        </div>
        <div className="mx-auto flex w-full flex-col items-center gap-12 px-2 md:hidden">
          <div className="flex w-full flex-col md:max-w-[360px]">
            <div className="h-fit w-full select-none rounded-2xl border-neutral-100 md:border md:bg-neutral-50">
              <div className="flex flex-1">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileLayout;
