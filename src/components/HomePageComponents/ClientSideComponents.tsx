"use client";
import React from "react";
import { useInView } from "react-intersection-observer";
import dynamic from 'next/dynamic';
import { useHomeData } from "@/hooks/useHomeData";

const CustomersReviews = dynamic(() => import("@/components/Pages/Home/CustomersReviews"));
const TextCarousel = dynamic(() => import("@/components/Pages/Home/TextCarousel"));

const ClientSideComponents = () => {
  const { testimonials, texts, isLoading } = useHomeData();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '200px 0px',
  });

  return (
    <div ref={ref} className="min-h-[400px]">
      {inView ? (
        <>
          <TextCarousel
            texts={texts}
            isLoading={isLoading}
          />
          <CustomersReviews
            reviews={testimonials}
            isLoading={isLoading}
            page="home"
          />
        </>
      ) : (
        <div className="h-full w-full animate-pulse bg-gray-50" />
      )}
    </div>
  );
};

export default ClientSideComponents;