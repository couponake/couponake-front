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
    title: isArabic ? "أسئلة شائعة: لماذا لا يعمل الكود؟ وكيف تستخدمه — كوبوناك" : "FAQ: why a code fails and how to use it — Couponake",
    description: isArabic ? "إجابات مباشرة: أين يُكتب الكود، لماذا يُرفض، هل يُجمع مع العروض، وهل كوبوناك مجاني." : "Straight answers: where to enter the code, why it gets rejected, whether it stacks with offers, and whether Couponake is free.",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}faq/` || "",
    },
    robots: {
      index: indexingFAQ,
    },
    openGraph: {
      title: isArabic ? "أسئلة شائعة: لماذا لا يعمل الكود؟ وكيف تستخدمه — كوبوناك" : "FAQ: why a code fails and how to use it — Couponake",
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
      title: isArabic ? "أسئلة شائعة: لماذا لا يعمل الكود؟ وكيف تستخدمه — كوبوناك" : "FAQ: why a code fails and how to use it — Couponake",
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
  const FAQSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${process.env.NEXT_PUBLIC_WEBSITE_URL}faq/#faqpage`,
    name: "الاسئلة المتكررة: كل اسئلة العملاء والاجابة عليها هنا",
    description: "اليكم جميع ما يسال عنه العملاء المهتمين باكواد الخصم والكوبونات وعروض المتاجر في الشرق الاوسط مع الاجابات الصحيحة لها",
    url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}faq/`,
    image: "https://couponake.com/couponak-logo.svg",
    publisher: {
      "@type": "Organization",
      name: "كوبوناك",
      logo: {
        "@type": "ImageObject",
        url: "https://couponake.com/couponak-logo.svg",
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
        name: "كوبوناك",
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
