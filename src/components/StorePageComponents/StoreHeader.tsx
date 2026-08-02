'use client'
import React from 'react'
import Image from 'next/image'
import { StarIcon } from 'lucide-react'
import RateThisComponent from '@/components/StorePageComponents/RateThisComponent'
import AddToFavoriteBtn from '@/components/StorePageComponents/AddToFavoriteBtn'

interface HeaderProps {
  store_id: number
  store_slug: string
  store_image: string
  store_title: string
  isMobile: boolean
  store_rate: string
  store_voters: number
  store_isInFavorites: boolean
  locale: string
  t: any
}

function StoreHeader({ store_id, store_slug, store_image, store_title, isMobile, store_rate, store_voters, store_isInFavorites, locale, t }: HeaderProps) {
  return (
    <header className="w-full">
      <div className="bg-gradient-to-r from-main-700 to-main-600 shadow-lg">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-row items-center sm:items-start md:items-start lg:items-start gap-3">
            {store_image && (
              <div className="shrink-0">
                <Image
                  src={store_image ? encodeURI(store_image) : "noPreview.webp"}
                  alt={store_title}
                  title={store_title}
                  width={!isMobile ? 106 : 71}
                  height={!isMobile ? 60 : 40}
                  priority
                  className="rounded-lg shadow-md object-cover"
                />
              </div>
            )}
            <div className="flex-1 flex flex-row items-center justify-between gap-2 min-w-0 bg-purple-500/0">
              <div className="flex flex-col items-start justify-center gap-1">
                <h1 className="text-sm sm:text-base md:text-xl lg:text-xl xl:text-2xl text-white font-bold">
                  {store_title}
                </h1>
                <div className="w-fit flex items-center gap-2">
                  {!isMobile && (
                    <>
                      <div className="flex items-center gap-2">
                        <StarIcon className="text-yellow-400 fill-yellow-400 w-5 h-5" />
                        <span className="text-white font-medium">
                          {Math.round(Number(store_rate))}
                          <span className="text-white">/5</span>
                        </span>
                        <span className="text-white text-sm">
                          ({store_voters} {t("Votes")})
                        </span>
                      </div>

                      <div className="h-4 w-px bg-gray-300 mx-1"></div>
                    </>
                  )}
                  <div className="flex items-center gap-2 text-white text-sm">
                    <p>
                      {t("Last updated")} {": "}
                      {new Date().toLocaleDateString(locale === "ar" ? 'ar-SA' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      {" ( " + `${t("Today")}` + " ) "}
                    </p>
                  </div>
                </div>
              </div>
              {!isMobile && (
                <div className="w-fit flex flex-wrap items-center justify-center gap-2 bg-green-500/0">
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
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default StoreHeader