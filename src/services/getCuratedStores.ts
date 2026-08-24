import { api } from "@/lib/MyAxios";
import { CuratedStoresResponse, CuratedStore } from "@/types";

export async function getCuratedStores(): Promise<CuratedStore[]> {
  const response = await api.static<CuratedStoresResponse>(
    "similar-stores",
    60 * 60,
  );
  
  return response.data ?? [];
}