'use client';
import { useHomeData } from '@/hooks/useHomeData';
import dynamic from 'next/dynamic';
import { useInView } from 'react-intersection-observer';

const AdsSection = dynamic(() => import('./AdsSection'), { ssr: false });

function AdsWrapperClientSide() {
    const { ads, isLoading } = useHomeData();
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

     if (ads?.length === 0) return null;

    return (
        <div ref={ref}>
            {inView && <AdsSection ads={ads} isLoading={isLoading} />}
        </div>
    );
}

export default AdsWrapperClientSide
