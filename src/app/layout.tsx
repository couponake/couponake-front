import '@/styles/globals.css';

import Providers from '@/lib/Providers';
import SessionProvider from '@/lib/SessionProvider';
import { routing } from '@/i18n/routing';
import HomeLayout from '@/Layouts/HomeLayout';
import api from '@/lib/api';
import { getSettings } from '@/services/GetSettingsRequest';
import { Settings } from '@/types';
import { Analytics } from '@vercel/analytics/react';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Almarai, Inter } from 'next/font/google';
import { getSettingEnabled } from '@/services/getIndexingSettings';
import { SettingsEnum } from '@/types/settingsEnum';

interface homeSeoType {
  author: string;
  keywords: string;
  description: string;
  "og:title": string;
  "og:description": string;
  "og:image": string;
  "og:image:alt": string;
  "twitter:title": string;
  "twitter:description": string;
  "twitter:image": string;
  "twitter:image:alt": string;
  url: string;
  canonical: string;
}

const getSeo = async (): Promise<homeSeoType> => {
  try {
    const data: any = await api.static("home/seo");
    return data.seo as homeSeoType;
  } catch (error) {
    console.log(error);
    return {} as homeSeoType;
  }
};


const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const almarai = Almarai({ weight: ["400", "700", "800"], subsets: ["arabic"], variable: "--font-almarai", display: "swap" });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport = {
  themeColor: "#0E7C86",
};

export async function generateMetadata() {
  // Fetch SEO data
  const seoData: homeSeoType = await getSeo();
  //get the indexing settings of the FAQs page
  const indexingSite = await getSettingEnabled(SettingsEnum.SuperSite);


  const fallbackTitle = "كوبوناك";
  const siteLogo = `${process.env.NEXT_PUBLIC_WEBSITE_URL}og-default.png`;

  if (!seoData?.description || !seoData?.author) {
    return {
      title: "كوبوناك: أكواد خصم مجرّبة اليوم لأشهر متاجر السعودية والخليج",
      description: "كوبوناتك في مكان واحد: أكواد خصم نجرّبها كل يوم على أشهر المتاجر، مع نسبة التوفير وتاريخ آخر تجربة ناجحة. انسخ ووفّر في طلبك التالي.",
      manifest: "/site.webmanifest",
      robots: { index: indexingSite },
    };
  }

  return {
    // Basic metadata
    title: seoData?.author || fallbackTitle,
    description: seoData?.description || fallbackTitle,
    keywords: seoData?.keywords || "",
    authors: [{ name: seoData?.author || fallbackTitle }],
    alternates: {
      canonical: seoData?.url || `${process.env.NEXT_PUBLIC_WEBSITE_URL}`,
    },
    manifest: "/site.webmanifest",
    robots: {
      index: indexingSite,
    },
    // OpenGraph metadata
    openGraph: {
      type: "website",
      siteName: fallbackTitle,
      title: seoData["og:title"] || seoData?.author || fallbackTitle,
      description: seoData["og:description"] || seoData?.description || fallbackTitle,
      images: [
        {
          url: seoData["og:image"] || siteLogo,
          alt: seoData["og:image:alt"] || fallbackTitle,
        },
      ],
      url: seoData?.url || `${process.env.NEXT_PUBLIC_WEBSITE_URL}`,
    },

    // Twitter metadata
    twitter: {
      card: "summary_large_image",
      title: seoData["twitter:title"] || seoData?.author || fallbackTitle,
      description: seoData["twitter:description"] || seoData?.description || fallbackTitle,
      images: [
        {
          url: seoData["twitter:image"] || siteLogo,
          alt: seoData["twitter:image:alt"] || fallbackTitle,
        },
      ],
    },
  };
}

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const generalSettings = await getSettings();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <body className={`${almarai.variable} ${inter.variable} font-almarai`}>
        <SessionProvider>
          <Analytics />
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Providers>
              <HomeLayout generalSettings={generalSettings as Settings}>{children}</HomeLayout>
            </Providers>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
