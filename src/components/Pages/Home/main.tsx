import {
  BannerItem,
  featuredStores,
  FeaturedStoresCategoryItem,
  StoreProps,
} from "@/types";
import dynamic from "next/dynamic";
import React from "react";
import Hero from "./Hero";
import BestStoresWrapperClientSide from "./BestStoresWrapperClientSide";
import StatisticsCard from "./StatisticsCard";


const StoreCarousel = dynamic(() => import("./StoreCarousel"));
const TicketCouponWrapperClientSide = dynamic(() => import("./TicketCouponWrapperClientSide"));
const AdsWrapperClientSide = dynamic(() => import("./AdsWrapperClientSide"));
const LatestBlogs = dynamic(() => import("./LatestBlogs"));

const Main = ({
  hero_banners,
  featured_stores,
  latest_stores,
  collection_count,
}: {
  hero_banners: BannerItem[];
  latest_stores: StoreProps[];
  featured_stores: {
    data: featuredStores[];
    categories: FeaturedStoresCategoryItem[];
  };
  collection_count: {
    stores: number;
    coupons: number;
    users: number;
  };
}) => {
  return (
    <section>
      <Hero autoplay lcp banners={hero_banners} />

      <div className="container">
        <StatisticsCard collection_count={collection_count} />
      </div>

      <BestStoresWrapperClientSide stores={featured_stores} />

      {latest_stores?.length > 0 ? (
        <div className="relative my-10 md:my-16 container">
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
