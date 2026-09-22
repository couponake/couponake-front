"use client";
import React, { Suspense, useEffect, useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginUserSchema } from "@/schema";
import { signIn } from "next-auth/react";
import { toast } from "@/components/ui/custom-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const AuthPage = () => {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const redirect = searchParams.get("redirect") || "/";
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginUserSchema),
  });
  const onSubmit = async (formData: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const data = await signIn("credentials", {
        redirect: false,
        ...formData,
      });

      if (!error && data?.ok) {
        toast.success(t("Logged in successfully"));
      } else {
        toast.error(t("Wrong email or passowrd"));
        return;
      }
      router.push(redirect);
    } catch (err) {
      console.error("error sing in user" + err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);
  return (
    <section>
      <div className="mb-7">
        <div className="auth-header-wrapper px-3">
          <h1 className="font-bold w-full text-center xs:text-start text-3xl leading-9 mb-12">
            {t("auth.welcome_back")}
          </h1>
        </div>
        <div className="relative z-10 rounded-t-2xl bg-white pt-4 xs:mt-0 xs:pt-0">
          <div className="container grid gap-4">
            <Input
              label={t("auth.email")}
              id="email"
              type="email"
              required
              {...register("email")}
              classNames={{
                description: "error",
              }}
              description={
                errors?.email?.message && t(errors?.email?.message ?? "")
              }
            />

            <Input
              label={t("auth.password")}
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              endContent={
                showPassword ? (
                  <EyeOff
                    onClick={() => setShowPassword(false)}
                    className="text-gray-500 cursor-pointer"
                    role="button"
                    aria-label="toggle show and hide password"
                  />
                ) : (
                  <Eye
                    onClick={() => setShowPassword(true)}
                    className="text-gray-500 cursor-pointer"
                    role="button"
                    aria-label="toggle show and hide password"
                  />
                )
              }
              autoComplete="new-password"
              required
              classNames={{
                description: "error",
              }}
              description={
                errors?.password?.message && t(errors?.password?.message ?? "")
              }
            />

            <Button
              onClick={handleSubmit(onSubmit)}
              className="w-full mt-3 col-span-full rounded-full text-xl py-6"
              size="lg"
              color="primary"
              type="button"
              isLoading={isLoading}
            >
              {t("Continue")}
            </Button>
          </div>
        </div>
      </div>
      {error && <p className="error text-center">{error}</p>}
      <div className="text-center">
        <p className="text-body-5 font-light text-neutral-600">
          {t("auth.dont_have_account")}{" "}
          <Link 
          target="_self" 
          href="/auth" className="font-bold underline">
            {t("auth.register")}
          </Link>
        </p>
      </div>
    </section>
  );
};

// useSearchParams() needs a Suspense boundary so the route can be prerendered.
const AuthPageWithBoundary = () => (
  <Suspense fallback={null}>
    <AuthPage />
  </Suspense>
);

export default AuthPageWithBoundary;
