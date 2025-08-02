"use client";

import { Button } from "@heroui/button";
import { Home, RefreshCw, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const t = useTranslations();
  return (
    <div className="min-h-dvh bg-gradient-to-br from-main-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="flex justify-center">
          <div className="bg-main-100 p-3 rounded-full">
            <TriangleAlert className="w-12 h-12 text-main-600" />
          </div>
        </div>

        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">
            {t("error.title")}
          </h2>

          <p className="text-gray-600">{t("error.description")}</p>

          <div className="bg-main-50 rounded-lg p-4 mt-4">
            <p className="text-sm font-mono text-main-800 break-all">
              {error.message}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
          <Button
            onPress={reset}
            startContent={<RefreshCw className="w-4 h-4" />}
            color="primary"
            variant="light"
          >
            {t("error.tryAgain")}
          </Button>

          <Button
            onPress={() => (window.location.href = "/")}
            startContent={<Home className="w-4 h-4" />}
            color="primary"
          >
            {t("error.goHome")}
          </Button>
        </div>
      </div>
    </div>
  );
}
