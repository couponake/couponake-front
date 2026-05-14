import React from "react";
import api from "@/lib/api";
import ShowCategory from "@/components/Pages/Categories/show";
import { CategoryItem } from "@/types";
import { redirect } from "next/navigation";
import NotFound from "@/app/not-found";
import { getSettingEnabled } from "@/services/getIndexingSettings";
import { SettingsEnum } from "@/types/settingsEnum";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  try {
    const response: any = await api.dynamic(`categories/${slug}`);
    if (response.redirect_url) {
      return {
        title: "Redirecting...",
        description: "You are being redirected to the correct page",
        alternates: {
          canonical: response.redirect_url,
        },
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const category = response.category as CategoryItem;
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
        follow: indexingCategory,
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
  } catch {
    return {
      title: "Error Loading Page",
      description: "An error occurred while loading this page",
    };
  }
}

const ShowBrandPage = async ({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) => {
  const slug = (await params).slug;
  const category: any = await api.dynamic(`categories/${slug}`);

  if (category.redirect_url) {
    redirect(category.redirect_url);
  }

  if (category?.status === 'error' || !category?.category) {
    return NotFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;
  const categoryData = category?.category as CategoryItem;

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
              url: `${baseUrl}store/${store.slug}`,
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

export default ShowBrandPage;
