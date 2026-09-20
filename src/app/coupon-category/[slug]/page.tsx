import React from "react";
import { getCategoryDetail } from "@/services/public-detail-data";
import ShowCategory from "@/components/Pages/Categories/show";
import { CategoryItem } from "@/types";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { getSettingEnabled } from "@/services/getIndexingSettings";
import { SettingsEnum } from "@/types/settingsEnum";

// Keep redirects out of Full Route Cache (Next.js #82117). The public data
// loader still caches validated anonymous data for 300 seconds. connection()
// preserves explicit caches in the layout, unlike force-dynamic.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const slug = (await params).slug;

  const response = await getCategoryDetail(slug);
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
  if (response.kind === "not_found") notFound();

  {
    const category = response.data.category;
    //get the indexing settings of the Category page
    const indexingCategory = await getSettingEnabled(SettingsEnum.Categories);


    return {
      title: category?.category_seo?.title,
      description: category?.category_seo?.description,
      alternates: {
        canonical:
          `${process.env.NEXT_PUBLIC_Couponake_WEBSITE_URL}coupon-category/${slug}/` || "",
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
  await connection();
  const slug = (await params).slug;
  const response = await getCategoryDetail(slug);

  if (response.kind === "redirect") {
    redirect(response.redirect_url);
  }

  if (response.kind === "not_found") {
    notFound();
  }

  const category: any = response.data;
  const baseUrl = process.env.NEXT_PUBLIC_Couponake_WEBSITE_URL;
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
        name: "كوبونك",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}couponakeLogo.webp`,
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
          name: "كوبونك",
          url: baseUrl,
        },
        publisher: {
          "@type": "Organization",
          name: "كوبونك",
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}couponakeLogo.webp`,
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
