import BlogsList from "@/components/Pages/Blogs";
import { useSettingEnabled } from "@/hooks/useIndexingSettings";
import api from "@/lib/api";
import { Blog } from "@/types";
import { SettingsEnum } from "@/types/settingsEnum";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "ar";
  const isArabic = locale === "ar";
  //get the indexing settings of the Blogs page
  const indexingBlogs = await useSettingEnabled(SettingsEnum.Blogs);

  return {
    title: isArabic
      ? "المدونة: احدث اخبار متاجر التسوق في السعودية |كوبونات"
      : "Blog: Latest News on Saudi Shopping Stores | Coupoonat",
    description: isArabic
      ? "تابع آخر العروض والتحديثات وتحليلات السوق للمتاجر السعودية"
      : "Stay updated with deals, store updates, and market insights in KSA",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}blog/` || "",
    },
    robots: {
      index: indexingBlogs,
    },
    openGraph: {
      title: isArabic
        ? "المدونة: احدث اخبار متاجر التسوق في السعودية |كوبونات"
        : "Blog: Latest News on Saudi Shopping Stores | Coupoonat",
      description: isArabic
        ? "تابع آخر العروض والتحديثات وتحليلات السوق للمتاجر السعودية"
        : "Stay updated with deals, store updates, and market insights in KSA",
      images: [
        {
          url: "https://couponalyom.com/coupoonatLogo.webp",
          alt: "Coupoonat Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isArabic
        ? "المدونة: احدث اخبار متاجر التسوق في السعودية |كوبونات"
        : "Blog: Latest News on Saudi Shopping Stores | Coupoonat",
      description: isArabic
        ? "تابع آخر العروض والتحديثات وتحليلات السوق للمتاجر السعودية"
        : "Stay updated with deals, store updates, and market insights in KSA",
      images: [
        {
          url: "https://couponalyom.com/coupoonatLogo.webp",
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
    name: "المدونة: احدث اخبار متاجر التسوق في السعودية |كوبونات",
    description: "تابع آخر العروض والتحديثات وتحليلات السوق للمتاجر السعودية",
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
      <section className="bg-gradient-to-b from-white to-gray-50 -mt-5">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-clip bg-clip-text text-transparent bg-gradient-to-r from-main-300 to-main-500">
              {t("Our Blog")}
            </h1>
            <div className="mt-8 w-24 h-1 bg-main-500 mx-auto rounded-full"></div>
          </div>

          <BlogsList {...blogs} />
        </div>
      </section>
    </>
  );
}
