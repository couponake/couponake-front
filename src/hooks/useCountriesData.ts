import { useQuery } from '@tanstack/react-query';

export const useCountriesData = () => {
  const fetchCountries = async () => {
    const response = await fetch('/api/reference-data/countries/', { credentials: 'omit' });
    if (!response.ok) throw new Error('Countries temporarily unavailable');
    const payload: unknown = await response.json();
    const data = (payload as { data?: unknown } | null)?.data;
    if (!Array.isArray(data) || !data.every(item => typeof item === 'string' && item.trim())) {
      throw new Error('Invalid countries response');
    }
    return data as string[];
  };

  return useQuery({
    queryKey: ['public-country-options'],
    queryFn: fetchCountries,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
