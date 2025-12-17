"use client";
import React from "react";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { updateProfileSchema } from "@/schema";
import { useTranslations } from "next-intl";
import { useStore } from "@/store";
import { Button } from "@heroui/button";
import { useSession } from "next-auth/react";
import { InferType } from "yup";
import { toast } from "@/components/ui/custom-toast";
import { logout } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";

type fromData = InferType<typeof updateProfileSchema>

const AccountDetails = () => {
  const t = useTranslations();
  const { user } = useStore((store) => store);
  const { update } = useSession()
  // const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(updateProfileSchema),
  });

  // Function to call on form submit
  const onSubmit = async (formData: fromData) => {
    setIsLoading(true);
    // console.log(formData)
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("_method", 'PUT');
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      if (formData.image) {
        formDataToSend.append("image", formData?.image  as Blob);
      }
      if (formData.password) {
        formDataToSend.append("password", formData.password);
      }
      if (formData.password_confirmation) {
        formDataToSend.append("password_confirmation", formData.password_confirmation);
      }
      const data = await api.request.post(`user-auth/update/${user?.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await update({
        ...data.user,
      });
      toast.success(data?.message)
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user]);
  return (
    <form
      className="flex flex-1 flex-col items-start justify-start"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="mb-8 text-3xl font-bold max-md:hidden">{t("Account Details")}</h1>
      <div className="w-full rounded-2xl border-solid border-neutral-100 px-0 py-4 md:border md:p-8">
        <div className="mb-4 flex flex-col gap-7">
          <Input
            label={t("Full name")}
            {...register("name")}
            description={errors.name?.message && t(errors.name?.message ?? "")}
            classNames={{
              description: "error",
              wrapper: "!mt-2"
            }}
          />
          <Input
            label={t("auth.email")}
            {...register("email")}
            description={
              errors.email?.message && t(errors.email?.message ?? "")
            }
            classNames={{
              description: "error",
              wrapper: "!mt-2"
            }}
            readOnly
          />
          <div className="">
            <Label className="rtl:text-right">
              {t("Phone Number")}
            </Label>
            <div >
              <PhoneInput
                className="rounded-lg mt-2 border-1 min-h-11 hover:border-main-400 transition text-gray-500 bg-gray-100"
                onChange={(phone) =>
                  setValue("phone", phone, {
                    shouldValidate: true, shouldDirty: true
                  })
                }
                value={user?.phone ?? ""}
                defaultCountry="eg"
              />
              {
                errors.phone?.message && <p className="error">{t(errors.phone?.message ?? "")}</p>
              }
            </div></div>
          <Input
            label={t("Profile Picture")}
            // {...register("image")}
            onChange={(e) => setValue("image", e.target.files?.[0], {
              shouldValidate: true,
              shouldDirty: true
            })}
            type="file"
            description={
              errors.image?.message && t(errors.image?.message ?? "")
            }
            classNames={{
              description: "error",
              wrapper: "!mt-2"
            }}
            accept="image/*"
          />
          <div className="mt-3 w-full flex flex-wrap items-start justify-between gap-5">
            <Button
              color="primary"
              variant="solid"
              size="lg"
              className="px-9 rounded-full"
              type="submit"
              isLoading={isLoading} isDisabled={!isDirty}
            >
              {t("Save")}
            </Button>
            <Button
              color="danger"
              variant="solid"
              type="button"
              size="lg"
              className="px-9 rounded-full"
              onPress={logout}

            >
              {t("auth.logout")}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AccountDetails;
