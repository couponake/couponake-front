import Link from "next/link";
import { Calendar, ArrowRight, ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import moment from "moment";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@heroui/button";

interface Blog {
  id: number;
  title: string;
  content: string;
  image: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
  rate: string;
  review: any[];
}

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const t = useTranslations();
  const locale = useLocale();
  // Function to extract the first paragraph from the HTML content
  const getExcerpt = (html: string, maxLength = 100) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const ArrowIcon = () => {
    // Use the appropriate arrow based on text direction
    return locale === "ar" ? (
      <ArrowLeft className="h-4 w-4" />
    ) : (
      <ArrowRight className="h-4 w-4" />
    );
  };

  return (
    <Link
      target="_self"
      href={`/${blog?.slug}`}
      onClick={() => {
        if (typeof (window as any).gtag === "function") {
          (window as any).gtag("event", "blog_click", {
            blog_title: blog?.title,
            blog_id: blog?.id,
            event_category: "Blog",
          });
        }
      }}
    >
      <Card
        className="overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-none rounded-xl shadow-md"
        dir="auto"
      >
        {blog?.image && (
          <div className="aspect-video overflow-hidden relative">
            <img
              src={blog?.image || "/placeholder.svg"}
              alt={blog?.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}

        <CardContent className="flex flex-col gap-2">
          <h2 className="text-xl font-bold line-clamp-3 group-hover:text-primary-600 transition-colors pb-2 pt-5">
            {blog?.title}
          </h2>
          <p className="text-gray-600 line-clamp-3 mb-4 text-sm">
            {getExcerpt(blog?.content, 120)}
          </p>
        </CardContent>

        <CardFooter className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 me-2" />
            <span>{moment(blog?.created_at).format("DD MMM, YYYY")}</span>
          </div>

          <Button endContent={<ArrowIcon />} variant="flat">
            {t("Read more")}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
