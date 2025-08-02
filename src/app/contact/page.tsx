import ContactUsPage from '@/components/Pages/ContactUsPage';
import { useSettingEnabled } from '@/hooks/useIndexingSettings';
import { SettingsEnum } from '@/types/settingsEnum';
import { cookies } from 'next/headers';
import React from 'react';

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "ar";
  const isArabic = locale === "ar";

  //get the indexing settings of the CONTACT page
  const indexingContact = await useSettingEnabled(SettingsEnum.Contact);

  return {
    title: isArabic
      ? "تواصل معنا: لارسال الاقتراحات والشكاوى للكوبونات |الأفضل"
      : "Contact Us | Alafdal Coupons",
    description: isArabic
      ? "نستقبل استفساراتك وملاحظاتك عن الكوبونات عبر جميع القنوات"
      : "Send your coupon questions or feedback through any channel",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}contact/` || "",
    },
    robots: {
      index: indexingContact,
    },
    openGraph: {
      title: isArabic
        ? "تواصل معنا: لارسال الاقتراحات والشكاوى للكوبونات |الأفضل"
        : "Contact Us | Alafdal Coupons",
      description: isArabic
        ? "نستقبل استفساراتك وملاحظاتك عن الكوبونات عبر جميع القنوات"
        : "Send your coupon questions or feedback through any channel",
      images: [
        {
          url: "https://el-afdl.com/AlafdalNewLogo.webp",
          alt: "Alafdal Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isArabic
        ? "تواصل معنا: لارسال الاقتراحات والشكاوى للكوبونات |الأفضل"
        : "Contact Us | Alafdal Coupons",
      description: isArabic
        ? "نستقبل استفساراتك وملاحظاتك عن الكوبونات عبر جميع القنوات"
        : "Send your coupon questions or feedback through any channel",
      images: [
        {
          url: "https://el-afdl.com/AlafdalNewLogo.webp",
          alt: "Alafdal Logo",
        },
      ],
    },
  };
}

const ContactPage = async () => {
  return <ContactUsPage />;
};

export default ContactPage;
