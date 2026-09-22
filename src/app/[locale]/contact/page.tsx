import ContactUsPage from '@/components/Pages/ContactUsPage';
import React from 'react';
import { getSettingEnabled } from '@/services/getIndexingSettings';
import { SettingsEnum } from '@/types/settingsEnum';

export async function generateMetadata() {
  const locale = "ar"; // site renders in Arabic only (static)
  const isArabic = locale === "ar";

  //get the indexing settings of the CONTACT page
  const indexingContact = await getSettingEnabled(SettingsEnum.Contact);

  return {
    title: isArabic
      ? "اتصل بنا: تواصل مع ادارة موقع كوبونك من هنا بسهولة"
      : "Contact Us: Easily contact the Couponat website administration here.",
    description: isArabic
      ? "يمكنك الان التواصل مع ادارة موقع كوبونك من خلال هذة الصفحة فى حالة الاقتراحات او الشكاوي"
      : "You can now contact the Couponat website administration through this page for any suggestions or complaints.",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}contact/` || "",
    },
    robots: {
      index: indexingContact,
    },
    openGraph: {
      title: isArabic
        ? "اتصل بنا: تواصل مع ادارة موقع كوبونك من هنا بسهولة"
        : "Contact Us: Easily contact the Couponat website administration here.",
      description: isArabic
        ? "يمكنك الان التواصل مع ادارة موقع كوبونك من خلال هذة الصفحة فى حالة الاقتراحات او الشكاوي"
        : "You can now contact the Couponat website administration through this page for any suggestions or complaints.",
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
        ? "اتصل بنا: تواصل مع ادارة موقع كوبونك من هنا بسهولة"
        : "Contact Us: Easily contact the Couponat website administration here.",
      description: isArabic
        ? "يمكنك الان التواصل مع ادارة موقع كوبونك من خلال هذة الصفحة فى حالة الاقتراحات او الشكاوي"
        : "You can now contact the Couponat website administration through this page for any suggestions or complaints.",
      images: [
        {
          url: "https://couponake.com/couponakeLogo.webp",
          alt: "Couponake Logo",
        },
      ],
    },
  };
}

const ContactPage = async () => {
  return <ContactUsPage />;
};

export default ContactPage;
