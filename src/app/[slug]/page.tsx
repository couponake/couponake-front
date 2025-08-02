import React from "react";
import { api } from "@/components/MyAxios";
import { Blog } from "@/types";
import ShowBlog from "@/components/Pages/Blogs/show";
import { redirect } from "next/navigation";
import NotFound from "../not-found";
import { useSettingEnabled } from "@/hooks/useIndexingSettings";
import { SettingsEnum } from "@/types/settingsEnum";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  try {
    const response: any = await api.dynamic(`blogs/${slug}`);
    if (response.redirect_url) {
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

    const blog = response.blog as Blog;
    //get the indexing settings of the Blog page
    const indexingBlog = await useSettingEnabled(SettingsEnum.Blogs);

    return {
      title: blog?.blog_seo?.title,
      description: blog?.blog_seo?.description,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}${slug}/` || "",
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

  } catch (error) {
    return {
      title: "Error Loading Page",
      description: "An error occurred while loading this page",
    };
  }
}

const BlogDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = (await params).slug;
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;
  const response: any = await api.dynamic(`blogs/${slug}`);

  if (response.redirect_url) {
    redirect(response.redirect_url);
  }

  if (response?.status === 'error' || !response?.blog) {
    return NotFound();
  }

  const blog = response.blog as Blog;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}${encodeURIComponent(blog?.slug)}`,
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
      name: "الأفضل",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}AlafdalNewLogo.webp`,
        width: 600,
        height: 60,
      },
    },
    datePublished: blog?.created_at,
    dateModified: blog?.updated_at || blog?.created_at,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: parseFloat(blog.rate) || 1,
      ratingCount: blog.voters || 1,
      bestRating: 5,
      worstRating: 1,
    },
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
      name: "الأفضل",
      url: baseUrl,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: blog?.image || `${baseUrl}noPreview.webp`,
    },
    datePublished: blog?.created_at,
    dateModified: blog?.updated_at || blog?.created_at,
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
      <ShowBlog blog={blog} />
    </>
  );

};

export default BlogDetails;
