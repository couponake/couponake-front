import FAQPage from '@/components/Pages/FAQ';
import api from '@/lib/api';
import { FaqItem } from '@/types';
import React from 'react';
import { getSettingEnabled } from '@/services/getIndexingSettings';
import { SettingsEnum } from '@/types/settingsEnum';

export async function generateMetadata() {
  const locale = "ar"; // site renders in Arabic only (static)
  const isArabic = locale === "ar";

  //get the indexing settings of the FAQs page
  const indexingFAQ = await getSettingEnabled(SettingsEnum.FAQ);

  return {
    title: isArabic
      ? "الاسئلة المتكررة: كل اسئلة العملاء والاجابة عليها هنا"
      : "Frequently Asked Questions: All customer questions and answers here",
    description: isArabic
      ? "اليكم جميع ما يسال عنه العملاء المهتمين باكواد الخصم والكوبونك وعروض المتاجر في الشرق الاوسط مع الاجابات الصحيحة لها"
      : "Here are all the questions customers interested in discount codes, coupons, and store offers in the Middle East ask, along with the correct answers.",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}faq/` || "",
    },
    robots: {
      index: indexingFAQ,
    },
    openGraph: {
      title: isArabic
        ? "الاسئلة المتكررة: كل اسئلة العملاء والاجابة عليها هنا"
        : "Frequently Asked Questions: All customer questions and answers here",
      description: isArabic
        ? "اليكم جميع ما يسال عنه العملاء المهتمين باكواد الخصم والكوبونك وعروض المتاجر في الشرق الاوسط مع الاجابات الصحيحة لها"
        : "Here are all the questions customers interested in discount codes, coupons, and store offers in the Middle East ask, along with the correct answers.",
      images: [
        {
          url: "https://couponake.com/couponakeLogo.webp",
          alt: "Couponake Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isArabic
        ? "الاسئلة المتكررة: كل اسئلة العملاء والاجابة عليها هنا"
        : "Frequently Asked Questions: All customer questions and answers here",
      description: isArabic
        ? "اليكم جميع ما يسال عنه العملاء المهتمين باكواد الخصم والكوبونك وعروض المتاجر في الشرق الاوسط مع الاجابات الصحيحة لها"
        : "Here are all the questions customers interested in discount codes, coupons, and store offers in the Middle East ask, along with the correct answers.",
      images: [
        {
          url: "https://couponake.com/couponakeLogo.webp",
          alt: "Couponake Logo",
        },
      ],
    },
  };
}

const FAQ = async () => {
  const data: { data: FaqItem[] } = await api.static("home/faqs", 3600);
  const FAQSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${process.env.NEXT_PUBLIC_WEBSITE_URL}faq/#faqpage`,
    name: "الاسئلة المتكررة: كل اسئلة العملاء والاجابة عليها هنا",
    description: "اليكم جميع ما يسال عنه العملاء المهتمين باكواد الخصم والكوبونك وعروض المتاجر في الشرق الاوسط مع الاجابات الصحيحة لها",
    url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}faq/`,
    image: "https://couponake.com/couponakeLogo.webp",
    publisher: {
      "@type": "Organization",
      name: "كوبونك",
      logo: {
        "@type": "ImageObject",
        url: "https://couponake.com/couponakeLogo.webp",
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
        name: "كوبونك",
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
