"use client";
import React from "react";
import CustomersReviews from "@/components/Pages/Home/CustomersReviews";
import TextCarousel from "@/components/Pages/Home/TextCarousel";
import { useHomeData } from "@/hooks/useHomeData";
import { useInView } from "react-intersection-observer";

const ClientSideComponents = () => {
  const { testimonials, texts, isLoading } = useHomeData();

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref}>
      {
        inView && (
          <>
            <CustomersReviews reviews={testimonials} isLoading={isLoading} page="home" />
            <TextCarousel texts={texts} isLoading={isLoading} />
          </>
        )
      }
    </div>
  );
};

export default ClientSideComponents;
