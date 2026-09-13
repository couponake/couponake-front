import React from "react";

/**
 * Server-rendered first page of the stores list.
 *
 * <Stores/> reads useSearchParams(), so under static rendering (ISR) React
 * bails out to client rendering for that subtree and the prerendered HTML
 * only contained the Suspense fallback (a skeleton). Crawlers reading the raw
 * HTML therefore saw zero store links on /stores/ (audit finding F-04).
 *
 * This component is that fallback: the same first page of stores as plain
 * anchors (no favourites button, no filters). After hydration <Stores/> takes
 * over with the same data (hydrated react-query cache), so visitors never see
 * a skeleton-then-list flash.
 */
type StaticStore = {
  id?: number;
  slug: string;
  store_name?: string | null;
  image?: string | null;
};

const StoresStaticGrid = ({ stores }: { stores?: StaticStore[] | null }) => {
  if (!stores || stores.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <div className="hidden md:block" />
      <div className="md:col-span-3">
        <div className="grid gap-4 grid-cols-2">
          {stores.map((store) => (
            <div
              key={store.slug}
              className="relative flex flex-col sm:flex-row items-center justify-between rounded-2xl border border-neutral-200 bg-white shadow-sm p-4 sm:p-5 gap-y-3 sm:gap-y-0 sm:gap-x-4 w-full max-w-md mx-auto"
            >
              <a
                href={`/store/${store.slug}/`}
                className="flex items-center w-full gap-4 flex-grow max-sm:flex-col max-sm:justify-center"
              >
                <div className="relative w-20 h-20 shadow-md bg-white rounded-full shrink-0 overflow-hidden">
                  {store.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={store.image}
                      alt={store.store_name || "Store Image"}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-contain p-2"
                    />
                  ) : null}
                </div>
                <div className="flex-grow min-w-0">
                  <h2
                    className="sm:text-base md:text-lg font-semibold text-neutral-900 max-sm:text-center"
                    title={store.store_name || undefined}
                  >
                    {store.store_name}
                  </h2>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoresStaticGrid;
