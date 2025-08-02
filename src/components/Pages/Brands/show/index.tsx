import React from "react";
import { useTranslations } from "next-intl";
import { BrandProps } from "@/types";
import StoreCoupon from "@/components/StoreCoupon";
import Image from "next/image";
import StoreCarousel from "../../Home/StoreCarousel";

const ShowCategory = ({
  brand,
}: {
  brand: BrandProps;
}) => {
  const t = useTranslations();
  return (
    <div className="-mt-7">
      <div className="bg-gradient-to-tr from-blue-200 via-main-600 to-blue-300">
        <div className="container mx-auto py-5 md:py-7">
          <div className="flex items-center justify-center lg:justify-between flex-wrap gap-7 min-h-50">
            <div className="text-white">
              <h2 className="text-4xl font-bold sm:text-6xl lg:leading-[4rem]">
                {brand?.title}
              </h2>
              {/* <p className="max-w-96 text-sm font-normal sm:text-xl line-clamp-2">
              {brand?.description}
              </p> */}
            </div>
            {brand?.image && (
              <Image
                height={240}
                width={300}
                src={brand?.image}
                alt={brand?.title}
                title={brand?.title}
                quality={100}
                className="max-h-60 object-contain rounded-xl"
                unoptimized
              />
            )}
          </div>
        </div>
      </div>
      <section className="container flex gap-10 pt-5 sm:pt-7 pb-5">
        <div className="flex-1 space-y-5 overflow-x-hidden">
          {/* <Card className="relative overflow-hidden">
            <div className="gradient absolute top-20 left-0  size-80 bg-main-500/30 blur-[100px]" />

            <CardHeader className="py-2.5" />
            <CardContent className="space-y-5">
              <h4 className="!mt-9">{t("Stores from the same country")}</h4>
              <div className="flex items-center gap-3 flex-wrap">
                {store_countries?.map((item, index) => (
                  <Link target="_blank" href={`/stores?country=${item}`} key={index}>
                    <Button variant="faded" color="primary">
                      {item}
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
            <CardFooter className="py-2.5" />
          </Card>
          <Divider /> */}
          <div className="space-y-5">
            {brand?.coupons?.map((coupon, index) => (
              <React.Fragment key={coupon?.id}>
                <StoreCoupon coupon={coupon} />{" "}
              </React.Fragment>
            ))}
          </div>
          <StoreCarousel
            title={t("Category stores") ?? ""}
            stores={brand?.stores ?? []}
            showViewAll={false}
          />
        </div>
      </section>
    </div>
  );
};

export default ShowCategory;
