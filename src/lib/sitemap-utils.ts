import { Blog, HeaderCategory, StoreProps } from "@/types";
import api from "./api";

//blogs data with slugs
export async function getAllBlogsData(
  pageNumber: number
): Promise<{ slugs: string[]; totalPages: number }> {
  try {
    let slugs: string[] = [];
    let pageRequired = pageNumber;
    let totalPages: number = 0;
    let perPage: number = 300;

    const res: any = await api.dynamic(
      `blogs?page=${pageRequired}&per_page=${perPage}`
    );
    const blogs = res.blogs as Blog[];
    slugs.push(...blogs.map((b) => b.slug));
    totalPages = res.pagination.last_page;

    if (Number(pageRequired) > Number(totalPages)) {
      return { slugs: [], totalPages: 0 };
    }

    return { slugs, totalPages };
  } catch (error) {
    console.error("Failed to fetch all blogs slugs:", error);
    return { slugs: [], totalPages: 0 };
  }
}

//store data with images and slugs
export async function getAllStoresData(
  pageNumber: number
): Promise<{ images: string[]; totalPages: number; storesSlugs: string[] }> {
  try {
    let images: string[] = [];
    let pageRequired = pageNumber;
    let totalPages: number = 0;
    let storesSlugs: string[] = [];
    let perPage: number = 50;

    const res: any = await api.dynamic(
      `stores/all-stores?page=${pageRequired}&per_page=${perPage}`
    );
    const stores = res.stores as StoreProps[];
    images.push(...stores.map((b) => b.image));
    totalPages = res.pagination.last_page;
    storesSlugs.push(...stores.map((b) => b.slug));

    if (Number(pageRequired) > Number(totalPages)) {
      return { images: [], totalPages: 0, storesSlugs: [] };
    }

    return { images, totalPages, storesSlugs };
  } catch (error) {
    console.error("Failed to fetch stores data:", error);
    return { images: [], totalPages: 0, storesSlugs: [] };
  }
}

export async function getAllCountries(): Promise<string[]> {
  try {
    let countries: string[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const res: any = await api.dynamic(
        `home/countries-meta?page=${page}&per_page=300`
      );
      countries.push(...res.data.map((c: { name: string }) => c.name));

      const meta = res.meta;
      hasMore = meta && page < meta.last_page;
      page++;
    }

    return countries;
  } catch (error) {
    console.error("Failed to fetch all countries:", error);
    return [];
  }
}

// Get all categories data with slugs
export async function getAllCategories(): Promise<string[]> {
  try {
    let slugs: string[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const res: any = await api.dynamic(
        `home/categories-data?page=${page}&per_page=300`
      );
      const categories = res.data as HeaderCategory[];
      slugs.push(...categories.map((b) => b.slug));

      const meta = res.pagination;
      hasMore = meta && page < meta.last_page;
      page++;
    }
    return slugs;
  } catch (error) {
    console.error("Failed to fetch categories-data:", error);
    return [];
  }
}
