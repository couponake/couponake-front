import FAQPage from '@/components/Pages/FAQ';
import { useSettingEnabled } from '@/hooks/useIndexingSettings';
import api from '@/lib/api';
import { FaqItem } from '@/types';
import { SettingsEnum } from '@/types/settingsEnum';
import { cookies } from 'next/headers';
import React from 'react';

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "ar";
  const isArabic = locale === "ar";

  //get the indexing settings of the FAQs page
  const indexingFAQ = await useSettingEnabled(SettingsEnum.FAQ);

  return {
    title: isArabic
      ? "الأسئلة الشائعة: لجميع عملاء التسوق في السعودية |الأفضل"
      : "FAQ | Alafdal",
    description: isArabic
      ? "أجوبة سريعة لأهم الأسئلة حول استخدام الكوبونات والتوفير"
      : "Quick answers to top questions on coupon use and saving money",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}faq/` || "",
    },
    robots: {
      index: indexingFAQ,
    },
    openGraph: {
      title: isArabic
        ? "الأسئلة الشائعة: لجميع عملاء التسوق في السعودية |الأفضل"
        : "FAQ | Alafdal",
      description: isArabic
        ? "أجوبة سريعة لأهم الأسئلة حول استخدام الكوبونات والتوفير"
        : "Quick answers to top questions on coupon use and saving money",
      images: [
        {
          url: "https://couponalyom.com/AlafdalNewLogo.webp",
          alt: "Alafdal Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isArabic
        ? "الأسئلة الشائعة: لجميع عملاء التسوق في السعودية |الأفضل"
        : "FAQ | Alafdal",
      description: isArabic
        ? "أجوبة سريعة لأهم الأسئلة حول استخدام الكوبونات والتوفير"
        : "Quick answers to top questions on coupon use and saving money",
      images: [
        {
          url: "https://couponalyom.com/AlafdalNewLogo.webp",
          alt: "Alafdal Logo",
        },
      ],
    },
  };
}

const FAQ = async () => {
  const data: { data: FaqItem[] } = await api.dynamic("home/faqs");
  const FAQSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${process.env.NEXT_PUBLIC_WEBSITE_URL}faq/#faqpage`,
    name: "الأسئلة الشائعة: لجميع عملاء التسوق في السعودية |الأفضل",
    description: "أجوبة سريعة لأهم الأسئلة حول استخدام الكوبونات والتوفير",
    url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}faq/`,
    image: "https://couponalyom.com/AlafdalNewLogo.webp",
    publisher: {
      "@type": "Organization",
      name: "الأفضل",
      logo: {
        "@type": "ImageObject",
        url: "https://couponalyom.com/AlafdalNewLogo.webp",
      },
    },
    mainEntity: data?.data.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer.replace(/<[^>]+>/g, ""),
        dateCreated: new Date().toISOString(),
      },
      author: {
        "@type": "Organization",
        name: "الأفضل",
      },
    })),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQSchema) }}
      />
      <FAQPage
        faqs={
          data?.data ? data?.data.filter((faq) => faq.store_id === null) : []
        }
      />
    </>
  );
};

export default FAQ;
