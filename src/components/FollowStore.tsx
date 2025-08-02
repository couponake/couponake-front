"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { TbShoppingBagPlus } from "react-icons/tb";
import {
  FaFacebook,
  FaInstagram,
  FaTelegram,
  FaWhatsapp,
  FaPhone,
  FaTiktok,
  FaLinkedin,
  FaYoutube,
  FaSnapchatSquare
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";


type SocialLinks = {
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
  telegram?: string;
  phone?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  snapchat?: string;
};

const ICONS_MAP: Record<keyof SocialLinks, React.ReactNode> = {
  facebook: <FaFacebook className="size-5 text-blue-500" />,
  instagram: <FaInstagram className="size-5 text-[#DD2A7B]" />,
  whatsapp: <FaWhatsapp className="size-5 text-[#25D366]" />,
  telegram: <FaTelegram className="size-5 text-[#0088CC]" />,
  phone: <FaPhone className="size-4 text-black" />,
  twitter: <FaXTwitter className="size-5 text-black" />,
  linkedin: <FaLinkedin className="size-5 text-[#0A66C2]" />,
  youtube: <FaYoutube className="size-5 text-[#FF0000]" />,
  tiktok: <FaTiktok className="size-5 text-black" />,
  snapchat: <FaSnapchatSquare className="size-5 text-[#fffc00]" />,
};

const FollowStore = ({ links, storeName }: { links: string | { key: string, value: string }[], storeName: string }) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const hasTrackedOpen = useRef<boolean>(false);

  useEffect(() => {
    if (isOpen && !hasTrackedOpen.current) {
      hasTrackedOpen.current = true;
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", `${storeName}_support`, {
          event_category: `${storeName}_support`,
        });
      }
    }
  }, [isOpen]);


  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = Object.entries(links)
    .filter(([key, value]) => value && ICONS_MAP[key as keyof SocialLinks])
    .map(([key, value]) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1) === "Twitter" ? "X" : key.charAt(0).toUpperCase() + key.slice(1),
      href: value,
      icon: ICONS_MAP[key as keyof SocialLinks],
    }));

  if (menuItems.length === 0) return null;

  return (
    <>
      <Dropdown isOpen={isOpen} onOpenChange={setIsOpen} placement={"left-start"}>
        <DropdownTrigger>
          <button
            onMouseEnter={toggleIsOpen}
            className={cn(
              "bg-white rtl:max-w-44 shadow fixed top-60 flex-row-reverse z-[100] ltr:-left-12 rtl:-right-9 rotate-90 ltr:hover:-left-12 rtl:hover:-right-9 rounded-md transition-all ease-in-out duration-300 text-main-500 py-2 px-3 flex items-center gap-3",
              isOpen && "rtl:-right-9 ltr:-left-12"
            )}
          >
            {/* <TbShoppingBagPlus className="size-7" /> */}
            <p>{t("Follow this store")} </p>
          </button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          {menuItems?.map((item) => (
            <DropdownItem
              key={item.key}
              startContent={item.icon}
              textValue={item.label}
              as="a"
              href={item.label !== "Phone" ? item.href : `tel:${item.href}`}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              {item.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

export default FollowStore;
