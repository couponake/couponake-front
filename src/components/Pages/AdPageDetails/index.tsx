"use client";
import React from "react";
import { AdPage } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@heroui/button";
import { CopyIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { toast } from "@/components/ui/custom-toast";
import Image from "next/image";
import { secureHtmlLinks } from "@/lib/htmlUtils";

const AddDetails = ({ page }: { page: AdPage }) => {
  const t = useTranslations();
  const [, copyToClipboard] = useCopyToClipboard();

  const handelCopyCoupon = () => {
    if (page?.type === "code") {
      if (page?.code) {
        toast.success(
          t("Coupon copied successfully and will be redirected to the store")
        );
        copyToClipboard(page?.code);
        setTimeout(() => {
          const link = document.createElement("a");
          link.href = page?.url;
          link.target = "_blank";
          link.rel = "nofollow";
          link.click();
        }, 1000);
      }
    } else {
      toast.success(t("Coupon copied successfully"));
      copyToClipboard(page?.code);
    }
  };
  return (
    <section className="space-y-7">
      <Card className="max-w-screen-lg mx-auto">
        <CardHeader className="text-center">
          {page?.image && (
            <Image
              width={400}
              height={256}
              src={page?.image}
              alt={page?.title}
              className="w-full h-64 object-contain object-center rounded-xl mb-5"
              unoptimized
            />
          )}
          <CardTitle className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl 2xl:leading-[4rem] font-bold">
            {page?.title}
          </CardTitle>
          {page?.description && (
            <CardDescription
              className="prose max-w-none text-lg text-gray-500"
              dangerouslySetInnerHTML={{
                __html: secureHtmlLinks(page?.description),
              }}
            />
          )}
        </CardHeader>
        {page?.type === "code" && (
          <CardContent>
            <p className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl text-center p-5 font-bold rounded-2xl border border-dashed border-gray-300">
              {page?.code}
            </p>
          </CardContent>
        )}
        <CardFooter className="grid  gap-4">
          <Button
            variant="flat"
            color="primary"
            className="w-full text-main-500"
            size="lg"
            startContent={<CopyIcon className="size-5" />}
            onPress={handelCopyCoupon}
          >
            {t("Copy Coupon")}
          </Button>
          {/* <Button variant="solid" color="primary" className="w-full" size="lg">
            {t("Go to the store")}
          </Button> */}
        </CardFooter>
      </Card>
      <div className="bg-white py-7 sm:py-9 lg:py-13">
        <div className="container space-y-5">
          <h1 className="text-center text-xl font-semibold">
            {t("Other offers we suggest")}
          </h1>
          <div className="p-5 bg-main-50 rounded-lg grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-5">
            {page?.stores?.map((store) => (
              <div key={store?.slug} className="text-center">
                <Image
                  src={store?.image}
                  width={300}
                  height={240}
                  className="w-full h-40 rounded-full object-contain object-center"
                  alt={store?.title}
                  unoptimized
                />
                <Link href={`/store/${store?.slug}`} className="mt-3">
                  {store?.keywords}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddDetails;
