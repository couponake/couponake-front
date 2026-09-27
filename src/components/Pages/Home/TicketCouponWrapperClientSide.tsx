"use client";
import dynamic from "next/dynamic";

const TicketCoupon = dynamic(
  () => import("../../HomePageComponents/TicketCoupon/TicketCoupon"),
  { ssr: false },
);

function TicketCouponWrapperClientSide() {
  return <TicketCoupon />;
}

export default TicketCouponWrapperClientSide;
