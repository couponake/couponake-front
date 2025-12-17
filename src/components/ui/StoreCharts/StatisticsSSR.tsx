import { notFound } from 'next/navigation';
import { statisticsType } from '@/types';
import dynamic from 'next/dynamic';

const StoreCharts = dynamic(() => import("@/components/ui/StoreCharts/StoreCharts"), { ssr: true });

export default async function StoreChartsPage({ statistics, store_name }: { statistics: statisticsType, store_name: string }) {

    if (!statistics) {
        notFound();
    }

    return <StoreCharts statistics={statistics} storeName={store_name} />;
}
