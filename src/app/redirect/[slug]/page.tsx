import CouponCountDown from "@/components/Pages/CouponCountDown/page";
import api from "@/lib/api";
import {
  couponLandingPageButton,
  couponLandingPageError,
  couponLandingPageResponse,
  couponLandingPageSuccess,
} from "@/types";
import { Avatar } from "@heroui/avatar";
import { ArrowLeft } from "lucide-react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { cache } from "react";

const fallbackTitle = "كوبونات";
const siteLogo = `${process.env.NEXT_PUBLIC_WEBSITE_URL}coupoonatLogo.webp`;

const getCouponLandingPage = cache(async (slug: string) => {
  return api.request.get<couponLandingPageSuccess | couponLandingPageError>(
    `landing-pages/${slug}`,
  );
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const data: couponLandingPageSuccess | couponLandingPageError =
      await getCouponLandingPage(slug);

    if (data.status === "error") {
      notFound();
    }

    const landing_data: couponLandingPageResponse = data.data;

    return {
      // Basic metadata
      title: landing_data.headline,
      description: landing_data.description,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}${landing_data.path}/`,
      },
      robots: {
        index: false,
        follow: false,
      },
      // OpenGraph metadata
      openGraph: {
        title: landing_data.headline,
        description: landing_data.description,
        images: [
          {
            url: siteLogo,
            alt: landing_data.description || fallbackTitle,
          },
        ],
      },

      // Twitter metadata
      twitter: {
        card: "summary_large_image",
        title: landing_data.headline,
        description: landing_data.description,
        images: [
          {
            url: siteLogo,
            alt: landing_data.description || fallbackTitle,
          },
        ],
      },
    };
  } catch {
    return {
      title: "Error Loading Page",
      description: "An error occurred while loading this page",
    };
  }
}

async function CouponLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "ar";
  const isArabic = locale === "ar";

  try {
    const response: couponLandingPageSuccess | couponLandingPageError =
      await getCouponLandingPage(slug);

    if (response.status === "error") {
      notFound();
    }

    const landing: couponLandingPageResponse = response.data;

    const showButtons =
      landing.display_mode === "buttons" || landing.display_mode === "both";

    const showCountdown =
      landing.display_mode === "countdown" || landing.display_mode === "both";

    return (
      <div className="h-fit py-12 max-h-dvh bg-gradient-to-br from-main-50 to-white flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-4 space-y-6">
          <div className="text-center space-y-3">
            {landing.headline && (
              <h1 className="text-xl font-bold text-gray-900">
                {landing.headline}
              </h1>
            )}

            {landing.description && (
              <div className="bg-main-50 rounded-lg p-4 mt-4">
                <p className="text-sm font-mono text-main-800 break-all">
                  {landing.description}
                </p>
              </div>
            )}
          </div>

          {showButtons && landing.buttons.length > 0 && (
            <div className="flex flex-col gap-2 justify-center">
              {landing.buttons.map((button: couponLandingPageButton) => (
                <a
                  href={button.url}
                  key={button.order}
                  target={button.open_in === "new" ? "_blank" : "_self"}
                  rel={
                    button.open_in === "new" ? "noopener noreferrer" : undefined
                  }
                  className="flex items-center justify-between gap-2 px-4 py-3 bg-main-600 rounded-lg hover:bg-main-500 transition-colors text-white font-normal text-sm"
                >
                  {button.image && (
                    <Avatar
                      className="w-8 h-8"
                      src={button.image}
                      alt={button.title}
                    />
                  )}
                  {button.title}
                  <ArrowLeft
                    className={`w-4 h-4 ${!isArabic ? "rotate-180" : ""}`}
                  />
                </a>
              ))}
            </div>
          )}

          {showCountdown && (
            <CouponCountDown
              countdownTime={landing.countdown_seconds}
              redirectURL={landing.redirect_url}
            />
          )}
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}

export default CouponLandingPage;
