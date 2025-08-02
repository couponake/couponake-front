import { notFound } from 'next/navigation';
import { statisticsType } from '@/types';
import { useLocale, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

const StoreCharts = dynamic(() => import("@/components/ui/StoreCharts/StoreCharts"), { ssr: true });

export default async function StoreChartsPage({ statistics, store_name }: { statistics: statisticsType, store_name: string }) {
    const locale = useLocale();
    const t = useTranslations();

    if (!statistics) {
        notFound();
    }

    return <StoreCharts statistics={statistics} t={t} locale={locale} storeName={store_name} />;
}
