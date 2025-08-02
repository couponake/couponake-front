'use client';
import dynamic from 'next/dynamic';
import React from 'react'

const TicketCoupon = dynamic(() => import('../../ui/TicketCoupon/TicketCoupon'), { ssr: false });

function TicketCouponWrapperClientSide() {
    return (
        <div className='mb-14'>
            <TicketCoupon />
        </div>
    )
}

export default TicketCouponWrapperClientSide
