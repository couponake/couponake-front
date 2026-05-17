"use client";
import React, { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { SettingsItem } from "@/types";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  FaFacebook,
  // FaInstagram,
  FaTelegram,
  FaWhatsapp,
} from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { socialMediaEnum } from "@/types/settingsEnum";

const FollowUs = ({
  settings,
}: {
  settings: SettingsItem[] | null | undefined;
}) => {
  const t = useTranslations();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const isStorePage = /^\/store\/[^\/]+/.test(pathname);
  if (isStorePage) return null;

  // Define the menu items
  const menuItems = [
    {
      key: "Facebook",
      label: "Facebook",
      href: settings?.find((item) => item.name === socialMediaEnum.Facebook)?.val,
      icon: <FaFacebook className="size-5 text-blue-500" />,
    },
    // {
    //   key: "Instagram",
    //   label: "Instagram",
    //   href: settings?.find((item) => item.name === socialMediaEnum.Instagram)?.val,
    //   icon: <FaInstagram className="size-5 text-[#e45090]" />,
    // },
    {
      key: "Whatsapp",
      label: "Whatsapp",
      href: settings?.find((item) => item.name === socialMediaEnum.Whatsapp)?.val,
      icon: <FaWhatsapp className="size-5 text-green-600" />,
    },
    {
      key: "Telegram",
      label: "Telegram",
      href: settings?.find((item) => item.name === socialMediaEnum.Telegram)?.val,
      icon: <FaTelegram className="size-5 text-sky-400" />,
    },
  ].filter((item) => item.href);

  return (
    <>
      {menuItems?.length > 0 ? (
        <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
          <DropdownTrigger>
            <button
              onMouseEnter={toggleIsOpen}
              className={cn(
                "bg-white rtl:max-w-44 shadow fixed top-60 flex-row-reverse z-[100] ltr:-left-21 rtl:-right-12 ltr:hover:left-0 rtl:hover:right-0 rounded-e-md transition-all ease-in-out duration-300 text-main-500 py-2 px-3 flex items-center gap-3",
                isOpen && "rtl:!right-0 ltr:!left-0"
              )}

            >
              <FiShare2 className="size-7" />
              <p>{t("Follow Us")}</p>
            </button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            {menuItems?.map((item) => (
              <DropdownItem key={item.key} startContent={item?.icon} textValue={item?.label}>
                <a target="_blank" href={item.href} rel="noopener noreferrer nofollow">
                  {item.label}
                </a>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      ) : null}
    </>
  );
};

export default FollowUs;
