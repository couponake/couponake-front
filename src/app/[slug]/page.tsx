import { fetchApi } from "@/lib/api-result";
import ShowBlog from "@/components/Pages/Blogs/show";
import { Blog } from "@/types";
import { notFound, permanentRedirect } from "next/navigation";
import { getSettingEnabled } from "@/services/getIndexingSettings";
import { SettingsEnum } from "@/types/settingsEnum";

import CuratedStoreWidget from "@/components/shared/CuratedStoreWidget";
import JsonLd from "@/components/shared/JsonLd";
import {
  HOME_CRUMB,
  ORG_ID,
  SITE_URL,
  absoluteUrl,
  breadcrumbNode,
  buildGraph,
  ref,
  stripBrandSuffix,
  webPageNode,
} from "@/lib/structured-data";

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
    return { title: "كوبوناك", description: "كوبوناك" };
  }

  {
    const blog = response.data.blog;
    //get the indexing settings of the Blog page
    const indexingBlog = await getSettingEnabled(SettingsEnum.Blogs);

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
  }
}

const BlogDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = (await params).slug;
  // fetchApi tells a missing post (API 404 → real 404 here) apart from an API
  // failure (thrown → uncached 500), so a service hiccup is never cached as 404.
  const response = await fetchApi<{ blog: Blog }>(`blogs/${slug}`, {
    revalidate: BLOG_REVALIDATE,
  });

  if (response.kind === "redirect") {
    permanentRedirect(response.redirect_url);
  }

  // Unknown slug (bot probes like /wp-login.php, deleted or unpublished posts):
  // a real 404 status, not the not-found UI rendered as a 200 page (soft 404).
  if (response.kind !== "ok" || !response.data?.blog) {
    notFound();
  }

  const blog = response.data.blog;

  // One @graph: WebPage + BlogPosting (author/publisher = the Couponake
  // organization, no invented personas) + BreadcrumbList. The former extra
  // `Product` node with an AggregateRating (added only to get stars on an
  // article) was removed: it is misleading markup under Google's policies.
  // Same form as the canonical in generateMetadata (raw slug + trailing slash).
  const url = absoluteUrl(`${blog.slug}/`);
  const headline = stripBrandSuffix(blog?.blog_seo?.title || blog?.title);
  const image = blog?.image || undefined;
  const dateModified = blog?.content_updated_at || blog?.created_at;

  const graph = buildGraph([
    webPageNode({
      url,
      name: blog?.title,
      description: blog?.blog_seo?.description,
      datePublished: blog?.created_at,
      dateModified,
      extra: image ? { primaryImageOfPage: { "@type": "ImageObject", url: image } } : undefined,
    }),
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline,
      description: blog?.blog_seo?.description || undefined,
      ...(image ? { image } : {}),
      inLanguage: "ar",
      datePublished: blog?.created_at,
      dateModified,
      author: ref(ORG_ID),
      publisher: ref(ORG_ID),
      mainEntityOfPage: ref(`${url}#webpage`),
      isPartOf: ref(`${url}#webpage`),
    },
    breadcrumbNode(url, [
      HOME_CRUMB,
      { name: "المدونة", url: `${SITE_URL}blog/` },
      { name: blog?.title, url },
    ]),
  ]);

  return (
    <>
      <JsonLd data={graph} />
      <section className="container flex flex-col md:flex-row-reverse gap-5 py-4 overflow-hidden">
        <ShowBlog blog={blog} />
        <CuratedStoreWidget />
      </section>
    </>
  );
};

export default BlogDetails;
