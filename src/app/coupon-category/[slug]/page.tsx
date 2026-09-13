import React from "react";
import { fetchApi } from "@/lib/api-result";
import ShowCategory from "@/components/Pages/Categories/show";
import { CategoryItem } from "@/types";
import { notFound, redirect } from "next/navigation";
import { getSettingEnabled } from "@/services/getIndexingSettings";
import { SettingsEnum } from "@/types/settingsEnum";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  // Same caching semantics as before (no-store); only the failure handling changes.
  const response = await fetchApi<{ category: CategoryItem }>(
    `categories/${slug}`,
    { revalidate: false }
  );
  if (response.kind === "redirect") {
    return {
      title: "Redirecting...",
      description: "You are being redirected to the correct page",
      alternates: {
        canonical: response.redirect_url,
      },
      robots: {
        index: false,
        follow: true,
      },
    };
  }
  if (response.kind === "not_found" || !response.data?.category) {
    // The page itself answers 404 (notFound()); metadata is irrelevant.
    return { title: "كوبونات", description: "كوبونات" };
  }

  {
    const category = response.data.category;
    //get the indexing settings of the Category page
    const indexingCategory = await getSettingEnabled(SettingsEnum.Categories);


    return {
      title: category?.category_seo?.title,
      description: category?.category_seo?.description,
      alternates: {
        canonical:
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}coupon-category/${slug}/` || "",
      },
      robots: {
        index: indexingCategory,
      },
      openGraph: {
        title: category?.category_seo?.title,
        description: category?.category_seo?.description,
        images: [
          {
            url: category?.category_seo?.image,
            alt: category?.category_seo?.description,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: category?.category_seo?.title,
        description: category?.category_seo?.description,
        images: [
          {
            url: category?.category_seo?.image,
            alt: category?.category_seo?.description,
          },
        ],
      },
    };
  }
}

const ShowCouponCategoryPage = async ({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) => {
  const slug = (await params).slug;
  // fetchApi: API 404 → real 404 here (was the not-found UI rendered with a
  // 200 status — soft 404); API failure → thrown (uncached 500).
  const response = await fetchApi<{ category: CategoryItem }>(
    `categories/${slug}`,
    { revalidate: false }
  );

  if (response.kind === "redirect") {
    redirect(response.redirect_url);
  }

  if (response.kind !== "ok" || !response.data?.category) {
    notFound();
  }

  const category: any = response.data;
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;
  const categoryData = category.category as CategoryItem;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "الرئيسية",
            item: baseUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: categoryData?.category_seo?.title,
            item: `${baseUrl}coupon-category/${slug}/`,
          },
        ],
      },
      {
        "@type": "Organization",
        name: "كوبونات",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}coupoonatLogo.webp`,
        },
      },
      {
        "@type": "WebPage",
        name: categoryData?.category_seo?.title,
        description: categoryData?.category_seo?.description,
        url: `${baseUrl}coupon-category/${slug}/`,
        sameAs: `${baseUrl}coupon-category/${slug}/`,
        isPartOf: {
          "@type": "WebSite",
          name: "كوبونات",
          url: baseUrl,
        },
        publisher: {
          "@type": "Organization",
          name: "كوبونات",
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}coupoonatLogo.webp`,
          },
        },
        mainEntity: {
          "@type": "CollectionPage",
          name: categoryData?.category_seo?.title,
          hasPart: categoryData?.stores
            ?.slice(0, 5)
            ?.map((store: any, index: number) => ({
              "@type": "webPage",
              name: store.store_name,
              url: `${baseUrl}store/${store.slug}/`,
              identifier: store.id,
              position: index + 1,
            })),
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
      <ShowCategory slug={slug} {...category} />
    </>
  );
};

export default ShowCouponCategoryPage;
