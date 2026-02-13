import React, { Suspense } from "react";
import LanguageSelector from "../HomePageComponents/LanguageSelector";
import { NotificationProps } from "@/types";
import UserNotifications from "../HomePageComponents/UserNotifications";
import Link from "next/link";
import Image from "next/image";
import SearchInput from "./SearchInput";
import dynamic from "next/dynamic";

const MobileDrawer = dynamic(() => import("./MobileDrawer"));
import ShowLoginBtnOrUserDropDown from "./ShowLoginBtnOrUserDropDown";
import NavLinks from "./NavLinks";

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
              <Link
                href="/"
                className="my-auto cursor-pointer bg-transparent rounded-lg"
              >
                <Image
                  src={websiteLogo}
                  alt="Website Logo"
                  width={144}
                  height={56}
                  sizes="(max-width: 768px) 108px, 144px"
                  className="object-contain bg-white p-2 rounded-lg h-12 w-27 md:h-14 md:w-36"
                  priority
                  quality={85}
                />
              </Link>
            </Suspense>
          )}
          {/* Navigation Links */}
          <div className="hidden md:flex">
            <NavLinks />
            <div className="m-auto mx-2 h-6 rounded-2xl border-r-2 border-neutral-100" />
          </div>

          {/* Search Bar */}
          <div className="flex flex-1">
            <Suspense>
              <SearchInput />
            </Suspense>
          </div>
          <div className="m-auto mx-2 h-6 border-r-2 border-neutral-100 max-sm:hidden" />
          <div className="">
            <Suspense>
              <UserNotifications notifications={notifications} />
            </Suspense>
          </div>

          <div className="m-auto mx-2 h-6 border-r-2 border-neutral-100 max-sm:hidden" />
          {/* Mobile Menu Button */}
          <Suspense>
            <MobileDrawer websiteLogo={websiteLogo} />
          </Suspense>
        </nav>

        {/* Desktop Navigation */}
        <nav className="hidden md:inline-block" aria-label="desktop">
          <ul className="text-neutral-900 flex select-none items-center justify-center text-base font-medium">
            <li className="relative z-50">
              <LanguageSelector />
            </li>
            <li>
              <div className="m-auto mx-2 h-6 border-r-2 border-neutral-100" />
            </li>
            <Suspense>
              <ShowLoginBtnOrUserDropDown />
            </Suspense>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Header;
