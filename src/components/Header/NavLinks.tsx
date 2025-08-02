"use client";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavLinks = () => {
  const t = useTranslations();
  const pathname = usePathname();
  return (
    <ul className="text-neutral-900 flex select-none items-center justify-center text-base font-medium">
      <Link
        prefetch={false}
        target="_self"
        href="/"
        aria-label="Home"
      >
        <li
          className={cn(
            "group relative cursor-pointer whitespace-nowrap px-1 py-2",
            pathname === "/" && "text-primary"
          )}
        >
          <div
            className={cn(
              "absolute h-[3px] w-full bg-main-500 left-0 -bottom-[25px] opacity-0 group-hover:opacity-100 transition-all",
              pathname === "/" && "opacity-100"
            )}
          />
          {t("common.home")}
        </li>
      </Link>
      <li className="mx-1" />
      <Link
        prefetch={false}
        target="_self"
        href="/stores"
        aria-label="Stores"
      >
        <li
          className={cn(
            "relative ms-2 group cursor-pointer whitespace-nowrap px-1 py-2",
            pathname === "/stores/" && "text-primary"
          )}
        >
          <div
            className={cn(
              "absolute h-[3px] w-full bg-main-500 left-0 -bottom-[25px] opacity-0 group-hover:opacity-100 transition-all",
              pathname === "/stores/" && "opacity-100"
            )}
          />
          {t("common.stores")}
        </li>
      </Link>
      <li className="mx-1" />
      <Link
        prefetch={false}
        target="_self"
        href="/blog"
        aria-label="blog"
      >
        <li
          className={cn(
            "relative ms-2 group cursor-pointer whitespace-nowrap px-1 py-2",
            pathname === "/blog/" && "text-primary"
          )}
        >
          <div
            className={cn(
              "absolute h-[3px] w-full bg-main-500 left-0 -bottom-[25px] opacity-0 group-hover:opacity-100 transition-all",
              pathname === "/blog/" && "opacity-100"
            )}
          />
          {t("common.blog")}
        </li>
      </Link>
      <Link
        prefetch={false}
        target="_self"
        href="/all_countries"
        aria-label="all_countries"
      >
        <li
          className={cn(
            "relative ms-2 group cursor-pointer whitespace-nowrap px-1 py-2",
            pathname === "/all_countries/" && "text-primary"
          )}
        >
          <div
            className={cn(
              "absolute h-[3px] w-full bg-main-500 left-0 -bottom-[25px] opacity-0 group-hover:opacity-100 transition-all",
              pathname === "/all_countries/" && "opacity-100"
            )}
          />
          {t("All Countries")}
        </li>
      </Link>
    </ul>
  );
};

export default NavLinks;
