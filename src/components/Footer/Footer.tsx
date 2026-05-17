import {
  FaFacebook,
  // FaInstagram,
  FaTelegram,
  FaWhatsapp,
} from "react-icons/fa";
import type { SettingsItem } from "@/types";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import SubscribeForm from "./SubscribeForm";
import { Copyright } from "lucide-react";
import { socialMediaEnum } from "@/types/settingsEnum";
import { useMemo } from "react";

interface footerLinkType {
  id: number;
  title: string;
  url: string;
}

const importantStoresLinks = [
  { id: 1, title: "noonDiscount", url: "/store/noon-نون/" },
  { id: 2, title: "namshiDiscount", url: "/store/namshi-نمشي/" },
  { id: 3, title: "temuDiscount", url: "/store/temu/" },
  { id: 4, title: "levelShoesDiscount", url: "/store/levelshoes/" },
  { id: 5, title: "trendyolDiscount", url: "/store/trendyol/" },
];

const Footer = ({
  settings,
  footerLinks,
}: {
  settings: SettingsItem[] | null | undefined;
  footerLinks: footerLinkType[] | null | undefined;
}) => {
  const t = useTranslations();
  const socialLinks = useMemo(() => {
    if (!settings)
      return {
        facebook: null,
        telegram: null,
        whatsapp: null,
        logo: null,
        description: null,
        siteName: "",
      };

    return {
      facebook:
        settings.find((item) => item.name === socialMediaEnum.Facebook)?.val ||
        null,
      telegram:
        settings.find((item) => item.name === socialMediaEnum.Telegram)?.val ||
        null,
      whatsapp:
        settings.find((item) => item.name === socialMediaEnum.Whatsapp)?.val ||
        null,
      logo: settings.find((item) => item.name === "footer_logo")?.val || null,
      description:
        settings.find((item) => item.name === "footer_description")?.val || "",
      siteName: settings.find((item) => item.name === "site_name")?.val || "",
    };
  }, [settings]);

  return (
    <footer
      suppressHydrationWarning
      className="mt-auto bg-background text-foreground"
    >
      <div className="mx-auto px-4 py-12 mb-12 lg:mb-0">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 container">
          <div className="space-y-4">
            <Link target="_self" href="/" aria-label="Home" prefetch={false}>
              {socialLinks.logo && (
                <Image
                  src={socialLinks.logo}
                  alt="logo"
                  width={136}
                  height={48}
                  className="h-14 w-auto bg-transparent"
                  unoptimized
                />
              )}
            </Link>
            <p className="text-sm">{socialLinks.description}</p>
            <div className="flex gap-x-4">
              {socialLinks.telegram && (
                <a
                  href={socialLinks.telegram}
                  rel="noopener noreferrer nofollow"
                  aria-label="Telegram"
                  target="_blank"
                >
                  <FaTelegram className="h-5 w-5 text-sky-500" />
                </a>
              )}
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  rel="noopener noreferrer nofollow"
                  aria-label="Facebook"
                  target="_blank"
                >
                  <FaFacebook className="h-5 w-5 text-blue-500" />
                </a>
              )}
              {socialLinks.whatsapp && (
                <a
                  href={socialLinks.whatsapp}
                  rel="noopener noreferrer nofollow"
                  aria-label="WhatsApp"
                  target="_blank"
                >
                  <FaWhatsapp className="h-5 w-5 text-green-600" />
                </a>
              )}
            </div>
          </div>

          <div>
            <p className="mb-4 text-lg font-semibold">{t("Important Pages")}</p>
            <ul className="space-y-2">
              {footerLinks?.map((link: footerLinkType) => (
                <li key={link.id}>
                  <Link
                    href={
                      link.url === "terms"
                        ? "/terms"
                        : link.url === "privacy-policy"
                          ? "/privacy-policy"
                          : link.url === "about"
                            ? "/about-us"
                            : `/${link.url}`
                    }
                    target="_self"
                    prefetch={false}
                    className="text-sm hover:underline"
                  >
                    {link.url === "terms"
                      ? t("terms")
                      : link.url === "privacy-policy"
                        ? t("privacy-policy")
                        : link.url === "about" && t("about")}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  target="_self"
                  prefetch={false}
                  href={`/contact`}
                  className="text-sm hover:underline"
                >
                  {t("Contact Us")}
                </Link>
              </li>
              <li>
                <Link
                  target="_self"
                  prefetch={false}
                  href={`/faq`}
                  className="text-sm hover:underline"
                >
                  {t("Frequently Asked Questions")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-lg font-semibold">
              {t("Important Stores")}
            </p>
            <ul className="space-y-2">
              {importantStoresLinks?.map((store_link) => (
                <li key={store_link.id}>
                  <Link
                    href={store_link.url}
                    target="_self"
                    prefetch={false}
                    className="text-sm hover:underline"
                  >
                    {t(store_link.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-lg font-semibold">
              {t("Subscribe to Our Newsletter")}
            </p>
            <SubscribeForm />
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8">
          <div className="flex flex-wrap items-center justify-between container">
            <p
              suppressHydrationWarning
              className="text-xs text-muted-foreground flex gap-1 items-center"
            >
              <Copyright size={12} />
              {new Date().getFullYear()} {socialLinks.siteName}.{" "}
              {t("All rights reserved")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
