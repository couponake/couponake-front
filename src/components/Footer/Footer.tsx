import {
  FaFacebook,
  FaInstagram,
  FaTelegram,
  FaWhatsapp,
} from "react-icons/fa";
import type { SettingsItem } from "@/types";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import SubscribeForm from "./SubscribeForm";

interface footerLinkType {
  id: number
  title: string
  url: string
}

const Footer = ({
  settings,
  footerLinks,
}: {
  settings: SettingsItem[] | null | undefined;
  footerLinks: footerLinkType[] | null | undefined;
}) => {
  const t = useTranslations();
  const facebook = settings?.find((item) => item.name === "facebook")?.val;
  const instagram = settings?.find((item) => item.name === "instagram")?.val;
  const telegram = settings?.find((item) => item.name === "side_telegram")?.val;
  const whatsapp = settings?.find((item) => item.name === "side_whatsapp")?.val;

  return (
    <footer className="mt-auto bg-background text-foreground">
      <div className="mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 container">
          <div className="space-y-4">
            <Link
              target="_self"
              href="/"
              aria-label="Home"
            >
              {settings?.find((item) => item.name === "footer_logo")?.val && (
                <Image
                  src={
                    settings.find((item) => item.name === "footer_logo")?.val ??
                    ""
                  }
                  alt="logo"
                  width={136}
                  height={48}
                  className="h-14 w-auto bg-transparent"
                  unoptimized
                />
              )}
            </Link>
            <p className="text-sm">
              {
                settings?.find((item) => item.name === "footer_description")
                  ?.val
              }
            </p>
            <div className="flex gap-x-4">
              {instagram && (
                <a
                  href={instagram ?? "#"}
                  rel="noopener noreferrer nofollow"
                  aria-label="Instagram"
                  target="_blank"
                >
                  <FaInstagram className="h-5 w-5 text-[#e45090]" />
                </a>
              )}
              {telegram && (
                <a
                  href={telegram ?? "#"}
                  rel="noopener noreferrer nofollow"
                  aria-label="Telegram"
                  target="_blank"
                >
                  <FaTelegram className="h-5 w-5 text-sky-500" />
                </a>
              )}
              {facebook && (
                <a
                  href={facebook ?? "#"}
                  rel="noopener noreferrer nofollow"
                  aria-label="Facebook"
                  target="_blank"
                >
                  <FaFacebook className="h-5 w-5 text-blue-500" />
                </a>
              )}
              {whatsapp && (
                <a
                  href={whatsapp ?? "#"}
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
            <h3 className="mb-4 text-lg font-semibold">
              {t("Important Pages")}
            </h3>
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
                    {
                      link.url === "terms"
                        ? t('terms')
                        : link.url === "privacy-policy"
                          ? t('privacy-policy')
                          : link.url === "about"
                          && t('about')
                    }
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
            <h3 className="mb-4 text-lg font-semibold">
              {t("Subscribe to Our Newsletter")}
            </h3>
            <SubscribeForm />
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8">
          <div className="flex flex-wrap items-center justify-between container">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()}{" "}
              {settings?.find((item) => item.name === "site_name")?.val}.{" "}
              {t("All rights reserved")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
