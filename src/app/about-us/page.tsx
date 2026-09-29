import React from "react";
import api from "@/lib/api";
import { secureHtmlLinks } from "@/lib/htmlUtils";
import type { Article, BreadcrumbList } from "schema-dts";
import { getSettingEnabled } from "@/services/getIndexingSettings";
import { SettingsEnum } from "@/types/settingsEnum";

export async function generateMetadata() {
  const locale = "ar"; // site renders in Arabic only (static)
  const isArabic = locale === "ar";
  //get the indexing settings of the ABOUT page
  const indexingAbout = await getSettingEnabled(SettingsEnum.About);

  return {
    title: isArabic ? "من نحن: كيف نجرّب الأكواد قبل نشرها | كوبوناك" : "About us: how we test every code before publishing it | Couponake",
    description: isArabic ? "فريق صغير يجرّب كل كود قبل نشره ويحذفه أول ما يتوقف. اقرأ كيف نعمل، وكيف نربح، ولماذا لا ننشر كودًا لم يعمل معنا." : "A small team that tests every code before it goes live and removes it the moment it stops working. How we work and how we earn.",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}about-us/` || "",
    },
    robots: {
      index: indexingAbout,
    },
    openGraph: {
      title: isArabic ? "من نحن: كيف نجرّب الأكواد قبل نشرها | كوبوناك" : "About us: how we test every code before publishing it | Couponake",
      description: isArabic ? "فريق صغير يجرّب كل كود قبل نشره ويحذفه أول ما يتوقف. اقرأ كيف نعمل، وكيف نربح، ولماذا لا ننشر كودًا لم يعمل معنا." : "A small team that tests every code before it goes live and removes it the moment it stops working. How we work and how we earn.",
      images: [
        {
          url: "https://couponake.com/couponak-logo.svg",
          alt: "Couponake Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isArabic ? "من نحن: كيف نجرّب الأكواد قبل نشرها | كوبوناك" : "About us: how we test every code before publishing it | Couponake",
      description: isArabic ? "فريق صغير يجرّب كل كود قبل نشره ويحذفه أول ما يتوقف. اقرأ كيف نعمل، وكيف نربح، ولماذا لا ننشر كودًا لم يعمل معنا." : "A small team that tests every code before it goes live and removes it the moment it stops working. How we work and how we earn.",
      images: [
        {
          url: "https://couponake.com/couponak-logo.svg",
          alt: "Couponake Logo",
        },
      ],
    },
  };
}

const AboutUsPage = async () => {
  const response: any = await api.static(`home/page/about`, 3600);
  const page = response.data as {
    title: string;
    content: string;
    created_at?: string;
  };
  const locale = "ar"; // site renders in Arabic only (static)

  const articleSchema: Article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: "تعرف على رؤيتنا وفريق الخبراء وراء أفضل كوبونات الشراء",
    image: "https://couponake.com/couponak-logo.svg",
    author: {
      "@type": "Organization",
      name: "كوبوناك",
    },
    publisher: {
      "@type": "Organization",
      name: "كوبوناك",
      logo: {
        "@type": "ImageObject",
        url: "https://couponake.com/couponak-logo.svg",
      },
    },
    datePublished: page.created_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_WEBSITE_URL}about-us/`,
    },
  } as Article & { "@context": string };

  const breadcrumbSchema: BreadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "الرئيسية",
        item: process.env.NEXT_PUBLIC_WEBSITE_URL || "https://example.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.title,
        item: `${process.env.NEXT_PUBLIC_WEBSITE_URL}about-us/`,
      },
    ],
  } as BreadcrumbList & { "@context": string };

  return (
    <main className="container mx-auto px-4 py-8 animate-fadeIn">
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
            {page.title}
          </h1>
          {page.created_at && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              {new Date(page.created_at).toLocaleDateString(
                locale === 'ar' ? 'ar-SA' : 'en-US',
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }
              )}
            </div>
          )}
          <div
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-xl prose-img:shadow-lg transition-all duration-300"
            dangerouslySetInnerHTML={{
              __html: secureHtmlLinks(page.content as string),
            }}
          />
        </div>
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </main>
  );
};

export default AboutUsPage;
