"use client";
import { lazy, Suspense, useEffect } from "react";
import moment from "moment";
import { NuqsAdapter } from "nuqs/adapters/react";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { useStore } from "@/store";
import { User } from "@/types";
import { HeroUIProvider } from "@heroui/system";
import NextTopLoader from "nextjs-toploader";
import "moment/dist/locale/ar";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import QueryProvider from "./QueryProvider";
import api from "@/lib/api";

const Toaster = lazy(() => import("@/components/ui/custom-toast").then(mod => ({ default: mod.Toaster })));


const Providers = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { user, setUser } = useStore((store) => store);
  const local = useLocale();
  moment.locale(local);

  const getUserProfile = async () => {
    if (user?.id) {
      try {
        const data = await api.request.get(`profile/${user?.id}`);
        setUser({
          ...data.data,
          token: user?.token,
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    }
  };

  useEffect(() => {
    if (session?.user && (session.user as User).email) {
      setUser(session?.user as User);
      localStorage.setItem("access_token", session?.user?.token);
      Cookies.set("access_token", session?.user?.token);
    }
  }, [session, setUser]);

  useEffect(() => {
    if (user?.id) getUserProfile();
  }, [user?.id]);

  return (
    <QueryProvider>
      <NuqsAdapter>
        <NextTopLoader
          color="#7214d1"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3.1}
          crawl
          showSpinner
          easing="ease"
          speed={200}
          shadow="0 0 10px #c470b2,0 0 5px #c470b2"
          template='<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
          zIndex={1600}
        />
        <HeroUIProvider
          locale={local === "ar" ? "AR-EG" : "en-US"}
          navigate={router.push}
        >
          <Suspense>
            <Toaster />
          </Suspense>
          {children}
        </HeroUIProvider>
      </NuqsAdapter>
    </QueryProvider>
  );
};
export default Providers;
