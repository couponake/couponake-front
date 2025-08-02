"use client";
import Link from "next/link";
import React from "react";
import UserDropDown from "../UserDropDown";
import { UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useStore } from "@/store";

const ShowLoginBtnOrUserDropDown = () => {
  const t = useTranslations();
  const { user } = useStore((store) => store);

  return (
    <>
      {user ? (
        <UserDropDown />
      ) : (
        <Link 
        target="_self"
         href="/auth/login">
          <li className="group relative rounded-full border border-neutral-100 px-4 py-2">
            <div className="flex items-center justify-between gap-3">
              <UserIcon className="size-5 text-neutral-900" />
              <span className="line-clamp-1 flex-1 text-base">
                {t("common.login")}
              </span>
            </div>
          </li>
        </Link>
      )}
    </>
  );
};

export default ShowLoginBtnOrUserDropDown;
