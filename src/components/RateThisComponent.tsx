"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { StarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Button } from "@heroui/button";
import { Rate } from "./ui/rate";
import { toast } from "@/components/ui/custom-toast";
import MyAxios from "@/components/MyAxios";
import { Textarea } from "@heroui/input";

// Validation schema using yup
const schema = yup.object({
  rate: yup
    .number()
    .required("Rating is required")
    .min(1, "Rating must be at least 1"),
  description: yup.string().nullable(),
});

type formData = yup.InferType<typeof schema>;

const RateThisComponent = ({
  data,
  route,
  title,
}: {
  data: {
    [key: string]: number;
  };
  route: string;
  title?: string;
}) => {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      rate: 0,
      description: "",
    },
  });

  // Form submission handler
  const onSubmit = async (formData: formData) => {
    try {
      setIsLoading(true);
      await MyAxios.post(route, { ...formData, ...data });
      toast.success(t("Review submitted successfully"));
      reset({
        rate: 0,
        description: "",
      });
    } catch (error) {
      console.log(error);
      toast.error(t("Something went wrong please try again later"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover placement="bottom" title={title ?? t("Rate this")}>
      <PopoverTrigger>
        <button className="text-gray-300 flex items-center gap-2">
          <StarIcon className="size-5 md:size-9" />
          {t("Rate this")}
        </button>
      </PopoverTrigger>
      <PopoverContent className="py-2">
        <h1 className="font-semibold self-start mb-2 text-default-700 truncate max-w-64">
          {title ?? t("Rate this")}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 min-w-64">
          <Controller
            name="rate"
            control={control}
            render={({ field }) => (
              <div>
                <Rate {...field} onChange={field.onChange} />
                {errors.rate && <p className="error">{errors.rate.message}</p>}
              </div>
            )}
          />

          <Textarea
            {...register("description")}
            placeholder={t("Write your review")}
            description={
              errors.description && (
                <p className="error">{errors.description.message}</p>
              )
            }
          />

          <Button
            isLoading={isLoading}
            color="primary"
            type="submit"
            className="w-full"
            name="submit"
          >
            {t("Submit")}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default RateThisComponent;
