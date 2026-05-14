import api from '@/lib/api';
import { secureHtmlLinks } from '@/lib/htmlUtils';
import { getSettingEnabled } from '@/services/getIndexingSettings';
import { SettingsEnum } from '@/types/settingsEnum';
import { cookies } from 'next/headers';
import React from 'react';

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "ar";
  const isArabic = locale === "ar";

  //get the indexing settings of the PRIVACY page
  const indexingPrivacy = await getSettingEnabled(SettingsEnum.Privacy);

  return {
    title: isArabic
      ? "سياسة الخصوصية لتتعرف على امانك اثناء زيارتك |كوبونات"
      : "Coupoonat | Privacy Policy & Data Protection",
    description: isArabic
      ? "اعرف كيف نحمي بياناتك ونضمن سرية معلوماتك أثناء التصفح"
      : "Learn how we protect your data and keep your information secure",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}privacy-policy/` || "",
    },
    robots: {
      index: indexingPrivacy,
      follow: indexingPrivacy,
    },
    openGraph: {
      title: isArabic
        ? "سياسة الخصوصية لتتعرف على امانك اثناء زيارتك |كوبونات"
        : "Coupoonat | Privacy Policy & Data Protection",
      description: isArabic
        ? "اعرف كيف نحمي بياناتك ونضمن سرية معلوماتك أثناء التصفح"
        : "Learn how we protect your data and keep your information secure",
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
        ? "سياسة الخصوصية لتتعرف على امانك اثناء زيارتك |كوبونات"
        : "Coupoonat | Privacy Policy & Data Protection",
      description: isArabic
        ? "اعرف كيف نحمي بياناتك ونضمن سرية معلوماتك أثناء التصفح"
        : "Learn how we protect your data and keep your information secure",
      images: [
        {
          url: "https://coupoonat.com/coupoonatLogo.webp",
          alt: "Coupoonat Logo",
        },
      ],
    },
  };
}

const PrivacyPage = async () => {
  const response: any = await api.dynamic(`home/page/privacy-policy`);
  const page = response.data as {
    title: string;
    content: string;
    created_at?: string;
  };
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "ar";

  const privacyPolicySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${process.env.NEXT_PUBLIC_WEBSITE_URL}privacy-policy/#webpage`,
    name: "سياسة الخصوصية لتتعرف على امانك اثناء زيارتك |كوبونات",
    url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}privacy-policy/`,
    description: "اعرف كيف نحمي بياناتك ونضمن سرية معلوماتك أثناء التصفح",
    datePublished: page.created_at
      ? new Date(page.created_at).toISOString()
      : undefined,
    dateModified: page.created_at
      ? new Date(page.created_at).toISOString()
      : undefined,
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
          name: "سياسة الخصوصية",
          item: `${process.env.NEXT_PUBLIC_WEBSITE_URL}privacy-policy/`,
        },
      ],
    },
    mainEntity: {
      "@type": "Article",
      "@id": `${process.env.NEXT_PUBLIC_WEBSITE_URL}privacy-policy/#article`,
      headline: "سياسة الخصوصية لتتعرف على امانك اثناء زيارتك |كوبونات",
      description: "اعرف كيف نحمي بياناتك ونضمن سرية معلوماتك أثناء التصفح",
      datePublished: page.created_at
        ? new Date(page.created_at).toISOString()
        : undefined,
      dateModified: page.created_at
        ? new Date(page.created_at).toISOString()
        : undefined,
      image: "https://coupoonat.com/coupoonatLogo.webp",
      author: {
        "@type": "Organization",
        name: "كوبونات",
        url: process.env.NEXT_PUBLIC_WEBSITE_URL,
      },
      publisher: {
        "@type": "Organization",
        name: "كوبونات",
        logo: {
          "@type": "ImageObject",
          url: "https://coupoonat.com/coupoonatLogo.webp",
        },
      },
      articleBody: secureHtmlLinks(page.content as string),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(privacyPolicySchema),
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
      </main>
    </>
  );
};

export default PrivacyPage;
