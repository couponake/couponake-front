"use client";
import ShowAuthorDetails from '@/components/Modals/ShowAuthorDetails';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from '@/components/ui/custom-toast';
import { Rate } from '@/components/ui/rate';
import ScrollTracker from '@/services/ScrollPageAnalytics';
import api from '@/lib/api';
import { secureHtmlLinks } from '@/lib/htmlUtils';
import { useStore } from '@/store';
import { Blog } from '@/types';
import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Textarea } from '@heroui/input';
import { Tooltip } from '@heroui/tooltip';
import { yupResolver } from '@hookform/resolvers/yup';
import { Calendar, CircleUser, Clock } from 'lucide-react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

// Define validation schema for review form
const reviewSchema = yup.object({
  blog_id: yup.number().required(),
  description: yup.string().nullable(),
  rate: yup
    .number()
    .min(1, "Please provide a rating")
    .max(5)
    .required("Rating is required"),
});

type ReviewFormData = yup.InferType<typeof reviewSchema>;

const ShowBlog = ({ blog }: { blog: Blog }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const t = useTranslations();
  const { user } = useStore((store) => store);
  // Initialize form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: yupResolver(reviewSchema),
    defaultValues: {
      blog_id: blog?.id,
      description: "",
      rate: 0,
    },
  });

  const [isDrawerOpened, setIsDrawerOpened] = useState<boolean>(false);
  const openResponsibleDrawer = () => {
    setIsDrawerOpened(true);
  };

  // Handle form submission
  const onSubmit = async (formData: ReviewFormData) => {
    setIsSubmitting(true);
    try {
      const data = await api.request.post(
        `blogs/${blog?.slug}/review`,
        formData
      );
      toast.success(data?.message);
      setReviewSubmitted(true);
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ScrollTracker event_name={`${blog.slug}_blog_view`} event_category={`${blog.slug}_Scroll`} />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Blog Content */}
        <Card className="mb-8 shadow-lg border-none">
          {blog?.image && (
            <div className="w-full h-64 relative overflow-hidden pt-3">
              <Image
                height={256}
                width={600}
                src={blog?.image}
                alt={blog?.image_alt || blog?.title}
                className="w-full h-full object-contain"
                unoptimized
              />
            </div>
          )}
          <CardHeader className="flex flex-col items-start gap-2 px-6 pt-6 pb-0">
            <div className="flex flex-wrap gap-2">
              {blog?.category_id &&
                JSON.parse(blog?.category_id)?.map(
                  (category: string, index: number) => (
                    <Chip
                      key={index}
                      color="primary"
                      variant="flat"
                      radius="sm"
                      className="text-xs"
                    >
                      {category}
                    </Chip>
                  )
                )}
            </div>
            <h1 className="text-3xl md:text-4xl md:leading-[3.5rem] font-bold text-foreground mt-2">
              {blog?.title}
            </h1>
            <div className="w-full flex flex-wrap items-center gap-5 text-sm text-default-500 mt-2">
              <div className="min-w-max flex flex-nowrap items-center gap-1">
                <Calendar size={16} />
                <span>{moment(blog?.created_at).format("MMMM D, YYYY")}</span>
              </div>
              <div className="min-w-max flex flex-nowrap items-center gap-1">
                <Clock size={16} />
                <span>{moment(blog?.created_at).format("h:mm A")}</span>
              </div>
              <Tooltip content={`${blog?.rate || 0} rating`}>
                <div className="flex items-center gap-1">
                  <Rate defaultValue={parseFloat(blog?.rate) || 0} readOnly />
                  <span>({blog?.voters || 0})</span>
                </div>
              </Tooltip>
              {
                blog?.responsible?.name && (
                  <div
                    className="flex justify-start items-center gap-2 text-black/50 hover:text-main-500 transition-colors duration-300 cursor-pointer"
                    onClick={openResponsibleDrawer}
                  >
                    <CircleUser size={16} />
                    <p className="text-sm">
                      {t("Author")}{":"}{blog?.responsible?.name}
                    </p>
                  </div>
                )
              }
            </div>
          </CardHeader>
          <CardContent className="px-6 py-4">
            <div
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-xl prose-img:shadow-lg transition-all duration-300"
              dangerouslySetInnerHTML={{ __html: secureHtmlLinks(blog?.content as string) }}
            />
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("Reviews")}</h2>
          {blog?.review && blog?.review.length > 0 ? (
            <div className="space-y-4">
              {blog?.review?.map((review, index) => (
                <Card key={index} className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar
                        name={review.name || "Anonymous"}
                        size="md"
                        showFallback
                        className="bg-primary-100"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <p className="font-medium">
                              {review?.created_by?.name || "Anonymous"}
                            </p>
                            <p className="text-xs text-default-500">
                              {moment(review.created_at).format("MMMM D, YYYY")}
                            </p>
                          </div>
                          <Rate
                            defaultValue={parseFloat(review?.rate || "0") || 0}
                            readOnly
                          />
                        </div>
                        <p className="text-default-700">{review.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-sm">
              <CardContent className="p-4 text-center text-default-500">
                {t("No reviews yet. Be the first to share your thoughts")}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Review Form */}
        {!reviewSubmitted ? (
          <Card className="shadow-md">
            <CardHeader className="pb-0 pt-6 px-6">
              <h2 className="text-xl font-bold">{t("Write a Review")}</h2>
            </CardHeader>
            <CardContent className="px-6 py-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input type="hidden" name="blog_id" value={blog?.id} />
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("Your Rating")}
                  </label>
                  <Controller
                    name="rate"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Rate
                          defaultValue={field.value || 0}
                          onChange={field.onChange}
                        />
                        {errors.rate && (
                          <p className="text-red-500 text-xs mt-1">
                            {t(errors.rate.message ?? "")}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("Your Review")}
                  </label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        value={field.value ?? ''}
                        minRows={3}
                        variant="bordered"
                        className="w-full"
                      />
                    )}
                  />
                </div>
                {user ? (
                  <Button
                    type="submit"
                    color="primary"
                    className="w-full"
                    isLoading={isSubmitting}
                  >
                    {t("Submit")}
                  </Button>
                ) : (
                  <Link
                    target="_blank"
                    href={`/auth/login?redirect=/${blog?.slug}`}
                    className="block"
                  >
                    <Button type="button" color="primary" className="w-full">
                      {t("Please to login to add a comment")}
                    </Button>
                  </Link>
                )}
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-md bg-success-50">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold text-success mb-2">
                {t("Thank You")}
              </h3>
              <p className="text-success-700">
                {t("Your review has been submitted successfully")}
              </p>
            </CardContent>
          </Card>
        )}

        {isDrawerOpened && (
          <ShowAuthorDetails
            author={blog?.responsible}
            openDrawer={isDrawerOpened}
            onClose={() => setIsDrawerOpened(!isDrawerOpened)}
          />
        )}
      </main>
    </>
  );
};

export default ShowBlog;
