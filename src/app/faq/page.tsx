import FAQPage from '@/components/Pages/FAQ';
import api from '@/lib/api';
import { FaqItem } from '@/types';
import { cookies } from 'next/headers';
import React from 'react';

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "ar";
  const isArabic = locale === "ar";

  //get the indexing settings of the FAQs page
  // const indexingFAQ = await getSettingEnabled(SettingsEnum.FAQ);

  return {
    title: isArabic
      ? "الاسئلة المتكررة: كل اسئلة العملاء والاجابة عليها هنا"
      : "Frequently Asked Questions: All customer questions and answers here",
    description: isArabic
      ? "اليكم جميع ما يسال عنه العملاء المهتمين باكواد الخصم والكوبونات وعروض المتاجر في الشرق الاوسط مع الاجابات الصحيحة لها"
      : "Here are all the questions customers interested in discount codes, coupons, and store offers in the Middle East ask, along with the correct answers.",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}faq/` || "",
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: isArabic
        ? "الاسئلة المتكررة: كل اسئلة العملاء والاجابة عليها هنا"
        : "Frequently Asked Questions: All customer questions and answers here",
      description: isArabic
        ? "اليكم جميع ما يسال عنه العملاء المهتمين باكواد الخصم والكوبونات وعروض المتاجر في الشرق الاوسط مع الاجابات الصحيحة لها"
        : "Here are all the questions customers interested in discount codes, coupons, and store offers in the Middle East ask, along with the correct answers.",
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
        ? "الاسئلة المتكررة: كل اسئلة العملاء والاجابة عليها هنا"
        : "Frequently Asked Questions: All customer questions and answers here",
      description: isArabic
        ? "اليكم جميع ما يسال عنه العملاء المهتمين باكواد الخصم والكوبونات وعروض المتاجر في الشرق الاوسط مع الاجابات الصحيحة لها"
        : "Here are all the questions customers interested in discount codes, coupons, and store offers in the Middle East ask, along with the correct answers.",
      images: [
        {
          url: "https://coupoonat.com/coupoonatLogo.webp",
          alt: "Coupoonat Logo",
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
    name: "الاسئلة المتكررة: كل اسئلة العملاء والاجابة عليها هنا",
    description: "اليكم جميع ما يسال عنه العملاء المهتمين باكواد الخصم والكوبونات وعروض المتاجر في الشرق الاوسط مع الاجابات الصحيحة لها",
    url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}faq/`,
    image: "https://coupoonat.com/coupoonatLogo.webp",
    publisher: {
      "@type": "Organization",
      name: "كوبونات",
      logo: {
        "@type": "ImageObject",
        url: "https://coupoonat.com/coupoonatLogo.webp",
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
        name: "كوبونات",
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
