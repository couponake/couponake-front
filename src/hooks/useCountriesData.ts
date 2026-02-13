import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/ui/custom-toast';
import api from '@/lib/api';

export const useCountriesData = () => {
  const fetchCountries = async () => {
    try {
      const data = await api.request.get('home/countries?per_page=-1');
      return data?.data || [];
    } catch {
      toast.error('Failed to fetch countries. Please try again.');
      return [];
    }
  };

  return useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries,
    staleTime: 1000 * 60 * 30, // 30 minutes cache
    refetchOnWindowFocus: false,
  });
};