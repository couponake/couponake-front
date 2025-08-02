import React from "react";
import api from "@/lib/api";
import ShowBrand from "@/components/Pages/Brands/show";


const ShowBrandPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = (await params).slug;
  const brand: any = await api.dynamic(`brands/${slug}`);
  return <ShowBrand slug={slug} {...brand} />;
};

export default ShowBrandPage;
