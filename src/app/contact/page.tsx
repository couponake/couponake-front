import ContactUsPage from '@/components/Pages/ContactUsPage';
import { cookies } from 'next/headers';
import React from 'react';
import { getSettingEnabled } from '@/services/getIndexingSettings';
import { SettingsEnum } from '@/types/settingsEnum';

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "ar";
  const isArabic = locale === "ar";

  //get the indexing settings of the CONTACT page
  const indexingContact = await getSettingEnabled(SettingsEnum.Contact);

  return {
    title: isArabic
      ? "اتصل بنا: تواصل مع ادارة موقع كوبونات من هنا بسهولة"
      : "Contact Us: Easily contact the Couponat website administration here.",
    description: isArabic
      ? "يمكنك الان التواصل مع ادارة موقع كوبونات من خلال هذة الصفحة فى حالة الاقتراحات او الشكاوي"
      : "You can now contact the Couponat website administration through this page for any suggestions or complaints.",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}contact/` || "",
    },
    robots: {
      index: indexingContact,
    },
    openGraph: {
      title: isArabic
        ? "اتصل بنا: تواصل مع ادارة موقع كوبونات من هنا بسهولة"
        : "Contact Us: Easily contact the Couponat website administration here.",
      description: isArabic
        ? "يمكنك الان التواصل مع ادارة موقع كوبونات من خلال هذة الصفحة فى حالة الاقتراحات او الشكاوي"
        : "You can now contact the Couponat website administration through this page for any suggestions or complaints.",
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
        ? "اتصل بنا: تواصل مع ادارة موقع كوبونات من هنا بسهولة"
        : "Contact Us: Easily contact the Couponat website administration here.",
      description: isArabic
        ? "يمكنك الان التواصل مع ادارة موقع كوبونات من خلال هذة الصفحة فى حالة الاقتراحات او الشكاوي"
        : "You can now contact the Couponat website administration through this page for any suggestions or complaints.",
      images: [
        {
          url: "https://coupoonat.com/coupoonatLogo.webp",
          alt: "Coupoonat Logo",
        },
      ],
    },
  };
}

const ContactPage = async () => {
  return <ContactUsPage />;
};

export default ContactPage;
