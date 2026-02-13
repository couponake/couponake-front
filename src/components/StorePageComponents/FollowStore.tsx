"use client";
import { cn } from "@/lib/utils";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Headset } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaSnapchatSquare,
  FaTelegram,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
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

const FollowStore = ({
  links,
  storeName,
}: {
  links: string | { key: string; value: string }[];
  storeName: string;
}) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", `${storeName}_support`, {
        event_category: `${storeName}_support`,
      });
    }
  };

  const menuItems = Object.entries(links)
    .filter(([key, value]) => value && ICONS_MAP[key as keyof SocialLinks])
    .map(([key, value]) => ({
      key,
      label:
        key.charAt(0).toUpperCase() + key.slice(1) === "Twitter"
          ? "X"
          : key.charAt(0).toUpperCase() + key.slice(1),
      href: value,
      icon: ICONS_MAP[key as keyof SocialLinks],
    }));

  if (menuItems.length === 0) return null;

  return (
    <Dropdown
      onOpenChange={setIsOpen}
      placement={"left-start"}
      shouldBlockScroll={false}
    >
      <DropdownTrigger>
        <button
          onClick={toggleIsOpen}
          className={cn(
            "bg-white/35 w-max shadow fixed top-90 rtl:right-0 ltr:left-0 z-[100] rounded-e-md outline-none border-none text-main-500 py-2 px-3"
          )}
        >
          <Headset className="size-10" />
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownSection
          showDivider={false}
          title={
            (
              <span className="text-main-500 text-base rtl:font-semibold ltr:font-normal">
                {t("Follow this store")}
              </span>
            ) as unknown as string
          }
        >
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
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};

export default FollowStore;
