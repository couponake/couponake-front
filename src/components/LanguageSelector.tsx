"use client";
import { setUserLocale } from "@/services/locale";
import { Spinner } from "@heroui/spinner";
import { useLocale } from "next-intl";
import { useTransition } from "react";

const LanguageSelector = () => {
  const currentLocale = useLocale();
  const [isPending, startTransition] = useTransition();
  const handleLanguageChange = (locale: string) => {
    startTransition(() => setUserLocale(locale));
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag("event", "language_change", {
        value: locale,
      });
    }
  };

  return (
    <button
      disabled={isPending}
      className="disabled:opacity-75 flex items-center gap-3 disabled:cursor-wait"
      onClick={() => handleLanguageChange(currentLocale === "en" ? "ar" : "en")}
    >
      {currentLocale === "en" ? "العربية" : "English"}
      {isPending && <Spinner size="sm" color="primary" />}
    </button>
  );
};

export default LanguageSelector;
