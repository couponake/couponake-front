import { Blog, HeaderCategory, StoreProps } from "@/types";
import api from "./api";

//blogs data with slugs
export async function getAllBlogsData(
  pageNumber: number
): Promise<{ slugs: string[]; lastmods: (string | undefined)[]; totalPages: number }> {
  try {
    const slugs: string[] = [];
    const lastmods: (string | undefined)[] = [];
    const pageRequired = pageNumber;
    let totalPages: number = 0;
    const perPage: number = 300;

    const res: any = await api.static(
      `blogs?page=${pageRequired}&per_page=${perPage}`,
      3600
    );
    const blogs = res.blogs as Blog[];
    slugs.push(...blogs.map((b) => b.slug));
    lastmods.push(...blogs.map((b) => b.content_updated_at));
    totalPages = res.pagination.last_page;

    if (Number(pageRequired) > Number(totalPages)) {
      return { slugs: [], lastmods: [], totalPages: 0 };
    }

    return { slugs, lastmods, totalPages };
  } catch (error) {
    console.error("Failed to fetch all blogs slugs:", error);
    return { slugs: [], lastmods: [], totalPages: 0 };
  }
}

//store data with images and slugs
export async function getAllStoresData(
  pageNumber: number
): Promise<{ images: string[]; totalPages: number; storesSlugs: string[]; lastmods: (string | undefined)[] }> {
  try {
    const images: string[] = [];
    const pageRequired = pageNumber;
    let totalPages: number = 0;
    const storesSlugs: string[] = [];
    const lastmods: (string | undefined)[] = [];
    const perPage: number = 50;

    const res: any = await api.static(
      `stores/all-stores?page=${pageRequired}&per_page=${perPage}`,
      3600
    );
    const stores = res.stores as StoreProps[];
    images.push(...stores.map((b) => b.image));
    totalPages = res.pagination.last_page;
    storesSlugs.push(...stores.map((b) => b.slug));
    lastmods.push(...stores.map((b) => b.content_updated_at));

    if (Number(pageRequired) > Number(totalPages)) {
      return { images: [], totalPages: 0, storesSlugs: [], lastmods: [] };
    }

    return { images, totalPages, storesSlugs, lastmods };
  } catch (error) {
    console.error("Failed to fetch stores data:", error);
    return { images: [], totalPages: 0, storesSlugs: [], lastmods: [] };
  }
}

export async function getAllCountries(): Promise<string[]> {
  try {
    const countries: string[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const res: any = await api.static(
        `home/countries-meta?page=${page}&per_page=300`,
        3600
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
    const slugs: string[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const res: any = await api.static(
        `home/categories-data?page=${page}&per_page=300`,
        3600
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
