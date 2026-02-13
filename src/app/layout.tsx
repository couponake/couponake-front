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
import { Cairo, Poppins } from 'next/font/google';
import Script from 'next/script';

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


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "300", "400", "600", "700"],
  variable: "--font-poppins",
});

const cairo = Cairo({ subsets: ["latin"], variable: "--font-cairo" });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata() {
  // Fetch SEO data
  const seoData: homeSeoType = await getSeo();
  //get the indexing settings of the FAQs page
  // const indexingSite = await getSettingEnabled(SettingsEnum.SuperSite);


  const fallbackTitle = "كوبونات";
  const siteLogo = `${process.env.NEXT_PUBLIC_WEBSITE_URL}coupoonatLogo.webp`;

  if (!seoData?.description || !seoData?.author) {
    return {
      title: fallbackTitle,
      description: fallbackTitle,
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
    robots: {
      // index: indexingSite,
      index: false,
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
      <head>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PG9NG3R');
          `}
        </Script>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-NWJT32SKJ7`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NWJT32SKJ7', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className={`${cairo.variable} ${poppins.variable} font-inherit`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PG9NG3R"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
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
