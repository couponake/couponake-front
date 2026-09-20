import { fetchApi } from "@/lib/api-result";
import ShowBlog from "@/components/Pages/Blogs/show";
import { Blog } from "@/types";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { getSettingEnabled } from "@/services/getIndexingSettings";
import { SettingsEnum } from "@/types/settingsEnum";

import CuratedStoreWidget from "@/components/shared/CuratedStoreWidget";

// ISR: register the route for on-demand static generation. Pages are rendered
// on first request, cached at the edge, and refreshed in the background.
export const revalidate = 300;
export async function generateStaticParams() {
  return [];
}

// Blog data is cached for 5 minutes (stale-while-revalidate) instead of
// being fetched from the API twice on every page view.
const BLOG_REVALIDATE = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  const response = await fetchApi<{ blog: Blog }>(`blogs/${slug}`, {
    revalidate: BLOG_REVALIDATE,
  });
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
  if (response.kind === "not_found" || !response.data?.blog) {
    // The page itself answers 404 (notFound()); metadata is irrelevant.
    return { title: "كوبونك", description: "كوبونك" };
  }

  {
    const blog = response.data.blog;
    //get the indexing settings of the Blog page
    const indexingBlog = await getSettingEnabled(SettingsEnum.Blogs);

    return {
      title: blog?.blog_seo?.title,
      description: blog?.blog_seo?.description,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_Couponake_WEBSITE_URL}${slug}/` || "",
      },
      robots: {
        index: indexingBlog,
      },
      openGraph: {
        title: blog?.blog_seo?.["og:title"],
        description: blog?.blog_seo?.["og:description"],
        images: [
          {
            url: blog?.blog_seo?.["og:image"],
            alt: blog?.blog_seo?.["og:description"],
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: blog?.blog_seo?.["twitter:title"],
        description: blog?.blog_seo?.["twitter:description"],
        images: [
          {
            url: blog?.blog_seo?.["twitter:image"],
            alt: blog?.blog_seo?.["twitter:description"],
          },
        ],
      },
    };
  }
}

const BlogDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = (await params).slug;
  const baseUrl = process.env.NEXT_PUBLIC_Couponake_WEBSITE_URL;
  // fetchApi tells a missing post (API 404 → real 404 here) apart from an API
  // failure (thrown → uncached 500), so a service hiccup is never cached as 404.
  const response = await fetchApi<{ blog: Blog }>(`blogs/${slug}`, {
    revalidate: BLOG_REVALIDATE,
  });

  if (response.kind === "redirect") {
    redirect(response.redirect_url);
  }

  // Unknown slug (bot probes like /wp-login.php, deleted or unpublished posts):
  // a real 404 status, not the not-found UI rendered as a 200 page (soft 404).
  if (response.kind !== "ok" || !response.data?.blog) {
    notFound();
  }

  const blog = response.data.blog;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}${encodeURIComponent(blog?.slug)}/`,
    },
    headline: blog?.blog_seo?.title,
    name: blog?.blog_seo?.title,
    description: blog?.blog_seo?.description,
    image: {
      "@type": "ImageObject",
      url: blog?.image || `${baseUrl}noPreview.webp`,
      width: 1200,
      height: 628,
    },
    author: {
      "@type": "Person",
      name: blog?.responsible?.name || "Anonymous",
      url: `${baseUrl}${blog.slug}/`,
    },
    publisher: {
      "@type": "Organization",
      name: "كوبونك",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}couponakeLogo.webp`,
        width: 600,
        height: 60,
      },
    },
    datePublished: blog?.created_at,
    dateModified: blog?.content_updated_at || blog?.created_at,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "الرئيسية",
        item: `${baseUrl}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "المدونة",
        item: `${baseUrl}blog/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: blog?.title,
        item: `${baseUrl}${blog.slug}/`,
      },
    ],
  };

  const imageObjectSchema = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: blog?.image || `${baseUrl}noPreview.webp`,
    url: blog?.image || `${baseUrl}noPreview.webp`,
    width: 1200,
    height: 628,
    description: blog?.blog_seo?.description,
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}${blog.slug}/`,
    url: `${baseUrl}${blog.slug}/`,
    name: blog?.title,
    description: blog?.blog_seo?.description,
    isPartOf: {
      "@type": "WebSite",
      "@id": baseUrl,
      name: "كوبونك",
      url: baseUrl,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: blog?.image || `${baseUrl}noPreview.webp`,
    },
    datePublished: blog?.created_at,
    dateModified: blog?.content_updated_at || blog?.created_at,
  };

  const ratingSchema = {
    "@context": "https://schema.org",
    "@type": "Product", // you could also use "CreativeWork" but Google won’t show stars for it
    name: blog?.title,
    description: blog?.blog_seo?.description,
    image: blog?.image || `${baseUrl}noPreview.webp`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: parseFloat(blog.rate) || 1,
      ratingCount: blog.voters || 1,
      bestRating: 5,
      worstRating: 1,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(imageObjectSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ratingSchema),
        }}
      />
      <section className="container flex flex-col md:flex-row-reverse gap-5 py-4 overflow-hidden">
        <ShowBlog blog={blog} />
        <CuratedStoreWidget />
      </section>
    </>
  );
};

export default BlogDetails;
