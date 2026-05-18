import CookieConsent from "@/components/CookieConsent";
import Header from "@/components/Header";
import ImagePopUp from "@/components/HomePageComponents/ImagePopUp";
import api from "@/lib/api";
import { FooterLinksResponse, footerLinkType, Settings } from "@/types";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";

const Footer = dynamic(() => import("@/components/Footer/Footer"));
const StickyMenu = dynamic(
  () => import("@/components/HomePageComponents/StickyMenu"),
);
const FollowUs = dynamic(
  () => import("@/components/HomePageComponents/FollowUs"),
);

const HomeLayout = async ({
  children,
  generalSettings,
}: {
  children: React.ReactNode;
  generalSettings: Settings;
}) => {
  const response: FooterLinksResponse = await api.dynamic("home/footer-links");
  const footerLinks = response?.data as footerLinkType[];

  const safeSettings = structuredClone(generalSettings);

  const websiteLogo = safeSettings?.settings?.find(
    (item) => item.name === "image",
  )?.val;

  return (
    <>
      <Header
        websiteLogo={websiteLogo}
        notifications={safeSettings?.notifications}
      />
      <main
        className="pt-[6.5rem] relative bg-neutral-50 min-h-[75vh]"
        style={{
          paddingTop: "6.5rem",
          minHeight: "75vh",
        }}
      >
        <Suspense>
          <FollowUs settings={safeSettings?.settings} />
          <StickyMenu menus={safeSettings?.menus} />
          <ImagePopUp settings={safeSettings?.settings} />
          <CookieConsent />
        </Suspense>
        {children}
      </main>
      <Suspense>
        <Footer settings={safeSettings?.settings} footerLinks={footerLinks} />
      </Suspense>
    </>
  );
};

export default HomeLayout;
