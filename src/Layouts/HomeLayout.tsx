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
  // Footer links change rarely; cache for 1 hour instead of refetching on every page render.
  const response: FooterLinksResponse = await api.static("home/footer-links", 3600);
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
        className="relative bg-neutral-50 min-h-[75vh]"
        style={{ paddingTop: "var(--header-h)" }}
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
