"use client";
import React, { useEffect, useState } from "react";
import { Switch } from "@heroui/switch";
import { Button } from "@heroui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "@/components/ui/custom-toast";
import MyAxios from "@/lib/MyAxios";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

interface CookiePolicy {
  last_updated: string;
  categories: {
    name: string;
    description: string;
    required: boolean;
    cookies: {
      name: string;
      purpose: string;
      duration: string;
    }[];
  }[];
}

export default function CookieConsent() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });
  const [policy, setPolicy] = useState<CookiePolicy | null>(null);
  const t = useTranslations();

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const consent = localStorage.getItem("cookieConsent");
      if (consent === null) {
        setIsOpen(true);
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadPreferences();
      loadPolicy();
    }
  }, [isOpen]);

  if (!mounted) return null;

  const loadPreferences = async () => {
    try {
      const { data } = await MyAxios.get("cookies/preferences");
      setPreferences(data.data);
    } catch (error) {
      console.error("Error loading preferences:", error);
    }
  };

  const loadPolicy = async () => {
    try {
      const { data } = await MyAxios.get("cookies/policy");
      setPolicy(data.data);
    } catch (error) {
      console.error("Error loading policy:", error);
    }
  };

  const handleAcceptAll = async () => {
    try {
      await MyAxios.post("home/cookies/accept");
      localStorage.setItem("cookieConsent", "accepted");
      setIsOpen(false);
    } catch (error) {
      console.error("Error accepting cookies:", error);
      toast.error(t("Failed to accept cookies"));
    }
  };

  const handleDecline = async () => {
    try {
      await MyAxios.post("home/cookies/decline");
      localStorage.setItem("cookieConsent", "declined");
      setIsOpen(false);
    } catch (error) {
      console.error("Error declining cookies:", error);
      toast.error(t("Failed to decline cookies"));
    }
  };

  const handleSavePreferences = async () => {
    try {
      await MyAxios.post("cookies/preferences", preferences);
      localStorage.setItem("cookieConsent", "customized");
      localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
      toast.success(t("Cookie preferences saved successfully"));
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error(t("Failed to save preferences"));
    }
  };

  const handleClearNonEssential = async () => {
    try {
      await MyAxios.delete("cookies/non-essential");
      toast.success(t("Non-essential cookies cleared"));
      loadPreferences();
    } catch (error) {
      console.error("Error clearing cookies:", error);
      toast.error(t("Failed to clear cookies"));
    }
  };

  return isOpen ? (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-200 dark:bg-gray-900 shadow-lg border-t border-gray-400 dark:border-gray-700 transition-all duration-300 ease-in-out z-[999]">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <p className="text-lg font-semibold">{t("Cookie Preferences")}</p>
          </div>
          <div className="flex items-center gap-x-2">
            <Button
              color="success"
              variant="flat"
              size="sm"
              onPress={handleAcceptAll}
            >
              {t("Accept All")}
            </Button>
            <Button
              color="danger"
              variant="flat"
              size="sm"
              className="text-red-500"
              onPress={handleDecline}
            >
              {t("Decline All")}
            </Button>
            <Button
              size="sm"
              onPress={() => setIsExpanded(!isExpanded)}
              className="flex items-center"
            >
              {isExpanded ? <ChevronDown /> : <ChevronUp />}
            </Button>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-96" : "max-h-0"}`}
        >
          <div className="space-y-4 py-4">
            {Object.entries(preferences).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-lg font-medium capitalize">{key}</p>
                  <p className="text-sm text-gray-500">
                    {t(`cookie.${key}.description`)}
                  </p>
                </div>
                <Switch
                  checked={value}
                  disabled={key === "necessary"}
                  onValueChange={(checked: boolean) =>
                    setPreferences((prev) => ({ ...prev, [key]: checked }))
                  }
                />
              </div>
            ))}
            {policy && (
              <div className="mt-4 pt-4 border-t dark:border-gray-700">
                <p className="text-lg font-medium mb-2">{t("Cookie Policy")}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {t("Last updated")}: {policy.last_updated}
                </p>
                {policy.categories.map((category, index) => (
                  <div key={index} className="mb-4">
                    <p className="text-md font-medium">{category.name}</p>
                    <p className="text-sm text-gray-500 mb-2">
                      {category.description}
                    </p>
                    <div className="ml-4">
                      {category.cookies.map((cookie, cookieIndex) => (
                        <div key={cookieIndex} className="mb-2">
                          <p className="text-sm font-medium">{cookie.name}</p>
                          <p className="text-xs text-gray-500">
                            {cookie.purpose}
                          </p>
                          <p className="text-xs text-gray-500">
                            {t("Duration")}: {cookie.duration}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between items-center pt-4">
              <Button
                color="danger"
                variant="light"
                size="sm"
                onPress={handleClearNonEssential}
              >
                {t("Clear non-essential cookies")}
              </Button>
              <Button color="primary" size="sm" onPress={handleSavePreferences}>
                {t("Save Preferences")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
