import BlogsList from "@/components/Pages/Blogs";
import api from "@/lib/api";
import { Blog } from "@/types";
import { getTranslations } from "next-intl/server";
import { getSettingEnabled } from '@/services/getIndexingSettings';
import { SettingsEnum } from '@/types/settingsEnum';
import CuratedStoreWidget from "@/components/shared/CuratedStoreWidget";
import JsonLd from "@/components/shared/JsonLd";
import { HOME_CRUMB, ORG_ID, SITE_URL, absoluteUrl, breadcrumbNode, buildGraph, ref, webPageNode } from "@/lib/structured-data";

export async function generateMetadata() {
  const locale = "ar"; // site renders in Arabic only (static)
  const isArabic = locale === "ar";
  //get the indexing settings of the Blogs page
  const indexingBlogs = await getSettingEnabled(SettingsEnum.Blogs);

  return {
    title: isArabic ? "مدونة كوبوناك: طرق توفّر بها أكثر في كل طلب" : "Couponake blog: practical ways to save more on every order",
    description: isArabic ? "شروحات عملية: كيف تجمع كودين، متى تشتري، ما الفرق بين التطبيق والموقع، ومراجعات صادقة للمتاجر قبل أن تدفع." : "Hands-on guides: stacking codes, when to buy, app vs website, and honest store reviews before you pay.",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}blog/` || "",
    },
    robots: {
      index: indexingBlogs,
    },
    openGraph: {
      title: isArabic ? "مدونة كوبوناك: طرق توفّر بها أكثر في كل طلب" : "Couponake blog: practical ways to save more on every order",
      description: isArabic ? "شروحات عملية: كيف تجمع كودين، متى تشتري، ما الفرق بين التطبيق والموقع، ومراجعات صادقة للمتاجر قبل أن تدفع." : "Hands-on guides: stacking codes, when to buy, app vs website, and honest store reviews before you pay.",
      images: [
        {
          url: "https://couponake.com/couponak-logo.svg",
          alt: "Couponake Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isArabic ? "مدونة كوبوناك: طرق توفّر بها أكثر في كل طلب" : "Couponake blog: practical ways to save more on every order",
      description: isArabic ? "شروحات عملية: كيف تجمع كودين، متى تشتري، ما الفرق بين التطبيق والموقع، ومراجعات صادقة للمتاجر قبل أن تدفع." : "Hands-on guides: stacking codes, when to buy, app vs website, and honest store reviews before you pay.",
      images: [
        {
          url: "https://couponake.com/couponak-logo.svg",
          alt: "Couponake Logo",
        },
      ],
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale;
  const blogs: any = await api.static("blogs");
  const t = await getTranslations({ locale });

  const blogUrl = `${SITE_URL}blog/`;
  const posts: Blog[] = Array.isArray(blogs?.blogs) ? blogs.blogs.slice(0, 10) : [];

  // CollectionPage (the listing) whose main entity is the Blog; the posts are
  // the ones visible in the first page of the list. Name/description mirror
  // this page's <title> and meta description.
  const graph = buildGraph([
    webPageNode({
      type: "CollectionPage",
      url: blogUrl,
      name: "مدونة كوبوناك: طرق توفّر بها أكثر في كل طلب",
      description:
        "شروحات عملية: كيف تجمع كودين، متى تشتري، ما الفرق بين التطبيق والموقع، ومراجعات صادقة للمتاجر قبل أن تدفع.",
      extra: { mainEntity: ref(`${blogUrl}#blog`) },
    }),
    {
      "@type": "Blog",
      "@id": `${blogUrl}#blog`,
      name: "مدونة كوبوناك",
      url: blogUrl,
      inLanguage: "ar",
      publisher: ref(ORG_ID),
      ...(posts.length
        ? {
            blogPost: posts.map((post) => ({
              "@type": "BlogPosting",
              "@id": `${absoluteUrl(`${post.slug}/`)}#article`,
              headline: post.title,
              url: absoluteUrl(`${post.slug}/`),
              datePublished: post.created_at,
              dateModified: post.content_updated_at || post.created_at,
              author: ref(ORG_ID),
              ...(post.image ? { image: post.image } : {}),
            })),
          }
        : {}),
    },
    breadcrumbNode(blogUrl, [HOME_CRUMB, { name: "المدونة", url: blogUrl }]),
  ]);

  return (
    <>
      <JsonLd data={graph} />
     <section className="px-0 py-18 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
        <div className="container mx-auto flex flex-col md:flex-row-reverse gap-5">
          <div className="w-full max-w-5xl overflow-hidden">
            <div className="w-full mx-auto text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-clip bg-clip-text text-transparent bg-gradient-to-r from-main-300 to-main-500">
                {t("Our Blog")}
              </h1>
              <div className="mt-8 w-24 h-1 bg-main-500 mx-auto rounded-full"></div>
            </div>

            {/* The API returns blogs as an array; pass it explicitly so the first page renders on the server */}
            <BlogsList blogs={blogs?.blogs ?? null} pagination={blogs?.pagination} />
          </div>
          <CuratedStoreWidget />
        </div>
      </section>
    </>
  );
}
