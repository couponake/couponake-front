"use client";
import { secureHtmlLinks } from '@/lib/htmlUtils';
import { useStore } from '@/store';
import { CouponProps } from '@/types';
import { Button } from '@heroui/button';
import { CopyIcon, Eye, ShoppingBag } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

export default function HorizontalCouponCard({ coupon }: { coupon: CouponProps }) {
  const t = useTranslations();
  const locale = useLocale();
  const setSelectedCoupon = useStore((store) => store.setSelectedCoupon);
  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg bg-gradient-to-br from-purple-100 to-main-100" dir="auto">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500 to-main-500 transform rotate-45 translate-x-12 -translate-y-12"></div>

      <div className="relative p-6 flex flex-col h-full">
        <div className="flex items-center mb-4 gap-3">
          <div className="relative w-16 h-16 overflow-hidden rounded-full bg-white shadow-inner">
            {(coupon.store?.image || coupon.image) ? (
              <Image
                src={coupon.store?.image || coupon.image}
                alt={coupon.store?.title || coupon.title}
                fill
                className="object-cover"
                unoptimized
              />
            ) : null}
          </div>
          <div>
            <h2 className="text-xl max-w-64 font-bold text-gray-800 line-clamp-2">{coupon.title}</h2>
          </div>
        </div>

        <div className="flex-grow">
          {coupon?.description && <div className="text-gray-700 mb-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: secureHtmlLinks(coupon?.description) }} />}
          <div className="flex items-center mb-2">
            <ShoppingBag className="w-4 h-4 me-2 text-main-500" />
            <span className="text-sm font-semibold text-main-700">{coupon.discount_value} {t("OFF")}</span>
          </div>
          {coupon.expire_date && (<div className="text-sm text-gray-600">{t("Expire Date")}: {new Date(coupon.expire_date).toLocaleDateString(
            locale === 'ar' ? 'ar-SA' : 'en-US',
            {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }
          )}</div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center text-sm text-gray-500">
              <Eye className="w-4 h-4 me-1" />
              <span>{coupon.views || 0} {t("views")}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <ShoppingBag className="w-4 h-4 me-1" />
              <span>{coupon.used || 0} {t("used")}</span>
            </div>
          </div>
          <Button
            onPress={() => setSelectedCoupon(coupon)}
            fullWidth
            startContent={<CopyIcon className="size-4" />}
            className="gradient-btn"
          >
            {t("Copy Coupon")}
          </Button>
        </div>
      </div>
    </div>
  )
}

