import React from "react";
import { getCategoryDetail } from "@/services/public-detail-data";
import ShowCategory from "@/components/Pages/Categories/show";
import { CategoryItem } from "@/types";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { getSettingEnabled } from "@/services/getIndexingSettings";
import { SettingsEnum } from "@/types/settingsEnum";
import JsonLd from "@/components/shared/JsonLd";
import { HOME_CRUMB, SITE_URL, absoluteUrl, breadcrumbNode, buildGraph, ref, storeItemList, stripBrandSuffix, webPageNode } from "@/lib/structured-data";

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
  const categoryData = category.category as CategoryItem;

  const pageUrl = absoluteUrl(`coupon-category/${slug}/`);
  const categoryName =
    categoryData?.name || stripBrandSuffix(categoryData?.category_seo?.title);
  const itemList = storeItemList(`${pageUrl}#list`, categoryData?.stores ?? []);

  // CollectionPage (title/description = this page's SEO meta) listing the
  // category's stores; the old nested WebPage › CollectionPage with an invalid
  // "webPage" type was replaced.
  const graph = buildGraph([
    webPageNode({
      type: "CollectionPage",
      url: pageUrl,
      name: stripBrandSuffix(categoryData?.category_seo?.title) || categoryName,
      description: categoryData?.category_seo?.description,
      extra: itemList ? { mainEntity: ref(`${pageUrl}#list`) } : undefined,
    }),
    ...(itemList ? [itemList] : []),
    breadcrumbNode(pageUrl, [
      HOME_CRUMB,
      { name: "الفئات", url: `${SITE_URL}categories/` },
      { name: categoryName, url: pageUrl },
    ]),
  ]);

  return (
    <>
      <JsonLd data={graph} />
      <ShowCategory slug={slug} {...category} />
    </>
  );
};

export default ShowCouponCategoryPage;
