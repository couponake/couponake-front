import React from "react";
import api from "@/lib/api";
import moment from "moment";
import "moment/locale/ar";
import { secureHtmlLinks } from "@/lib/htmlUtils";
import { cookies } from "next/headers";
import type { Article, BreadcrumbList } from "schema-dts";
import { useSettingEnabled } from "@/hooks/useIndexingSettings";
import { SettingsEnum } from "@/types/settingsEnum";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "ar";
  const isArabic = locale === "ar";
  //get the indexing settings of the ABOUT page
  const indexingAbout = await useSettingEnabled(SettingsEnum.About);

  return {
    title: isArabic
      ? "من نحن: تعرف على فريق عمل كوبونات الخصم |كوبونات"
      : "About Us | Coupoonat Coupons",
    description: isArabic
      ? "تعرف على رؤيتنا وفريق الخبراء وراء أفضل كوبونات الشراء"
      : "Meet our vision and the experts delivering top shopping coupons",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}about-us/` || "",
    },
    robots: {
      index: indexingAbout,
    },
    openGraph: {
      title: isArabic
        ? "من نحن: تعرف على فريق عمل كوبونات الخصم |كوبونات"
        : "About Us | Coupoonat Coupons",
      description: isArabic
        ? "تعرف على رؤيتنا وفريق الخبراء وراء أفضل كوبونات الشراء"
        : "Meet our vision and the experts delivering top shopping coupons",
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
        ? "من نحن: تعرف على فريق عمل كوبونات الخصم |كوبونات"
        : "About Us | Coupoonat Coupons",
      description: isArabic
        ? "تعرف على رؤيتنا وفريق الخبراء وراء أفضل كوبونات الشراء"
        : "Meet our vision and the experts delivering top shopping coupons",
      images: [
        {
          url: "https://coupoonat.com/coupoonatLogo.webp",
          alt: "Coupoonat Logo",
        },
      ],
    },
  };
}

const AboutUsPage = async () => {
  const response: any = await api.dynamic(`home/page/about`);
  const page = response.data as {
    title: string;
    content: string;
    created_at?: string;
  };

  const articleSchema: Article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: "تعرف على رؤيتنا وفريق الخبراء وراء أفضل كوبونات الشراء",
    image: "https://coupoonat.com/coupoonatLogo.webp",
    author: {
      "@type": "Organization",
      name: "كوبونات",
    },
    publisher: {
      "@type": "Organization",
      name: "كوبونات",
      logo: {
        "@type": "ImageObject",
        url: "https://coupoonat.com/coupoonatLogo.webp",
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
              {moment(page.created_at).locale('ar').format("LL")}
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
