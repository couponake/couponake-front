import { useQuery } from '@tanstack/react-query';
import { HeaderCategory, paginationProps } from '@/types';
import { useStore } from '@/store';
import { toast } from '@/components/ui/custom-toast';
import MyAxios from '@/lib/MyAxios';
import api from '@/lib/api';
import { validateStoresPage, type StoresPageData } from '@/lib/stores-list';

type StoresResponse = StoresPageData;
interface CategoriesResponse {
  data: HeaderCategory[] | null;
  pagination: paginationProps;
  filters?: {
    search: string;
  };
}

interface StoresQueryParams {
  page?: number;
  search?: string;
  category?: string | null;
  country?: string | null;
}

export const useStoresData = () => {
  const { user } = useStore((store) => store);

  const fetchStores = async ({ page = 1, search = '', category = null, country = null }: StoresQueryParams) => {
    try {
      const response = await api.request.get(
        // user?.id ? 'stores' : 'stores/all-stores',
        'stores/all-stores',
        {
          params: {
            page,
            per_page: 50,
            search: search || undefined,
            category: category || undefined,
            country: country || undefined,
          },
        }
      );
      return validateStoresPage(response, page);
    } catch (error) {
      toast.error('Failed to fetch stores. Please try again.');
      throw error;
    }
  };

  return {
    useStoresQuery: (params: StoresQueryParams) =>
      useQuery<StoresResponse>({
        queryKey: ['stores', params.page, params.search, params.category, params.country, !!user?.id],
        queryFn: () => fetchStores(params),
        staleTime: 1000 * 60 * 5, // 5 minutes
      }),
  };
};

export const useCategoriesData = (page = 1) => {
  const fetchCategories = async (pageNumber = 1) => {
    try {
      const { data } = await MyAxios.get('home/categories-data', {
        params: { page: pageNumber },
      });

      return data as CategoriesResponse;
    } catch (error) {
      toast.error('Failed to fetch categories. Please try again.');
      throw error;
    }
  };

  return useQuery({
    queryKey: ['categories', page],
    queryFn: () => fetchCategories(page),
    staleTime: 1000 * 60 * 10, // 10 minutes
    placeholderData: (previousData) => previousData,
  });
};
