"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import UserDropDown from "../HomePageComponents/UserDropDown";
import Link from "next/link";
import { Globe, Menu } from "lucide-react";
import { useStore } from "@/store";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from "@heroui/drawer";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import LanguageSelector from "./LanguageSelector";

const MobileDrawer = ({
  websiteLogo,
}: {
  websiteLogo: string | null | undefined;
}) => {
  const t = useTranslations();
  const local = useLocale();
  const [openMobileNav, setOpenMobileNav] = useState(false);
  const { user } = useStore((store) => store);
  const pathname = usePathname();
  return (
    <>
      <button
        className="flex items-center md:hidden"
        onClick={() => setOpenMobileNav(true)}
      >
        <Menu className="h-6 w-6" />
      </button>
      <Drawer
        classNames={{
          wrapper: `max-sm:!w-full z-[9999] ${local === "ar" && "dir-rtl"}`,
          body: "!p-0",
        }}
        placement={local === "ar" ? "right" : "left"}
        isOpen={openMobileNav}
        onOpenChange={(value) => setOpenMobileNav(value)}
        onClose={() => setOpenMobileNav(false)}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                {websiteLogo && (
                  <Image
                    width={112}
                    height={40}
                    loading="lazy"
                    className="h-10 w-28 rounded-md object-contain bg-main-600 p-2"
                    src={websiteLogo}
                    alt="Website logo"
                    unoptimized
                  />
                )}
              </DrawerHeader>
              <DrawerBody>
                <div className="flex w-full flex-col pb-0">
                  <div className="relative flex h-fit w-full">
                    <div className="container relative z-10 flex w-full flex-col gap-6">
                      <div dir={local === "ar" ? "ltr" : "rtl"} className="xxs:px-8 container px-5 py-4 xs:px-8 flex items-center gap-2">
                        <Globe size={20} />
                        <LanguageSelector />
                      </div>
                      {
                        user ? (
                          <UserDropDown />
                        ) : (
                          <>
                            <div className="xxs:px-8 mb-3 px-5 xs:px-8">
                              <p className="text-neutral-900 mb-2 text-2xl font-bold">
                                {t("common.welcome")}
                              </p>
                              <p className="text-neutral-800">
                                {t("common.login_or_create")}
                              </p>
                            </div>
                            <div className="xxs:px-8 px-5 pb-6 xs:px-8">
                              <Link
                                target="_self"
                                href="/auth"
                                onClick={onClose}
                              >
                                <button className="sm:text-lg rounded-xl px-3 py-2 bg-main-500 text-white hover:opacity-70 transition-all">
                                  {t("Login / Register")}
                                </button>
                              </Link>
                            </div>
                          </>
                        )
                      }
                    </div>
                  </div>
                  <div className="xxs:ps-8 container flex-1 py-4 ps-5 xs:ps-8">
                    <div className="flex flex-col gap-5">
                      <Link
                        target="_self"
                        href="/"
                        onClick={onClose}
                        className={cn(
                          "underline-active text-neutral-900 relative text-xl font-medium",
                          pathname === "/" && "text-primary"
                        )}
                        aria-label="Home"
                      >
                        {t("common.home")}
                      </Link>
                      <Link
                        target="_self"
                        href="/categories"
                        aria-label="categories"
                        onClick={onClose}
                        className={cn(
                          "underline-active text-neutral-900 relative text-xl font-medium",
                          pathname === "/categories" && "text-primary"
                        )}
                      >
                        {t("common.categories")}
                      </Link>
                      <Link
                        target="_self"
                        href="/stores"
                        onClick={onClose}
                        className={cn(
                          "underline-active text-neutral-900 relative text-xl font-medium",
                          pathname === "/stores" && "text-primary"
                        )}
                        aria-label="stores"
                      >
                        {t("common.stores")}
                      </Link>
                      <Link
                        target="_self"
                        href="/blog"
                        aria-label="blog"
                        onClick={onClose}
                        className={cn(
                          "underline-active text-neutral-900 relative text-xl font-medium",
                          pathname === "/blog" && "text-primary"
                        )}
                      >
                        {t("common.blog")}
                      </Link>

                      <Link
                        target="_self"
                        href="/all_countries"
                        aria-label="all_countries"
                        onClick={onClose}
                        className={cn(
                          "underline-active text-neutral-900 relative text-xl font-medium",
                          pathname === "/all_countries" && "text-primary"
                        )}
                      >
                        {t("All Countries")}
                      </Link>
                    </div>
                  </div>
                </div>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MobileDrawer;
