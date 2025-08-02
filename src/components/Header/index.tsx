import React, { Suspense } from "react";
import LanguageSelector from "../LanguageSelector";
import { HeaderCategory, NotificationProps } from "@/types";
import UserNotifications from "../UserNotifications";
import Link from "next/link";
import Image from "next/image";
import SearchInput from "./SearchInput";
import dynamic from "next/dynamic";

const MobileDrawer = dynamic(() => import("./MobileDrawer"));
import ShowLoginBtnOrUserDropDown from "./ShowLoginBtnOrUserDropDown";
import NavLinks from "./NavLinks";
import CategoriesDropDown from "./CategoriesDropDown";

const Header = ({
  websiteLogo,
  notifications,
}: {
  websiteLogo: string | null | undefined;
  notifications: NotificationProps[] | null | undefined;
}) => {
  return (
    <div className="fixed z-[999] w-full border-b border-neutral-200 bg-white">
      <header className="container relative mx-auto flex items-center justify-between py-3 sm:py-5">
        <nav className="flex flex-1 items-center gap-4 md:gap-0">
          {websiteLogo && (
            <Suspense>
              <Link href="/" className="my-auto cursor-pointer md:px-2 bg-white rounded-lg">
                <Image
                  src="/AlafdalNewLogo.webp"
                  alt="Website Logo"
                  width={144}
                  height={48}
                  className="hidden md:inline-flex h-14 min-w-36 w-36 max-w-36 object-contain bg-white p-2 rounded-lg"
                  priority
                  quality={100}
                  unoptimized
                />
                <Image
                  src="/AlafdalNewLogo.webp"
                  alt="Website Logo"
                  width={40}
                  height={40}
                  className="inline-flex md:hidden h-17 min-w-27 w-27 max-w-27 object-contain bg-white p-2 rounded-lg"
                  priority
                  quality={100}
                  unoptimized
                />
              </Link>
            </Suspense>
          )}
          {/* Categories */}
          <CategoriesDropDown />
          {/* Navigation Links */}
          <div className="hidden md:flex">
            <NavLinks />
            <div className="m-auto mx-4 h-6 rounded-2xl border-r-2 border-neutral-100" />
          </div>

          {/* Search Bar */}
          <div className="flex flex-1">
            <Suspense>
              <SearchInput />{" "}
            </Suspense>
          </div>
          <div className="m-auto mx-4 h-6 border-r-2 border-neutral-100 max-sm:hidden" />
          <div className="">
            <Suspense>
              <UserNotifications notifications={notifications} />{" "}
            </Suspense>
          </div>

          <div className="m-auto mx-4 h-6 border-r-2 border-neutral-100 max-sm:hidden" />
          {/* Mobile Menu Button */}
          <Suspense>
            <MobileDrawer
              websiteLogo={websiteLogo}
              notifications={notifications}
            />{" "}
          </Suspense>
        </nav>

        {/* Desktop Navigation */}
        <nav className="hidden md:inline-block" aria-label="desktop">
          <ul className="text-neutral-900 flex select-none items-center justify-center text-base font-medium">
            <li className="relative z-50">
              <LanguageSelector />
            </li>
            <li>
              <div className="m-auto mx-4 h-6 border-r-2 border-neutral-100" />
            </li>
            <Suspense>
              <ShowLoginBtnOrUserDropDown />{" "}
            </Suspense>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Header;
