import api from "@/lib/api";
import AddDetails from "@/components/Pages/AdPageDetails";
import React from "react";

const AdPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;
  const ad: any = await api.static(`ad/${slug}`);
  return <AddDetails page={ad?.data} />;
};

export default AdPage;
