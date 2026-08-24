import {
  FaFacebook,
  // FaInstagram,
  FaTelegram,
  FaWhatsapp,
} from "react-icons/fa";
import type { footerLinkType, SettingsItem } from "@/types";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import SubscribeForm from "./SubscribeForm";
import { Copyright } from "lucide-react";
import { useMemo } from "react";

const Footer = ({
  settings,
  footerLinks,
}: {
  settings: SettingsItem[];
  footerLinks: footerLinkType[];
}) => {
  const t = useTranslations();
  const socialLinks = useMemo(() => {
    if (!settings || !Array.isArray(settings)) {
      return {
        facebook: null,
        telegram: null,
        whatsapp: null,
        logo: null,
        description: null,
        siteName: "",
      };
    }

    const getSettingValue = (keys: string[]) => {
      const match = settings.find((item) => {
        if (!item || !item.name) return false;
        const normalizedName = item.name.toLowerCase().trim();
        return keys.some((k) => normalizedName === k.toLowerCase());
      });
      return match?.val ? match.val.trim() : null;
    };

    // 3. Scan multiple variants used by different environment DBs
    const facebook = getSettingValue(["facebook", "social_facebook"]);
    const telegram = getSettingValue(["side_telegram", "telegram", "social_telegram"]);
    const whatsapp = getSettingValue(["side_whatsapp", "whatsapp", "social_whatsapp"]);
    const logo = getSettingValue(["footer_logo", "logo"]);
    const description = getSettingValue(["footer_description", "description"]);
    const siteName = getSettingValue(["site_name", "title"]) || "";

    return { facebook, telegram, whatsapp, logo, description, siteName };
  }, [settings]);

  return (
    <footer
      suppressHydrationWarning
      className="mt-auto bg-background text-foreground"
    >
      <div className="mx-auto px-4 py-12 mb-12 lg:mb-0">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 container">
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
              <li>
                <Link
                  target="_self"
                  prefetch={false}
                  href={`/sitemap.xml`}
                  className="text-sm hover:underline"
                >
                  {t("footer_sitemap_url")}
                </Link>
              </li>
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
              {new Date().getFullYear()} {socialLinks.siteName.split("|")[0]}
              {", "}
              {t("All rights reserved")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
