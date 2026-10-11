import api from '@/lib/api';
import { secureHtmlLinks } from '@/lib/htmlUtils';
import React from 'react';
import { getSettingEnabled } from '@/services/getIndexingSettings';
import { SettingsEnum } from '@/types/settingsEnum';
import JsonLd from '@/components/shared/JsonLd';
import { HOME_CRUMB, SITE_URL, breadcrumbNode, buildGraph, webPageNode } from '@/lib/structured-data';

export async function generateMetadata() {
  const locale = "ar"; // site renders in Arabic only (static)
  const isArabic = locale === "ar";

  //get the indexing settings of the PRIVACY page
  const indexingPrivacy = await getSettingEnabled(SettingsEnum.Privacy);

  return {
    title: isArabic ? "سياسة الخصوصية | كوبوناك" : "Privacy policy | Couponake",
    description: isArabic ? "ما نجمعه عند زيارتك لكوبوناك، ولماذا، وكيف تحذفه." : "What Couponake collects when you visit, why, and how to delete it.",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}privacy-policy/` || "",
    },
    robots: {
      index: indexingPrivacy,
    },
    openGraph: {
      title: isArabic ? "سياسة الخصوصية | كوبوناك" : "Privacy policy | Couponake",
      description: isArabic ? "ما نجمعه عند زيارتك لكوبوناك، ولماذا، وكيف تحذفه." : "What Couponake collects when you visit, why, and how to delete it.",
      images: [
        {
          url: "https://couponake.com/couponak-logo.svg",
          alt: "Couponake Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isArabic ? "سياسة الخصوصية | كوبوناك" : "Privacy policy | Couponake",
      description: isArabic ? "ما نجمعه عند زيارتك لكوبوناك، ولماذا، وكيف تحذفه." : "What Couponake collects when you visit, why, and how to delete it.",
      images: [
        {
          url: "https://couponake.com/couponak-logo.svg",
          alt: "Couponake Logo",
        },
      ],
    },
  };
}

const PrivacyPage = async () => {
  const response: any = await api.static(`home/page/privacy-policy`, 3600);
  const page = response.data as {
    title: string;
    content: string;
    created_at?: string;
    updated_at?: string;
  };
  // The visible date and dateModified use updated_at (last real content edit).
  // created_at on these rows predates Couponake (rows were carried over and
  // rewritten on 2026-09-29), so showing it would be wrong.
  const shownDate = page.updated_at || page.created_at;
  const locale = "ar"; // site renders in Arabic only (static)

  const pageUrl = `${SITE_URL}privacy-policy/`;
  const graph = buildGraph([
    webPageNode({ url: pageUrl, name: page.title, dateModified: page.updated_at }),
    breadcrumbNode(pageUrl, [HOME_CRUMB, { name: "سياسة الخصوصية", url: pageUrl }]),
  ]);

  return (
    <>
      <JsonLd data={graph} />
      <main className="container mx-auto px-4 py-8 animate-fadeIn">
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
              {page.title}
            </h1>
            {shownDate && (
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                {new Date(shownDate).toLocaleDateString(
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
