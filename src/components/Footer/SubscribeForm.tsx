'use client'
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@heroui/button"
import { Send } from "lucide-react";
import { useEffect, useState } from "react"
import { useStore } from "@/store"
import { emailSchema } from "@/schema"
import { Input } from "../ui/input"
import api from "@/lib/api"
import { toast } from "../ui/custom-toast"

type FormData = {
  email: string
}

const SubscribeForm = () => {
  const t = useTranslations();
  const { user } = useStore((store) => store)
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(emailSchema),
  })

  const onSubmit = async (formData: FormData) => {
    try {
      setIsLoading(true)
      const data = await api.request.post("home/newsletter/subscribe", formData);
 
     if(data?.data){
      toast.success(t("Subscribe successfully"));
      reset({
        email: ""
      })
     }else{
      toast.error(t("Already subscribed with this email"));
     }
      
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    if (user) {
      reset({
        email: user?.email
      })
    }
  }, [user?.id])
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <div>
        <Input
          type="email"
          placeholder={t("Enter your email")}
          {...register("email")}
          className={`w-full`}
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500" role="alert">
            {t(errors.email.message ?? "")}
          </p>
        )}
      </div>
      <Button isLoading={isLoading} startContent={<Send className="h-4 w-4" />} color="primary" type="submit" className="w-full">
        {t("Subscribe")}

      </Button>
    </form>
  )
}

export default SubscribeForm

