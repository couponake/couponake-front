"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { UserIcon, HeartIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Navigation = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const activeTab = pathname.includes("favorites") ? "favorites" : "account";

  return (
    <nav className="mb-8 mt-4">
      <Link
        href="/profile"
        className={cn(
          "rounded-e-xl mb-2 ms-2 flex h-12 items-center py-3.5 ps-3 text-neutral-900 hover:border-s-4 hover:border-main-600 hover:bg-white hover:text-main-600",
          activeTab === "account" &&
            "border-main-600 bg-white border-s-4 text-main-600"
        )}
      >
        <UserIcon />

        <div className="text-base font-medium ms-3">{t("Account Details")}</div>
      </Link>
      <Link
        className={cn(
          "rounded-e-xl mb-2 ms-2 flex h-12 items-center py-3.5 ps-3 text-neutral-900 hover:border-s-4 hover:border-main-600 hover:bg-white hover:text-main-600",
          activeTab === "favorites" &&
            "border-main-600 bg-white border-s-4 text-main-600"
        )}
        href="/profile/favorites"
      >
        <HeartIcon />

        <div className="text-base font-medium ms-3">{t("Favorites")}</div>
      </Link>
    </nav>
  );
};

export default Navigation;
