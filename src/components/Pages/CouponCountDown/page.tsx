"use client";
import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function CouponCountDown({
  countdownTime = 25,
  redirectURL,
}: {
  countdownTime: number;
  redirectURL: string | null;
}) {
  const t = useTranslations();
  const [countdown, setCountdown] = useState<number>(countdownTime);
  const router = useRouter();

  useEffect(() => {
    if (countdown === 0) return;

    const timer = setTimeout(() => {
      setCountdown((c) => c - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  // Redirect
  useEffect(() => {
    if (countdown !== 0) return;

    if (redirectURL) {
      window.open(redirectURL, "_self", "noopener,noreferrer");
    }
  }, [countdown, redirectURL, router]);

  return (
    <div className="flex flex-col gap-3 items-center justify-center border-t border-main-100 pt-4">
      <p>{countdown > 0 ? t("redirecting") : t("redirected")}</p>
      {countdown > 0 && (
        <div className="flex gap-3 items-center justify-center">
          <LoaderCircle className="w-6 h-6 text-main-600 animate-spin" />
          <p className="text-md">
            <span className="text-2xl px-2">{countdown}</span>
            {t("second")}
          </p>
        </div>
      )}
    </div>
  );
}

export default CouponCountDown;
