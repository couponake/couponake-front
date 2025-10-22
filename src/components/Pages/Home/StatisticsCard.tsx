import type React from "react";
import { Store, Ticket, Users } from "lucide-react";
import { useTranslations } from "next-intl";

interface StatisticsProps {
  collection_count: {
    stores: number;
    coupons: number;
    users: number;
  };
}

export default function StatisticsCard({ collection_count }: StatisticsProps) {
  const t = useTranslations();
  return (
    <div className="w-full min-h-fit bg-gradient-to-br from-purple-100 to-main-100 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="p-2 md:p-4">
        <h1 className="text-sm md:text-lg lg:text-2xl xl:text-2xl 2xl:text-3xl text-center font-bold text-gray-800 mb-4 md:mb-8">
          {t("Coupoonat discount coupons")}
        </h1>
        <div className="grid grid-cols-3 gap-4 sm:gap-6 place-items-center">
          <StatItem
            icon={<Store className="w-8 h-8 text-purple-500" />}
            label={t("statistics.stores")}
            value={collection_count.stores}
          />
          <StatItem
            icon={<Ticket className="w-8 h-8 text-main-500" />}
            label={t("Coupons")}
            value={collection_count.coupons}
          />
          <StatItem
            icon={<Users className="w-8 h-8 text-green-500" />}
            label={t("statistics.users")}
            value={collection_count.users}
          />
        </div>
      </div>
      <div className="bg-gradient-to-r from-purple-500 to-main-500 h-2" />
    </div>
  );
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <div className="w-full flex items-center justify-center gap-x-4">
      <div className="bg-white p-3 rounded-full shadow-md max-sm:hidden">
        {icon}
      </div>
      <div>
        <div className="text-sm md:text-xl lg:text-2xl xl:text-2xl font-bold text-gray-800">{value}</div>
        <div className="text-xs md:text-md lg:text-lg xl:text-lg text-gray-600">{label}</div>
      </div>
    </div>
  );
}
