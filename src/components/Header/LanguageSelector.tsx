"use client";
import { usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@heroui/button";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";

const LanguageSelector = () => {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams(); // عشان نحافظ على الـ slug لو موجود
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (nextLocale: string) => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error - next-intl types can be strict with params
        { pathname, params }, 
        { locale: nextLocale }
      );
    });

    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "language_change", {
        value: nextLocale,
      });
    }
  };

  return (
    <Button
      name="lang-switcher"
      aria-label="lang-switcher"
      isIconOnly
      variant="light"
      size="md"
      radius="full"
      isDisabled={isPending}
      isLoading={isPending}
      className="disabled:opacity-75 disabled:cursor-wait font-normal p-0 m-0 text-lg flex justify-center items-center hover:text-main-500"
      onPress={() => handleLanguageChange(currentLocale === "en" ? "ar" : "en")}
    >
      <span>{currentLocale === "en" ? "ع" : "en"}</span>
    </Button>
  );
};

export default LanguageSelector;