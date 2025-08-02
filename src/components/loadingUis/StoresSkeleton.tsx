import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const StoresSkeleton = ({ hideSideBar = false }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      {!hideSideBar && (
        <div className="hidden md:block">
          <div
            id="dropdown"
            className="mt-5 h-fit !w-full select-none rounded-lg border border-neutral-200 bg-white pt-3 sm:w-[260px]"
          >
            <ul className="select-none space-y-2 text-sm transition delay-150 duration-300 ease-in-out">
              {Array.from({ length: 7 })?.map((_, index) => (
                <Skeleton
                  key={index}
                  className="rounded-s-0 mb-2 mx-2 flex h-12 items-center rounded-e-xl border-s-4 border-main-600/0 py-3.5 text-neutral-900 hover:border-s-4 hover:border-main-600 hover:bg-neutral-50 hover:text-main-600 ltr:pl-3 rtl:pr-3"
                />
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className="mt-6 md:col-span-3">
        <div className="mb-14 flex items-center justify-between gap-4">
          <div className="flex-1 md:w-96">
            <Skeleton className="rounded-md h-12 w-full" />
          </div>
          <Skeleton className="rounded-md h-12 min-w-50 w-full" />
        </div>
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 6 })?.map((_, index) => (
              <Skeleton
                key={index}
                className="cardWidth mb-3 h-35 flex -translate-y-8 transform cursor-pointer items-center justify-between gap-2 rounded-3xl border border-neutral-100 p-4 sm:mb-6 sm:p-5"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoresSkeleton;
