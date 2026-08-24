import BlogsList from "@/components/Pages/Blogs";
import api from "@/lib/api";
import { Blog } from "@/types";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { getSettingEnabled } from '@/services/getIndexingSettings';
import { SettingsEnum } from '@/types/settingsEnum';
import CuratedStoreWidget from "@/components/shared/CuratedStoreWidget";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "ar";
  const isArabic = locale === "ar";
  //get the indexing settings of the Blogs page
  const indexingBlogs = await getSettingEnabled(SettingsEnum.Blogs);

  return {
    title: isArabic
      ? "مدونة موقع كوبونات لجميع اخبار متاجر التسوق"
      : "Couponat's blog for all the latest shopping news",
    description: isArabic
      ? "هنا تجد كل ما تبحث عنه من معلومات حول المتاجر وخدماتها واحدث العروض والمنتجات لديهم"
      : "Here you'll find everything you need to know about stores, their services, and the latest offers and products",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}blog/` || "",
    },
    robots: {
      index: indexingBlogs,
    },
    openGraph: {
      title: isArabic
        ? "مدونة موقع كوبونات لجميع اخبار متاجر التسوق"
        : "Couponat's blog for all the latest shopping news",
      description: isArabic
        ? "هنا تجد كل ما تبحث عنه من معلومات حول المتاجر وخدماتها واحدث العروض والمنتجات لديهم"
        : "Here you'll find everything you need to know about stores, their services, and the latest offers and products",
      images: [
        {
          url: "https://coupoonat.com/coupoonatLogo.webp",
          alt: "Coupoonat Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isArabic
        ? "مدونة موقع كوبونات لجميع اخبار متاجر التسوق"
        : "Couponat's blog for all the latest shopping news",
      description: isArabic
        ? "هنا تجد كل ما تبحث عنه من معلومات حول المتاجر وخدماتها واحدث العروض والمنتجات لديهم"
        : "Here you'll find everything you need to know about stores, their services, and the latest offers and products",
      images: [
        {
          url: "https://coupoonat.com/coupoonatLogo.webp",
          alt: "Coupoonat Logo",
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
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "مدونة موقع كوبونات لجميع اخبار متاجر التسوق",
    description: "هنا تجد كل ما تبحث عنه من معلومات حول المتاجر وخدماتها واحدث العروض والمنتجات لديهم",
    url: `${baseUrl}blog/`,
    isPartOf: {
      "@type": "WebSite",
      url: baseUrl,
    },
    blogPost: blogs?.blogs?.slice(0, 5).map((post: Blog) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${baseUrl}${post.slug}`,
      datePublished: post.created_at,
      dateModified: post.updated_at || post.created_at,
      author: {
        "@type": "Organization",
        name: "كوبونات",
      },
      image: {
        "@type": "ImageObject",
        url: post.image || `${baseUrl}coupoonatLogo.webp`,
      },
    })),
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
    ],
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "كوبونات",
    url: baseUrl,
    logo: `${baseUrl}coupoonatLogo.webp`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
     <section className="px-0 py-18 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
        <div className="container mx-auto flex flex-col md:flex-row-reverse gap-5">
          <div className="w-full max-w-5xl overflow-hidden">
            <div className="w-full mx-auto text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-clip bg-clip-text text-transparent bg-gradient-to-r from-main-300 to-main-500">
                {t("Our Blog")}
              </h1>
              <div className="mt-8 w-24 h-1 bg-main-500 mx-auto rounded-full"></div>
            </div>

            <BlogsList {...blogs} />
          </div>
          <CuratedStoreWidget />
        </div>
      </section>
    </>
  );
}
