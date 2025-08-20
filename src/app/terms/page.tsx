import { useSettingEnabled } from "@/hooks/useIndexingSettings";
import api from "@/lib/api";
import { secureHtmlLinks } from "@/lib/htmlUtils";
import { SettingsEnum } from "@/types/settingsEnum";
import moment from "moment";
import { cookies } from "next/headers";
import React from "react";
import "moment/locale/ar";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "ar";
  const isArabic = locale === "ar";

  //get the indexing settings of the Terms page
  const indexingTerms = await useSettingEnabled(SettingsEnum.Terms);


  return {
    title: isArabic
      ? "شروط الاستخدام اللازمة لاستخدام وزيارة موقع كوبونات"
      : "Terms of Use | Coupoonat",
    description: isArabic
      ? "اقرأ قواعد استخدام الموقع وحقوقك وواجباتك كمستخدم"
      : "Review site rules, your rights, and obligations as a user",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}terms/` || "",
    },
    robots: {
      index: indexingTerms,
    },
    openGraph: {
      title: isArabic
        ? "شروط الاستخدام اللازمة لاستخدام وزيارة موقع كوبونات"
        : "Terms of Use | Coupoonat",
      description: isArabic
        ? "اقرأ قواعد استخدام الموقع وحقوقك وواجباتك كمستخدم"
        : "Review site rules, your rights, and obligations as a user",
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
        ? "شروط الاستخدام اللازمة لاستخدام وزيارة موقع كوبونات"
        : "Terms of Use | Coupoonat",
      description: isArabic
        ? "اقرأ قواعد استخدام الموقع وحقوقك وواجباتك كمستخدم"
        : "Review site rules, your rights, and obligations as a user",
      images: [
        {
          url: "https://couponalyom.com/coupoonatLogo.webp",
          alt: "Coupoonat Logo",
        },
      ],
    },
  };
}

const TermsPage = async () => {
  const response: any = await api.dynamic(`home/page/terms`);
  const page = response.data as {
    title: string;
    content: string;
    created_at?: string;
  };

  const termsSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${process.env.NEXT_PUBLIC_WEBSITE_URL}terms/#webpage`,
        name: "شروط الاستخدام اللازمة لاستخدام وزيارة موقع كوبونات",
        url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}terms/`,
        description: "اقرأ قواعد استخدام الموقع وحقوقك وواجباتك كمستخدم",
        datePublished: page.created_at
          ? new Date(page.created_at).toISOString()
          : undefined,
        dateModified: page.created_at
          ? new Date(page.created_at).toISOString()
          : undefined,
        image: "https://couponalyom.com/coupoonatLogo.webp",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "الرئيسية",
              item: process.env.NEXT_PUBLIC_WEBSITE_URL,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "شروط الاستخدام",
              item: `${process.env.NEXT_PUBLIC_WEBSITE_URL}terms/`,
            },
          ],
        },
      },
      {
        "@type": "Legislation",
        "@id": `${process.env.NEXT_PUBLIC_WEBSITE_URL}terms/#legislation`,
        name: "شروط الاستخدام اللازمة لاستخدام وزيارة موقع كوبونات",
        description: "اقرأ قواعد استخدام الموقع وحقوقك وواجباتك كمستخدم",
        dateCreated: page.created_at
          ? new Date(page.created_at).toISOString()
          : undefined,
        dateModified: page.created_at
          ? new Date(page.created_at).toISOString()
          : undefined,
        url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}terms/`,
        jurisdiction: {
          "@type": "AdministrativeArea",
          name: "Egypt",
          identifier: "EG",
        },
        legislationType: "Terms of Use",
        publisher: {
          "@type": "Organization",
          name: "كوبونات",
          logo: {
            "@type": "ImageObject",
            url: "https://couponalyom.com/coupoonatLogo.webp",
          },
        },
        isPartOf: {
          "@id": `${process.env.NEXT_PUBLIC_WEBSITE_URL}terms/#webpage`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(termsSchema),
        }}
      />
      <main className="container mx-auto px-4 py-8 animate-fadeIn">
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
              {page.title}
            </h1>
            {page.created_at && (
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                {moment(page.created_at).locale("ar").format("LL")}
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
      </main>
    </>
  );
};

export default TermsPage;
