"use client";
import { useEffect, useState } from "react";
import BlogCard from "@/components/blog-card";
import { Pagination } from "@heroui/pagination";
import { Blog, paginationProps } from "@/types";
import { motion } from "framer-motion";
import Empty from "@/components/Empty";
import api from "@/lib/api";
import { toast } from "@/components/ui/custom-toast";
import { Spinner } from "@heroui/spinner";
import ScrollTracker from "@/hooks/ScrollPageAnalytics";

export default function BlogsList({
  blogs,
  pagination,
}: {
  blogs: { data: Blog[] } | null;
  pagination: paginationProps;
}) {
  const [allBlogs, setBlogs] = useState(blogs?.data);
  const [isLoading, setLoading] = useState(true);
  const [paginate, setPagination] = useState<paginationProps>(pagination);
  const [trackScroll, setTrackScroll] = useState<boolean>(false);

  const fetchBlogs = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.request.get("blogs", {
        params: {
          page,
        },
      });
      const { blogs, pagination } = response;
      setBlogs(blogs);
      setPagination(pagination);

      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast.error("Failed to fetch infos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();

    // Delay ScrollTracker activation until after scroll is reset
    const timeout = setTimeout(() => {
      setTrackScroll(true);
    }, 1500); // adjust delay as needed

    return () => clearTimeout(timeout);
  }, []);

  const handlePageChange = async (page: number) => {
    setTrackScroll(false);
    await fetchBlogs(page);
    setTimeout(() => {
      setTrackScroll(true);
    }, 1500);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-12">
      {
        !isLoading ? (
          <>
            {trackScroll && <ScrollTracker event_name="blogs_scroll_depth" event_category="Blogs_Scroll" />}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {allBlogs && allBlogs.length > 0 ? (
                allBlogs?.map((blog) => (
                  <motion.div key={blog.id} variants={item}>
                    <BlogCard blog={blog} />
                  </motion.div>
                ))
              ) : (
                <Empty className="col-span-full" />
              )}
            </motion.div>

            <div className="mt-16 flex items-center justify-center" dir="ltr">
              <Pagination
                isDisabled={isLoading}
                page={paginate?.current_page}
                total={paginate?.last_page}
                onChange={handlePageChange}
                color="primary"
                className="shadow-md rounded-full p-1.5 bg-white"
                showControls
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center">
            <Spinner />
          </div>
        )
      }
    </div>
  );
}
