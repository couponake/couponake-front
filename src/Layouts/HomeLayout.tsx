import CookieConsent from '@/components/CookieConsent';
import Header from '@/components/Header';
import ImagePopUp from '@/components/ImagePopUp';
import api from '@/lib/api';
import { Settings } from '@/types';
import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

const Footer = dynamic(() => import("@/components/Footer/Footer"));
const StickyMenu = dynamic(() => import("@/components/StickyMenu"));
const FollowUs = dynamic(() => import("@/components/FollowUs"));

const HomeLayout = async ({ children, generalSettings }: { children: React.ReactNode, generalSettings: Settings }) => {
  const response: any = await api.dynamic("home/footer-links");
  const footerLinks = response?.data as {
    id: number;
    title: string;
    url: string;
  }[];
  const websiteLogo = generalSettings?.settings?.find(
    (item) => item.name === "image"
  )?.val;
  return (
    <>
      <Header
        websiteLogo={websiteLogo}
        notifications={generalSettings?.notifications}
      />
      <main
        className="pt-[6.5rem] relative bg-neutral-50 min-h-[75vh]"
        style={{
          paddingTop: "6.5rem",
          minHeight: "75vh",
        }}
      >
        <Suspense>
          <FollowUs settings={generalSettings?.settings} />
          <StickyMenu menus={generalSettings?.menus} />
          <ImagePopUp settings={generalSettings?.settings} />
          <CookieConsent />
        </Suspense>
        {children}
      </main>
      <Suspense>
        <Footer
          settings={generalSettings?.settings}
          footerLinks={footerLinks}
        />
      </Suspense>
    </>
  );
};

export default HomeLayout;
