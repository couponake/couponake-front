import FAQPage from '@/components/Pages/FAQ';
import api from '@/lib/api';
import { FaqItem } from '@/types';
import React from 'react';
import { getSettingEnabled } from '@/services/getIndexingSettings';
import { SettingsEnum } from '@/types/settingsEnum';
import JsonLd from '@/components/shared/JsonLd';
import { HOME_CRUMB, SITE_URL, breadcrumbNode, buildGraph, plainText, webPageNode } from '@/lib/structured-data';

export async function generateMetadata() {
  const locale = "ar"; // site renders in Arabic only (static)
  const isArabic = locale === "ar";

  //get the indexing settings of the FAQs page
  const indexingFAQ = await getSettingEnabled(SettingsEnum.FAQ);

  return {
    title: isArabic ? "أسئلة شائعة: لماذا لا يعمل الكود؟ وكيف تستخدمه | كوبوناك" : "FAQ: why a code fails and how to use it | Couponake",
    description: isArabic ? "إجابات مباشرة: أين يُكتب الكود، لماذا يُرفض، هل يُجمع مع العروض، وهل كوبوناك مجاني." : "Straight answers: where to enter the code, why it gets rejected, whether it stacks with offers, and whether Couponake is free.",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}faq/` || "",
    },
    robots: {
      index: indexingFAQ,
    },
    openGraph: {
      title: isArabic ? "أسئلة شائعة: لماذا لا يعمل الكود؟ وكيف تستخدمه | كوبوناك" : "FAQ: why a code fails and how to use it | Couponake",
      description: isArabic ? "إجابات مباشرة: أين يُكتب الكود، لماذا يُرفض، هل يُجمع مع العروض، وهل كوبوناك مجاني." : "Straight answers: where to enter the code, why it gets rejected, whether it stacks with offers, and whether Couponake is free.",
      images: [
        {
          url: "https://couponake.com/couponak-logo.svg",
          alt: "Couponake Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isArabic ? "أسئلة شائعة: لماذا لا يعمل الكود؟ وكيف تستخدمه | كوبوناك" : "FAQ: why a code fails and how to use it | Couponake",
      description: isArabic ? "إجابات مباشرة: أين يُكتب الكود، لماذا يُرفض، هل يُجمع مع العروض، وهل كوبوناك مجاني." : "Straight answers: where to enter the code, why it gets rejected, whether it stacks with offers, and whether Couponake is free.",
      images: [
        {
          url: "https://couponake.com/couponak-logo.svg",
          alt: "Couponake Logo",
        },
      ],
    },
  };
}

const FAQ = async () => {
  const data: { data: FaqItem[] } = await api.static("home/faqs", 3600);
  // Markup = exactly the questions the page shows (site-wide FAQs only). With
  // no questions the page is a plain WebPage: an empty FAQPage is invalid.
  const faqs = Array.isArray(data?.data)
    ? data.data.filter((faq) => faq.store_id === null)
    : [];
  const pageUrl = `${SITE_URL}faq/`;
  const graph = buildGraph([
    webPageNode({
      type: faqs.length ? "FAQPage" : "WebPage",
      url: pageUrl,
      name: "أسئلة شائعة: لماذا لا يعمل الكود؟ وكيف تستخدمه",
      extra: faqs.length
        ? {
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: plainText(faq.question),
              acceptedAnswer: { "@type": "Answer", text: plainText(faq.answer) },
            })),
          }
        : undefined,
    }),
    breadcrumbNode(pageUrl, [HOME_CRUMB, { name: "الأسئلة الشائعة", url: pageUrl }]),
  ]);
  return (
    <>
      <JsonLd data={graph} />
      <FAQPage faqs={faqs} />
    </>
  );
};

export default FAQ;
