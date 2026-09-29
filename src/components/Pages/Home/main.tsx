import {
  BannerItem,
  featuredStores,
  FeaturedStoresCategoryItem,
  StoreProps,
} from "@/types";
import dynamic from "next/dynamic";
import Hero from "./Hero";
import BestStoresWrapperClientSide from "./BestStoresWrapperClientSide";
import { useTranslations } from "next-intl";

const StoreCarousel = dynamic(() => import("./StoreCarousel"));
const TicketCouponWrapperClientSide = dynamic(
  () => import("./TicketCouponWrapperClientSide"),
);
const AdsWrapperClientSide = dynamic(() => import("./AdsWrapperClientSide"));
const LatestBlogs = dynamic(() => import("./LatestBlogs"));

const Main = ({
  hero_banners,
  featured_stores,
  latest_stores,
}: {
  hero_banners: BannerItem[];
  latest_stores: StoreProps[];
  featured_stores: {
    data: featuredStores[];
    categories: FeaturedStoresCategoryItem[];
  };
}) => {
  const t = useTranslations();
  return (
    <section className="flex flex-col gap-7 md:gap-14 my-7 md:my-14">
      <Hero autoplay lcp banners={hero_banners} />

      <div className="container">
        <div className="w-full min-h-fit bg-gradient-to-br from-main-100 to-main-100 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="p-2 md:p-4">
            <h1 className="text-sm md:text-lg lg:text-2xl xl:text-2xl 2xl:text-3xl text-center font-bold text-gray-800 mb-4 md:mb-8">
              {t("Valid discount coupons")}
            </h1>
          </div>
          <div className="bg-gradient-to-r from-main-500 to-main-500 h-2" />
        </div>
      </div>

      <BestStoresWrapperClientSide stores={featured_stores} />

      {latest_stores?.length > 0 ? (
        <div className="relative container">
          <StoreCarousel
            className="max-w-full min-h-30"
            title="Latest Stores"
            stores={latest_stores}
          />
        </div>
      ) : null}

      <TicketCouponWrapperClientSide />
      <AdsWrapperClientSide />
      <LatestBlogs />
    </section>
  );
};

export default Main;
