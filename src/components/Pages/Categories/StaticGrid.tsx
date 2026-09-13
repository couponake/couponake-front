import React from "react";

/**
 * Server-rendered categories grid used as the Suspense fallback of
 * <Categories/>, which reads useSearchParams() and is therefore client-rendered
 * under static rendering (the prerendered HTML held only a skeleton — audit
 * finding F-04). Plain anchors so crawlers see the 29 category links in HTML;
 * <Categories/> renders the same list from props after hydration.
 */
type StaticCategory = {
  id?: number;
  slug: string;
  name?: string | null;
  image?: string | null;
};

const CategoriesStaticGrid = ({
  categories,
}: {
  categories?: StaticCategory[] | null;
}) => {
  if (!categories || categories.length === 0) return null;
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {categories.map((category) => (
          <a
            href={`/coupon-category/${category.slug}/`}
            key={category.id ?? category.slug}
            className="group block"
          >
            <div className="bg-white border-none border-gray-100 rounded-lg overflow-hidden shadow-sm">
              <div className="relative aspect-[16/9] rounded-lg bg-white">
                {category.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={category.image}
                    alt={category.name || ""}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                ) : null}
              </div>
              <div className="py-3 text-center">
                <h2 className="text-sm md:text-base font-medium line-clamp-1">
                  {category.name}
                </h2>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default CategoriesStaticGrid;
