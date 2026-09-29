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
    title: isArabic ? "تواصل معنا: كود لم يعمل أو متجر تريد إضافته | كوبوناك" : "Contact us: a code that failed or a store to add | Couponake",
    description: isArabic ? "أبلغنا عن كود توقف، اقترح متجرًا، أو راسلنا للشراكات. نرد خلال يوم عمل على البريد أو النموذج." : "Report a dead code, suggest a store, or reach us for partnerships. We reply within one business day.",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}contact/` || "",
    },
    robots: {
      index: indexingContact,
    },
    openGraph: {
      title: isArabic ? "تواصل معنا: كود لم يعمل أو متجر تريد إضافته | كوبوناك" : "Contact us: a code that failed or a store to add | Couponake",
      description: isArabic ? "أبلغنا عن كود توقف، اقترح متجرًا، أو راسلنا للشراكات. نرد خلال يوم عمل على البريد أو النموذج." : "Report a dead code, suggest a store, or reach us for partnerships. We reply within one business day.",
      images: [
        {
          url: "https://couponake.com/couponak-logo.svg",
          alt: "Couponake Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isArabic ? "تواصل معنا: كود لم يعمل أو متجر تريد إضافته | كوبوناك" : "Contact us: a code that failed or a store to add | Couponake",
      description: isArabic ? "أبلغنا عن كود توقف، اقترح متجرًا، أو راسلنا للشراكات. نرد خلال يوم عمل على البريد أو النموذج." : "Report a dead code, suggest a store, or reach us for partnerships. We reply within one business day.",
      images: [
        {
          url: "https://couponake.com/couponak-logo.svg",
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
