"use client";
import React, { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema } from "@/schema";

import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { toast } from "@/components/ui/custom-toast";
import { InferType } from "yup";
import { signIn } from "next-auth/react";
import MyAxios from "@/lib/MyAxios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Label } from "@/components/ui/label";

type FormData = InferType<typeof signUpSchema>;

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  const onSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const { data } = await MyAxios.post("user-auth/register", formData);
      if (data?.status) {
        const loginData = await signIn("credentials", {
          redirect: false,
          email: formData?.email,
          password: formData?.password,
        });

        if (!loginData?.ok) {
          return toast.error(data?.error);
        }
        toast.success(data?.message);
        router.push("/");
      } else {
        toast.error(data?.message);
      }
    } catch (err: any) {
      console.error("error sing up user", err);
      toast.error(err?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <div className="mb-7">
        <div className="auth-header-wrapper px-3">
          <h1 className="font-bold w-full text-center xs:text-start text-3xl leading-9 mb-12">
            {t("auth.register")}
          </h1>
          {/* <p className="auth-form-subtitle mb-12 text-center xs:text-start text-base leading-6 font-light text-gray-700">
            To start your saving journey 🤩, please enter your mobile number or
            email address
          </p> */}
        </div>
        <div className="relative z-10 rounded-t-2xl bg-white pt-4 xs:mt-0 xs:pt-0">
          <div className="container grid gap-4">
            <Input
              label={t("auth.name")}
              {...register("name")}
              required
              classNames={{
                description: "error",
              }}
              description={
                errors?.name?.message && t(errors?.name?.message ?? "")
              }
              id="name"
            />

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

            <Input
              label={t("auth.confirm_password")}
              id="password_confirmation"
              type={showPassword ? "text" : "password"}
              {...register("password_confirmation")}
              autoComplete="new-password"
              required
              classNames={{
                description: "error",
              }}
              description={
                errors?.password_confirmation?.message &&
                t(errors?.password_confirmation?.message ?? "")
              }
            />
            <div className="col-span-full">
              <Label className="rtl:text-right">{t("Phone Number")}</Label>
              <div className="mt-2">
                <PhoneInput
                  className="rounded-lg border-1 min-h-11 hover:border-main-400 transition text-gray-500 bg-gray-100"
                  onChange={(phone) =>
                    setValue("phone", phone, {
                      shouldValidate: true,
                    })
                  }
                  defaultCountry="eg"
                />
                {errors.phone?.message && (
                  <p className="error">{t(errors.phone?.message ?? "")}</p>
                )}
              </div>
            </div>
            <Button
              onClick={handleSubmit(onSubmit)}
              className="w-full mt-3 col-span-full rounded-full text-xl py-6"
              size="lg"
              color="primary"
              type="button"
              isLoading={isLoading}
            >
              <div>{t("Continue")}</div>
            </Button>
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-body-5 font-light text-neutral-600">
          {t("auth.already_have_account")}{" "}
          <Link
            target="_self"
            href="/auth/login"
            className="font-bold underline"
          >
            {t("auth.login")}
          </Link>
        </p>
      </div>
    </section>
  );
};

export default AuthPage;
