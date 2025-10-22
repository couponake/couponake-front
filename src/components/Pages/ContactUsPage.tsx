"use client";
import "react-international-phone/style.css";

import { toast } from "@/components/ui/custom-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { Button } from "@heroui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { PhoneInput } from "react-international-phone";
import { BreadcrumbList, ContactPage } from "schema-dts";
import { InferType, object, string } from "yup";
const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;

// Contact form validation schema
const contactSchema = object().shape({
  name: string()
    .required("validation.name_required")
    .max(255, "validation.name_max"),
  email: string()
    .email("validation.valid_email")
    .required("validation.email_required")
    .max(255, "validation.email_max"),
  phone: string().nullable().max(20, "validation.phone_max"),
  subject: string()
    .required("validation.subject_required")
    .max(255, "validation.subject_max"),
  message: string().required("validation.message_required"),
  website: string().nullable(),
});

type ContactFormData = InferType<typeof contactSchema>;

const ContactUsPage = () => {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      website: "",
    },
  });

  const onSubmit = async (formData: ContactFormData) => {
    if (formData.website) {
      // console.warn("Spam detected - honeypot triggered");
      return; // 👈 Do nothing or optionally show a fake success message
    }

    setIsSubmitting(true);
    try {
      Object.entries(formData).forEach(([key, value]) => {
        if (value === null || value === "" || value === undefined) {
          delete formData[key as keyof typeof formData];
        }

        if (
          key === "phone" &&
          (value === null || value?.toString().length <= 3)
        ) {
          delete formData[key as keyof typeof formData];
        }
      });

      const data = await api.request.post("home/send/contact", formData);
      toast.success(t("Your message has been sent successfully"));
      setSubmitted(true);
      reset();
    } catch (error) {
      console.error(t("Error submitting contact form:"), error);
      toast.error(t("Failed to send your message"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbSchema: BreadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "الرئيسية",
        item: websiteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "اتصل بنا",
        item: `${websiteUrl}contact/`,
      },
    ],
  } as BreadcrumbList & { "@context": string };

  const contactPageSchema: ContactPage = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "اتصل بنا - كوبونات",
    url: `${websiteUrl}contact/`,
    description: t("contact.desc"),
  } as ContactPage & { "@context": string };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white -mt-5">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t("Contact Us")}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("contact.desc")}
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8 transition-all duration-300 hover:shadow-md">
            {submitted ? (
              <div className="text-center py-10">
                <div className="mb-6 text-green-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("Thank You")}
                </h2>
                <p className="text-gray-600 mb-6">
                  {t("Your message has been received")}
                </p>
                <Button
                  color="primary"
                  className="gradient-btn"
                  onPress={() => setSubmitted(false)}
                >
                  {t("Send Another Message")}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <input
                  type="text"
                  {...register("website")}
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ display: "none" }}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      label={t("auth.name")}
                      {...register("name")}
                      required
                      classNames={{
                        description: "error",
                      }}
                      description={
                        errors?.name?.message && t(errors?.name?.message)
                      }
                    />
                  </div>

                  <div>
                    <Input
                      label={t("auth.email")}
                      type="email"
                      {...register("email")}
                      required
                      classNames={{
                        description: "error",
                      }}
                      description={
                        errors?.email?.message && t(errors?.email?.message)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="rtl:text-right">
                      {t("Phone Number")}
                    </Label>
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
                        <p className="error">{t(errors.phone?.message)}</p>
                      )}
                    </div>
                  </div>

                  <div className="md:mt-2.5">
                    <Input
                      label={t("Subject")}
                      {...register("subject")}
                      required
                      classNames={{
                        description: "error",
                      }}
                      description={
                        errors?.subject?.message && t(errors?.subject?.message)
                      }
                    />
                  </div>
                </div>

                <div>
                  <Textarea
                    label={t("Message")}
                    {...register("message")}
                    required
                    classNames={{
                      description: "error",
                    }}
                    description={
                      errors?.message?.message && t(errors?.message?.message)
                    }
                  />
                </div>

                <div className="flex justify-center mt-8">
                  <Button
                    type="submit"
                    color="primary"
                    className="gradient-btn px-8 py-6 text-lg"
                    size="lg"
                    isLoading={isSubmitting}
                  >
                    {t("Send Message")}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
};

export default ContactUsPage;
